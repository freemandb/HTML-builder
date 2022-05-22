const path = require('path');
const { promises: fs } = require('fs');

const FOLDER = 'secret-folder';
const folderPath = path.resolve(__dirname, FOLDER);


async function handleFileName(filename) {
  const filepath = path.resolve(__dirname, FOLDER, filename);
  let stat;
  try {
    stat = await fs.stat(filepath);
  } catch (e) {
    console.log(e);
  }

  if (!stat.isFile()) {
    return;
  }
  const name = path.parse(filename).name;
  const ext = path.parse(filename).ext;
  const sizeKb = (stat.size / 1024).toFixed(3);
  console.log(`${name}${ext} size: ${sizeKb}Kb`);
}

async function scanFiles(fileNames) {
  fileNames.forEach(handleFileName);
}

async function getFileNames() {
  let names;
  try {
    names = await fs.readdir(folderPath);
  } catch (e) {
    console.log('e', e);
  }
  if (names === undefined) {
    console.log('undefined');
  } else {
    scanFiles(names);
  }
}

getFileNames();
