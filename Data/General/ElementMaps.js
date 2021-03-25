function ElementMaps() {
    this.ConsumableMap = new Map();

    this.addNewKeyElementToMap = function(map, key, element) {
        key = key.toString()
        map.set(key,element);
    }

    this.getConsumableMap = function() {
        return this.ConsumableMap;
    }
}
typeMap.set('ElementMaps', ElementMaps)

function returnElementFromMap (map, key) {
    return map.get(key);
}