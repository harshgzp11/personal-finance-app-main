import axios from 'axios';

const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/INR';
const CACHE_KEY = 'exchange_rates_cache';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Fix #15: Cache exchange rate results in localStorage to avoid spamming the API
export const fetchExchangeRates = async () => {
    try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL_MS) {
                return data;
            }
        }
    } catch {
        // Cache read failed, proceed to fetch fresh data
    }

    try {
        const response = await axios.get(EXCHANGE_API_URL);
        const data = response.data;

        // Save to cache with timestamp
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
        } catch {
            // localStorage might be full, ignore cache write failure
        }

        return data;
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        return null;
    }
};
