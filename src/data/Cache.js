var internalCache = {};

var Cache = {
  get(key) {
    var cachedItem = internalCache[key];
    if (!cachedItem) {
      return null;
    }
    return cachedItem.value;
  },
  set(key, value, dependencies) {
    internalCache[key] = {value: value, dependencies: dependencies || []};
  },
  remove(key) {
    var cachedItem = internalCache[key];

    //remove cached dependencies
    if (cachedItem.dependencies.length > 0) {
      for (var d = 0; d < cachedItem.dependencies.length; d++) {
        var dependentItemKey = cachedItem.dependencies[d];
        internalCache[dependentItemKey] = null;
      }
    }

    internalCache[key] = null;
  }
}

export default Cache;
