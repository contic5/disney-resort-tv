/*
Functions are from
https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage
*/

const app_name="disney-resort-tv";

// Try to get data from the cache, but fall back to fetching it live.
export async function getData(url:string) 
{
    //Setup cache settings
    const cacheVersion = 1;
    const cacheName = `${app_name}-${cacheVersion}`;

    //Try to fetch data from cache
    let cachedData = await getCachedData(cacheName, url);
    if (cachedData) {
        console.log("Retrieved cached data");
        return cachedData;
    }


    console.log("Fetching fresh data");

    //Save fresh data to cache
    const cacheStorage = await caches.open(cacheName);
    await cacheStorage.add(url);
    cachedData = await getCachedData(cacheName, url);

    //Delete old cache
    await deleteOldCaches(cacheName);

    return cachedData;
}

// Get data from the cache.
async function getCachedData(cacheName:string, url:string)
{
  const cacheStorage = await caches.open(cacheName);
  const cachedResponse = await cacheStorage.match(url);

  if (!cachedResponse || !cachedResponse.ok) {
    return false;
  }

  return await cachedResponse.json();
}

// Delete any old caches to respect user's disk space.
async function deleteOldCaches(currentCache:string) 
{
  const keys = await caches.keys();

  //Delete all our caches that are not our current cache. Keep other people's caches.
  for (const key of keys) {
    const isOurCache = key.startsWith(`${app_name}-`);
    if (currentCache === key || !isOurCache) {
      continue;
    }
    caches.delete(key);
  }
}