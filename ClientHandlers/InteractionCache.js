function getIndex (arr, id) {
    for (let i = (arr.length - 1); i >= 0; i--) {
        if (arr[i].id == id) {
            return i;
        }
    }
    return -1;
}

module.exports = {
    RemoveById: (cacheId) => {
        let index = getIndex(global.InteractionCache, cacheId);
        if (index > -1) {
            global.InteractionCache.splice(index, 1);
        }
    }
}
