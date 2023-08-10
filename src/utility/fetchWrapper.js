import {ref} from 'vue';
import axios from 'axios';

export async function useFetch (url, config = {}){
    const data = ref(null);
    const response = ref(null);
    const error = ref(null);
    const loading = ref(false);
    try {
        loading.value = true;
        
        const result = await axios.request({url, ...config})
        response.value = result;
        data.value = result.data;
    } catch (error) {
        error.value = error;
    }finally{
        loading.value = false;
    }

    !config.skip && fetch()
    return {response, error, data, loading, fetch}

}

async function getCache(key, url)
{
    try {
        const cacheStorage = await caches.open(key);
        const cachedResponse = await cacheStorage.match(url);
        if(!cachedResponse || !cachedResponse.ok)
            return false;
        return cachedResponse.json();
                
    } catch (error) {
        console.log(error)        
    }
}

async function storeCache(key, url, request)
{
    try{
        let cache = await caches.open(key, url);
        let response = await fetch(request);
        await cache.put(url, response);
    }catch(error)
    {
        console.log(error)
    }
}

export async function useFetchCached (key, url, request) {

    let response = await getCache(key, url);
    if(response == null || response == undefined || !response) {
        try{
           await storeCache(key, url, request)
        }catch(error){
            console.log(error)
        }
    }
    return await getCache(key, url);
}