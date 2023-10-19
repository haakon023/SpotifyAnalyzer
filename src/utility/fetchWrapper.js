import { ref } from 'vue';
import axios from 'axios';

export async function useFetch(url, config = {}) {
    const data = ref(null);
    const response = ref(null);
    const error = ref(null);
    const loading = ref(false);
    try {
        loading.value = true;

        const result = await axios.request({ url, ...config })
        response.value = result;
        data.value = result.data;
    } catch (error) {
        error.value = error;
    } finally {
        loading.value = false;
    }

    !config.skip && fetch()
    return { response, error, data, loading, fetch }

}

async function getCache(key, url) {
    try {
        const cacheStorage = await caches.open(key);
        const cachedResponse = await cacheStorage.match(url);

        if (!cachedResponse || !cachedResponse.ok)
            return false;
        return cachedResponse.json();

    } catch (error) {
        console.log(error)
    }
}

async function storeCache(cacheName, url, request) {
    try {
        const cache = await caches.open(cacheName);
        const response = await fetch(request);
        await cache.put(url, response.clone()); // Use response.clone() to store it and keep it for later use
    } catch (error) {
        console.error(error);
    }
}

export async function useFetchCached(cacheName, url, request, useCache = true) {
    let response = await getCache(cacheName, url);

    if (!response || !useCache) {
        try {
            await storeCache(cacheName, url, request);
        } catch (error) {
            console.error(error);
        }
    }

    return await getCache(cacheName, url);
}