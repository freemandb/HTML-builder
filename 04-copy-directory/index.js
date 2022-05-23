const { mkdir, copyFile, readdir } = require('fs/promises');
const { rm } = require('fs');
const path = require('path');

const fromFolder = path.resolve(__dirname , 'files');
const toFolder = path.resolve(__dirname , 'files-copy');

async function onRM(error) {
  if (error) {
    return console.error('Error uccured: ' + error.message);
  }
  mkdir(toFolder, { recursive: true });
  const files = await readdir(fromFolder, { withFileTypes: true });
  for (const file of files) {
    const fromFile = path.resolve(fromFolder, file.name);
    const toFile = path.join(toFolder, file.name);
    copyFile(fromFile, toFile);
  }
}

rm(toFolder, { recursive: true, force: true }, onRM);
