const fs = require('fs');
const { readdir, mkdir, copyFile } = require('fs/promises');
const path = require('path');

async function readWrite(rs, ws) {
  for await (let chunk of rs) {
    ws.write(chunk);
  }
}

async function combienStylesInOneBundle() {
  const stylesFolder = path.resolve(__dirname, 'styles');
  const files = await readdir(stylesFolder, { withFileTypes: true });
  const streamWrite = fs.createWriteStream(
    path.resolve(__dirname, 'project-dist/style.css'), 'utf8'
  );
  for (const file of files) {
    if (file.isFile()) {
      const ext = path.parse(file.name).ext;
      if (ext === '.css') {
        const streamRead = fs.createReadStream(path.resolve(stylesFolder, file.name));
        await readWrite(streamRead, streamWrite);
      }
    }
  }
}

async function copyFiles(fromFolder, toFolder) {
  mkdir(toFolder, { recursive: true });
  const files = await readdir(fromFolder, {withFileTypes: true});
  for (const file of files) {
    if (file.isFile()) {
      const fromFile = path.resolve(fromFolder, file.name);
      const newFile = path.resolve(toFolder, file.name);
      copyFile(fromFile, newFile); 
    } else {
      await copyFiles(path.resolve(fromFolder, path.parse(file.name).name), 
        path.resolve(toFolder, path.parse(file.name).name));
    }
  }
}

function copyAssets() {
  const fFolder = path.resolve(__dirname, 'assets');
  const tFolder = path.resolve(__dirname, 'project-dist/assets');
  copyFiles(fFolder, tFolder);
}

async function onTemplateRead(err, data) {
  if (err) {
    return console.error('Error occured: ' +err.message);
  }
  while (data.indexOf('{{') > -1) {
    const template = data.substring(data.indexOf('{{') + 2, data.indexOf('}}'));
    let html = await fs.promises.readFile(path.resolve(__dirname, 'components', template + '.html'), 'utf8');
    data = data.replace(`{{${template}}}`, html);
  }
  const streamWrite = fs.createWriteStream(
    path.resolve(__dirname, 'project-dist/index.html'), 'utf8'
  );
  streamWrite.write(data);
}


const createHTML = () => {
  fs.readFile(path.resolve(__dirname, 'template.html'), 'utf8', onTemplateRead);
};

function createPage() {
  const newFolder = path.join(__dirname + '/project-dist');
  fs.rm(newFolder, { recursive: true, force: true }, async error => {
    if (error) {
      return console.error(error.message);
    }
    await mkdir(newFolder, { recursive: true });
    copyAssets();
    combienStylesInOneBundle();
    createHTML();
  });
}

createPage();