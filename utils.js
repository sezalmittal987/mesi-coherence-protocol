const cacheLineSize = 0x200; // 64 bytes 
const defaultValue = 99; 

const computeCacheLine = function(address) {
  return Math.floor(address / cacheLineSize);
}

const computeOffset = function(address) {
  return address % cacheLineSize;
}

const MS = {
  M: 'Modified',
  E: 'Exclusive',
  S: 'Shared',
  I: 'Invalid',
};

module.exports = {
  computeCacheLine: computeCacheLine,
  computeOffset: computeOffset,
  cacheLineSize: cacheLineSize,
  defaultValue: defaultValue,
  MS : MS
};
