const MS = require('./MesiStates');
const CacheLine = require('./cacheLine');
const utils = require('../utils');


class L1Cache {
  constructor(name, l2Cache) {
    this.name = name;
    this.l2Cache = l2Cache;
    this.cacheLineToState = {}; 
    this.cacheLines = {}; 
  }

  getName() {
    return this.name;
  }
  
  write(address, value) {
    console.log('Computing the cache line in which this memory address falls.');
    const cacheLine = utils.computeCacheLine(address);
    const cacheLineState = this.cacheLineToState[cacheLine] || MS.I;
    if (cacheLineState === MS.S || cacheLineState === MS.I) {
      console.log('As it can not be written because it is in either shared or invalid state, so we are requesting for ownership');
      const currentValue = this.l2Cache.requestForOwnership(cacheLine, this);
      console.log('updating the L1 caches\' status in cache line.');
      this.cacheLines[cacheLine] = new CacheLine(currentValue);
    }
    console.log('Writing value to the cache line.');
    this.cacheLines[cacheLine].set(utils.computeOffset(address), value);
    this.cacheLineToState[cacheLine] = MS.M;
  }

  read(address) {
    const cacheLine = utils.computeCacheLine(address);
    const cacheLineState = this.cacheLineToState[cacheLine] || MS.I;
    if (cacheLineState === MS.I) {
      console.log('As current status of cache is invalid , so we are requesting for share. ');
      const currentValue = this.l2Cache.requestForShare(cacheLine, this);
      this.cacheLineToState[cacheLine] = MS.S;
      this.cacheLines[cacheLine] = new CacheLine(currentValue);
    }
    return this.cacheLines[cacheLine].get(utils.computeOffset(address));
  }


  snoopInvalidate(cacheLine) {
    const state = this.cacheLineToState[cacheLine] || MS.I;
    if (state === MS.I) {
      return null;
    }
    this.cacheLineToState[cacheLine] = MS.I;
    return this.cacheLines[cacheLine]; 
  }

  snoopShare(cacheLine) {
    const cacheLineState = this.cacheLineToState[cacheLine] || MS.I;
    if (cacheLineState === MS.I) {
      return null; 
    }
    this.cacheLineToState[cacheLine] = MS.S;
    return this.cacheLines[cacheLine];
  }
}

module.exports = L1Cache;
