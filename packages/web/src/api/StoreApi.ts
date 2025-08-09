import { api } from "./config/axios";
import Store from "@/domain/Store";
import GameEnum from "@/domain/GameEnum";

export default abstract class StoreApi {
  static async searchByText(query: string): Promise<Store[]> {
    const response = await api.get(`/store/searchByText`, {
      params: {
        query,
      },
    });
    return response.data;
  }

  static async searchByPosition(
    lat: number,
    lng: number,
    game?: GameEnum,
  ): Promise<Store[]> {
    const response = await api.get("/store/searchByPosition", {
      params: {
        lat,
        lng,
        game,
      },
    });
    return response.data;
  }
}
