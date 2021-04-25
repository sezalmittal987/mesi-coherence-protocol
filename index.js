const prompt = require('prompt-sync')();
 
const numberL1 = prompt('How many L1 caches do you want?');

const l2Cache = new (require('./models/l2cache'))(numberL1);

var l1Cache =[];
for(var i=0;i<numberL1;i++){
    l1Cache[i] = l2Cache.getL1Caches()[i];
    console.log(`L1 cache ${i} : ${l1Cache[i].getName()} has been formed`);
}
var x='4';

while(x!=='3'){
    x=prompt('Enter 1 to write ,2 to read and 3 to break : ');
    switch(x){
        case '1' :
            l1c = prompt('Enter the id of l1 cache which wants to write.');
            memoryadd = prompt('Enter the memory address to write (should be a multiple of 8)');
            data = prompt('Enter value to write');
            l1Cache[l1c].write(memoryadd,data);
            console.log(`${data} has been written.`);
            break;
        case '2' :
            l1c = prompt('Enter the id of l1 cache which wants to read.');
            memoryadd = prompt('Enter the memory address to read (should be a multiple of 8)');
            data=l1Cache[l1c].read(memoryadd);
            if(data===99) console.log('Nothing is written on that memory address.');
            console.log(`Data :${data}`);
            break;
        case '3':
            break;
        default :
        console.log('Enter a valid number');
        break;
    }
}

