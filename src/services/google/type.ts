export type ReverseGeoCodeResponse = {
    results: {
        address_components: {
            long_name: string;
            short_name: string;
            types: string[];
        }[];
        formatted_address: string;
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
        };
        place_id: string;
        types: string[];
    }[];
}

