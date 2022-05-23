const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');

const writeSteam = fs.createWriteStream(path.resolve(__dirname, 'project-dist/bundle.css'));

async function readWrite(rs, ws) {
  for await (let chunk of rs) {
    ws.write(chunk);
  }
}

async function combienStylesInOneBundle() {
  const stylesFolder = path.resolve(__dirname,'styles');
  const files = await readdir(stylesFolder, {withFileTypes: true});
  for (const file of files) {
    if (file.isFile()) {
      const ext = path.parse(file.name).ext;
      if (ext === '.css') {
        const streamRead = fs.createReadStream(path.resolve(stylesFolder, file.name));
        await readWrite(streamRead, writeSteam);
      }
    }
        
  }
}

combienStylesInOneBundle();