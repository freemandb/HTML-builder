const fs = require('fs');
const path = require('path');
   
const readStream = fs.createReadStream(path.resolve(__dirname,'text.txt'), { highWaterMark: 1});
const writeStream = process.stdout;
readStream.pipe(writeStream);

////////////////// не знаю, правильно ли сделал, поэтому на всякий случай вот ещё версия (нужно раскоментировать код ниже)

// const stream = new fs.ReadStream(path.resolve(__dirname, 'text.txt')); 
// let endReading = new Promise(function (resolve, reject) {
//   let data = '';
//   stream.on('data', function (chunk) {
//     data += chunk;
//   });
//   stream.on('end', () => resolve(data));
//   stream.on('error', reject); 
// });

// (async function() {
//   let finishString = await endReading;
//   console.log(finishString);
// }());

////////////////// и ещё одна, вдруг что-то не правильно понял из задания (нужно раскоментировать код ниже)

// const readStream2 = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');
// async function sumChunksIntoText(st) {
//   let data2 = '';
//   for await (let chunk of st) {
//     data2 += chunk;
//   }
//   return data2;
// }

// (async () => {
//   console.log(await sumChunksIntoText(readStream2));
// })();
