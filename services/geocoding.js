
export const geocodeAddress = async (address) => {
    if (!address) return null;

    try {
        const encoded = encodeURIComponent(address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1`;

        // Nominatim requires a User-Agent
        const headers = {
            'User-Agent': 'StellarCoPilot/1.0'
        };

        const response = await fetch(url, { headers });
        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        }
    } catch (error) {
        console.error("Geocoding failed:", error);
    }
    return null;
};
