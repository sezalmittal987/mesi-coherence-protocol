const cacheLineSize = 0x200; // 64 bytes 
const defaultValue = 99; 

const computeCacheLine = function(address) {
  return Math.floor(address / cacheLineSize);
}

const computeOffset = function(address) {
  return address % cacheLineSize;
}

module.exports = {
  computeCacheLine: computeCacheLine,
  computeOffset: computeOffset,
  cacheLineSize: cacheLineSize,
  defaultValue: defaultValue,
};
