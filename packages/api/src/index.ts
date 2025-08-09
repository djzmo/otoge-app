import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { SearchByText } from "./endpoints/searchByText";
import { SearchByPosition } from "./endpoints/searchByPosition";
import {createClient} from "@supabase/supabase-js";

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.get("/store/searchByText/", SearchByText);
router.get("/store/searchByPosition/", SearchByPosition);

// 404 for everything else
router.all("*", () =>
	Response.json(
		{
			success: false,
			error: "Route not found",
		},
		{ status: 404 }
	)
);

export default {
	fetch: router.handle,
	async scheduled(
		event: ScheduledEvent,
		env: any,
		context: any
	) {
		const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
		const result: R2Objects = await env.OTOGE_APP_BUCKET.list();
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		for (const object of result.objects) {
			const objectBody: R2ObjectBody = await env.OTOGE_APP_BUCKET.get(object.key);
			const country = objectBody.key.split(".")[0]
			const existing = await supabase.from("store")
				.select("count(*)")
				.eq("country", country);

			// Skip if we have existing data and there is no new data
			if (existing.count > 0 && objectBody.uploaded.getTime() < yesterday.getTime()) {
				continue;
			}

			const contents = await new Response(objectBody.body).text();
			const stores = JSON.parse(contents);
			const inserts = [];

			for (const store of stores) {
				if (store.lng == null || store.lat == null) {
					console.error(`Position is empty for ${store.storeName}`);
					continue;
				}

				inserts.push({
					country: store.country,
					area: store.area,
					store_name: store.storeName,
					address: store.address,
					alternate_area: store.alternateArea,
					alternate_store_name: store.alternateStoreName,
					alternate_address: store.alternateAddress,
					location: `POINT(${store.lng} ${store.lat})`,
					lat: store.lat,
					lng: store.lng,
					cabinets: store.cabinets,
					context: store.context,
					access: store.access,
					opening_hours: store.openingHours,
				});
			}

			const { error: deleteError } = await supabase.from("store")
				.delete()
				.match({ country });

			if (deleteError) {
				throw deleteError;
			}

			const { error: insertError } = await supabase.from("store")
				.insert(inserts);

			if (insertError) {
				throw insertError;
			}
		}
	}
};
