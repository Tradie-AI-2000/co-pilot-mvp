export interface WeatherProvider {
    getForecast(lat: number, lng: number, date: Date): Promise<{
        condition: 'CLEAR' | 'RAIN' | 'WIND' | 'STORM';
        rainMm: number;
    }>;
}

export type ProjectSignal = {
    externalId: string;
    title: string;
    lat: number;
    lng: number;
    value: number;
    stage: 'CONCEPT' | 'TENDER' | 'CONSTRUCTION' | 'FIT_OUT';
    contractorId?: string;
};
