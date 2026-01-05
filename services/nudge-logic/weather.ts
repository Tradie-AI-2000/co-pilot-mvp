import { WeatherProvider } from './types';

export class MockWeatherProvider implements WeatherProvider {
    async getForecast(lat: number, lng: number, date: Date): Promise<{ condition: 'CLEAR' | 'RAIN' | 'WIND' | 'STORM'; rainMm: number; }> {
        // Mock logic: Always return RAIN for demo purposes if it's tomorrow
        // In real app, fetch from MetService API
        return {
            condition: 'RAIN',
            rainMm: 25
        };
    }
}
