export const filterAndSort = (result, gameFilter = null) => {
    const filter = (result, gameFilter = null) => {
        if (gameFilter && gameFilter.length) {
            return result.filter(store => {
                return store.cabinets.some(cab => gameFilter.includes(cab.game));
            });
        } else {
            return result;
        }
    }
    return filter(result).sort((a, b) => a.storeName.localeCompare(b.storeName))
        .map(store => {
            store.cabinets = store.cabinets.sort((a, b) => a.game.localeCompare(b.game));
            return store;
        });
}
