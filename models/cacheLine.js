const {cacheLineSize , defaultValue } = require('../utils');
const utils = require('../utils');
const byteSize = 0x8; // 1 byte 

function validateOffset(offset) {
    if (offset > cacheLineSize - byteSize - 1) {
      throw new Error(`Cannot read offset ${offset} past the length of the cache line`);
    }
    if (offset % byteSize !== 0) {
      throw new Error(`Misaligned reads not allowed - read address must be multiple of ${byteSize}`);
    }
  }

class CacheLine {
     //contructs an array named data
    constructor(givendata){   
        if(givendata){
            this.data = givendata.data.slice(0, givendata.data.length);
        }
        else{
            this.data = [];
            for (var i = 0; i < cacheLineSize/byteSize; i++) {
                this.data.push(defaultValue);
            }
        }
    }
    // Returns data at a specfic offset
    get(offset) {
        validateOffset(offset);
        return this.data[offset / byteSize];
    }
    // Sets data at a specific offset
    set(offset, value) {
        validateOffset(offset);
        if (value < 0 || value >= Math.pow(2,byteSize)) {
          throw new Error(`Supports for writing numbers under ${Math.pow(2,byteSize)} memory address.`);
        }
        this.data[offset / byteSize] = value;
    }
}

module.exports = CacheLine;
