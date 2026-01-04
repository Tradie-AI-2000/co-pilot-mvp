import { NextResponse } from 'next/server';

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

// Simple in-memory cache for MVP
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const minutes = searchParams.get('minutes') || '15';

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Missing lat or lng parameters' }, { status: 400 });
    }

    if (!MAPBOX_TOKEN) {
        console.error('MAPBOX_ACCESS_TOKEN is not defined');
        return NextResponse.json({ error: 'Mapbox configuration error' }, { status: 500 });
    }

    const cacheKey = `${lat},${lng},${minutes}`;
    const cached = cache.get(cacheKey);

    if (cached && cached.expiry > Date.now()) {
        return NextResponse.json(cached.data);
    }

    try {
        const url = `https://api.mapbox.com/isochrone/v1/mapbox/driving/${lng},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${MAPBOX_TOKEN}`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Mapbox API error:', errorData);
            return NextResponse.json({ error: 'Failed to fetch isochrone from Mapbox' }, { status: response.status });
        }

        const data = await response.json();

        // Store in cache
        cache.set(cacheKey, {
            data,
            expiry: Date.now() + CACHE_TTL
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Isochrone proxy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
