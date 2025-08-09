import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Query,
} from "@cloudflare/itty-router-openapi";
import { Store } from "../types";
import {createClient} from "@supabase/supabase-js";
import {filterAndSort} from "../util";

export class SearchByPosition extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Store"],
		summary: "Search by latitude and longitude",
		parameters: {
			lat: Query(Number, {
				description: "Latitude",
			}),
			lng: Query(Number, {
				description: "Longitude",
			}),
		},
		responses: {
			"200": {
				description: "Returns a list of stores",
				schema: [Store],
			},
		},
	};

	async handle(
		request: Request,
		env: any,
		context: any,
		data: Record<string, any>
	) {
		const { lat, lng } = data.query;
		const tryRadius = [2000, 5000, 10000, 20000];

		const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
		const response = [];

		for (const radius of tryRadius) {
			const { data: resultForRadius, error } = await supabase.rpc("search_by_position", {
				center_lat: lat,
				center_lng: lng,
				distance_meters: radius
			});

			if (error) {
				throw error;
			}

			response.push(...resultForRadius.map(row => ({
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
			})));

			if (response.length > 0) {
				break;
			}
		}

		return new Response(JSON.stringify(filterAndSort(response)), {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json",
			}
		})
	}
}
