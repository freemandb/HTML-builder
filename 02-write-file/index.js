const readline = require('readline');
const fs = require('fs');
const path = require('path');

const PROMT_TEXT = 'Print some text to save to file!';
const NEXT_TEXT = 'Saved! Print some more text!';
const FINISH_TEXT = 'Buy buy!';

const writeStream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));

const rl = readline.createInterface({
  input: process.stdin,
  undefined,//output: process.stdout,
  terminal: false
});

function finishWork() {
  writeStream.close();
  console.log(FINISH_TEXT);
}

writeStream.once('open', () => console.log(PROMT_TEXT));

rl.on('line', function (line) {
  if (line !== 'exit') {
    writeStream.write(line);
    console.log(`${NEXT_TEXT} : ${line}`);
  }
  else {
    process.exit(1);
  }
});

if (process.platform === 'win32') {
  rl.on('SIGINT', function () {
    process.emit('SIGINT');
  });
}

process.on('SIGINT', function () {
  //graceful shutdown
  process.exit();
});

process.on('exit', () => {
  finishWork();
});
