const CacheLine = require('./cacheLine');
const L1Cache = require('./l1cache');
const MS = require('../utils').MS;

class L2Cache {
  constructor(numberL1) {
    this.cacheLineToCacheAndState = {}; // references cache line to an array of {cache: L1Cache, state: MS}.
    this.l1Caches = [];
    for (let i = 0; i < numberL1; i++) {
      this.l1Caches.push(new L1Cache(`L1-${i}`, this));
    }
  }

  getL1Caches() {
    return this.l1Caches;
  }

  getCacheLines(){
    return  this.cacheLineToCacheAndState;
  }
  /**
   * When an L1Cache tries to write to a cache line and it hasn't already written to that
   * line or cached it exclusively, it calls this method to get ownership of the cache
   * line.
   * If other caches have the line, we fetch the line from them, invalidates the other
   * caches, and return the full cache line to the caller. Otherwise, we load it from main
   * memory and return it to the caller.
   */
  requestForOwnership(cacheLine, requestor) {
    const cachesAndStates = this.cacheLineToCacheAndState[cacheLine];
    let currentCacheLine = null;
    if (cachesAndStates && cachesAndStates.length > 0) {
      for (let i = 0; i < cachesAndStates.length; i++) {
        if (!cachesAndStates[i] || cachesAndStates[i].state === MS.I) {
          continue;
        }
        console.log('Invalidating the other cache that had same cache line.');
        currentCacheLine = currentCacheLine || cachesAndStates[i].cache.snoopInvalidate(cacheLine);
      }
    }
    if (!currentCacheLine) {
      console.log('As no one had cached it or they no longer have it , so we are loading it from the main memory.');
      currentCacheLine = loadFromMainMemory(cacheLine);
      console.log('We are assigning cache line to the requestor with modified state.');
      this.cacheLineToCacheAndState[cacheLine]=[{cache: requestor, state: MS.M}];
    }
    else {
      console.log('We are assigning cache line to the requestor with exclusive state.');
      this.cacheLineToCacheAndState[cacheLine]=[{cache: requestor, state: MS.E}];
    }
    return currentCacheLine;
  }

  /**
   * When an L1Cache tries to read a value and it doesn't have it, it calls this method to
   * ask the L2Cache to share the cache line from main memory or from another L1Cache.
   */
  requestForShare(cacheLine, requestor) {
    const cachesAndStates = this.cacheLineToCacheAndState[cacheLine];
    if (!cachesAndStates || cachesAndStates.length === 0) {
      console.log('As no other L1 cache have this cache line , so we are assigning it to requestor with shared status and loading it from main memory.');
      this.cacheLineToCacheAndState[cacheLine] = [{cache: requestor, state: MS.S}];
      return loadFromMainMemory(cacheLine);
    } else {
      for (let i = 0; i < cachesAndStates.length; i++) {
        if (!cachesAndStates[i] || cachesAndStates[i].state === MS.I) {
          continue;
        }
        console.log(`Requesting L1 caches with same cacheline to snoop share.`);
        const currentValue = cachesAndStates[i].cache.snoopShare(cacheLine);
        if (currentValue) { 
          console.log('Changing its state to shared and assigning cache line to requestor with shared status.');
          cachesAndStates[i].state = MS.S;
          cachesAndStates.push({cache: requestor, state: MS.S});
          return currentValue;
        } else {
          console.log('changing its state to invalid because the cache line was evicted from the L1 cache');
          cachesAndStates[i].state = MS.I;
        }
      }
      // if we haven't yet returned a value:
      cachesAndStates.push({cache: requestor, state: MS.S});
      return loadFromMainMemory(address);
    }
  }
}

function loadFromMainMemory(cacheLine) {
  return new CacheLine();
}

module.exports = L2Cache;
