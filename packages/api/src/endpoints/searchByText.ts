import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Query,
} from "@cloudflare/itty-router-openapi";
import {Store} from "../types";
import {createClient} from "@supabase/supabase-js";
import {filterAndSort} from "../util";

export class SearchByText extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Store"],
		summary: "Search by query text",
		parameters: {
			query: Query(String, {
				description: "Text to search"
			}),
		},
		responses: {
			"200": {
				description: "Returns a list of stores",
				schema: [Store]
			},
		},
	};

	async handle(
		request: Request,
		env: any,
		context: any,
		data: Record<string, any>
	) {
		const { query } = data.query;

		const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
		const { data: result, error } = await supabase.from('store')
			.select("*")
			.or(`store_name.ilike.%${query}%, alternate_store_name.ilike.%${query}%, address.ilike.%${query}%, alternate_address.ilike.%${query}%, area.ilike.%${query}%, alternate_area.ilike.%${query}%, country.ilike.%${query}%`);

		if (error) {
			throw error;
		}

		console.log(result[0]);

		const response = result.map(row => ({
			country: row.country,
			area: row.area,
			storeName: row.store_name,
			address: row.address,
			alternateArea: row.alternate_area,
			alternateStoreName: row.alternate_store_name,
			alternateAddress: row.alternate_address,
			cabinets: row.cabinets,
			context: row.context,
			access: row.access,
			openingHours: row.opening_hours,
			lat: row.lat,
			lng: row.lng,
		}));

		return new Response(JSON.stringify(filterAndSort(response)), {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json",
			}
		})
	}
}
