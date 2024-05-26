import config from "../../../config";
import typesense from "../../../config/typesense";
import { Query } from "./type";

const { pagination_limit, search_radius } = config

export const searchWorker = async (q:Query) => {
    const { skill, lat, lng, page=1, limit=pagination_limit } = q;
    const searchParameters = {
        q: skill,
        query_by: "skills",
        sort_by: "score:desc",
        page: page,
        per_page: limit,
        filter_by: `location:(${lat}, ${lng}, ${search_radius} km)`,
    }
    const searchResults = await typesense.collections("workers").documents().search(searchParameters);
    return searchResults;
}