const NodeCache = require( "node-cache" );
const cache = new NodeCache({stdTTL: 60});

async function cacheWrapper(key, dataFunc) {
    let result = cache.get(key);
    console.log(result)
    if (!result) {
        console.log(`${key} added to cache`)
        console.log(dataFunc)
        if (dataFunc.constructor.name === 'AsyncFunction') {
            console.log('asynced')
            result = await dataFunc()
        } else {
            result = dataFunc()
        }
        cache.set(key, result)
    } else {
        console.log(`${key} already in cache`)
    }
    return result
}

module.exports = {
    cache,
    cacheWrapper
};