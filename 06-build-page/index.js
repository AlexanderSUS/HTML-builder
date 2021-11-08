const fs = require('fs');
const path = require('path');
const workFolder = '06-build-page';
const distFolder = 'project-dist'
const distFolderUrl = `${workFolder}/${distFolder}`;

//styles
const styleSourceFolder = 'styles';
const styleTargetFile = 'style.css';
const styleSourceUrl = `${workFolder}/${styleSourceFolder}`;
const styleDestinationFileUrl = `${workFolder}/${distFolder}/${styleTargetFile}`;

//copy files
const assetsFolderName = 'assets';
const assetsSourceUrl = `${workFolder}/${assetsFolderName}`;
const aseetsDestinationUrl = `${workFolder}/${distFolder}/${assetsFolderName}`;

//build html
const htmlTemplateFile = 'template.html';
const htmlDestinationFile = 'index.html';
const htmlComponentsFolder = 'components';
const htmlSourceUrl = `${workFolder}/${htmlTemplateFile}`;
const htmlDestinationURl = `${workFolder}/${distFolder}/${htmlDestinationFile}`;
const htmlComponentsUrl = `${workFolder}/${htmlComponentsFolder}`;

rmFolder(distFolderUrl).then(() => { 
  createDir(distFolderUrl)
})
  .then(() => { 
    buildHtml(htmlSourceUrl, htmlDestinationURl, htmlComponentsUrl)
  })
  .then(() => { 
    buildStyles(styleSourceUrl, styleDestinationFileUrl)
  })
  .then(() => { 
    copyDir(assetsSourceUrl, aseetsDestinationUrl)
  })


function getFileData(url) {
  return new Promise((resolve) => {
    fs.readFile(url, 'utf-8', (err, data) => {
      if (err) {
        return console.error(err);
      }
      resolve(data);
    })
  })
}

function getContentList(url) {
  return new Promise((resolve) => {
    fs.readdir(url, (err, files) => {
      if (err) {
        return console.log(err);
      }
      resolve(files);
    } )
  })
}

function writeToFile(url, content) {
  return new Promise((resolve) => {
    fs.writeFile(url, content, 'utf-8', err => {
      if (err) {
        return console.error(err);
      }
      resolve();
    })
  })
}

function handleData(hdData, hdComponents) {
  
  return new Promise((resolve) => {

    getContentList(hdComponents).then( files => {

      let i = 0; 

      for (let file in files) {
        const currentComponentUrl = `${hdComponents}/${files[file]}`;

        checkExtension(currentComponentUrl, '.html').then(html => {

          if (html) {
            getFileData(currentComponentUrl).then(componentData => {

              const find = new RegExp(`{{2}${files[file].slice(0, -5)}}{2}`);
              
              hdData = hdData.replace(find, componentData);

              i = file;
              
              if (i == files.length - 1) {
              resolve(hdData);
              }
            })
          }
        })
      }
    }) 
  })
}

function checkExtension(url, extension) {
  
   return new Promise((resolve, reject) => {

    fs.stat(path.resolve(url), (err, stats) => {

      if (err) {
        return console.error(err);
      }

      if (stats.isFile()) {
        if (path.extname(url) == extension) {
          resolve(true)
        } else { 
          resolve(false);
        }
      }
    })
  })
}

function removeFile(url) {
  return new Promise((resolve) => {
    fs.unlink(url, err => {
      resolve();
    })
  })
}

function isDirExist(url) {
  return new Promise((res, rej) => {
    fs.access(url, err => {
      if (err) {
        res(false);
      } else {
        res(true)
      }
    })
  })
}

function isDirEmpty(url) {

  return  new Promise((res) =>{

    fs.readdir(url, (err, files) => {

      if (err) {
        return console.error(`At isDirEmpty() = > fs.readdir => url:${url} Can't read this directory`, err);
      } 

      if (files.length == 0) {
        res(true);
      } else {
        res(false);
      }
    })
  })
}

function rmDir(url) {
  return new Promise ((res) => {
    fs.rm(url, {recursive: true}, err => {
      if (err) {
        console.error(`At rmDir() => Can't remove directoty! '${url}`, err);
      }
      res();
    })       
  })
}

function rmFolder(url) {

  return new Promise((resolve) => {

    isDirExist(url).then(exist => {
      if (exist) {
        rmDir(url).then(() => {
          resolve();
        })
      } else {
        resolve();
      }
    })
  })
}

function createDir(url) {
  return new Promise((resolve) => {
    fs.mkdir(url, err => {
      if (err) {
        return console.error(`At createDir() => Can't create directory '${url}'`, err);
      } 
      resolve();
    })
  })
}

function isItDir(url) {

  return new Promise((resolve, reject) => {

    fs.stat(path.resolve(url), (err, stats) => {

      if (err) {
        return console.error(`At isItDir() => Can't read path ${url}`, err)
      }

      if (stats.isDirectory()) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
  })
}

function copyAll(srcUrl, targetUrl) {

  return new Promise((resolve) => {

    fs.readdir(srcUrl, (err, files) => {

      if (err) {
        return console.error(`At copyAll() => Can't read the folder. ${err}`)
      }

      createDir(targetUrl)
      .then(() => {

        for (let file in files) {

          const currentSourceUrl = srcUrl + '/' + files[file];
          const currentTargetUrl = targetUrl + '/' + files[file];

          isItDir(currentSourceUrl)
          .then((dir) => {

            if (dir) {
              isDirEmpty(currentSourceUrl)
              .then(empty => {

                if (!empty) {
                  copyAll(currentSourceUrl, currentTargetUrl);

                } else {
                  createDir(currentTargetUrl);
                }
              })
            } else {
              fs.readFile(currentSourceUrl, (err, data) => {
                if (err) {
                  console.error(`At copyAll => readFile => Can't read file ${currentSourceUrl}`, err);
                  return;
                }
                fs.writeFile(currentTargetUrl, data, { flag: 'w+' }, err => {
                  if (err) {
                    return console.error(`At copyAll => writeFile => Can't write file ${currentTargetUrl}`, err);
                  }
                })
              })
            }
          })
        }
        resolve();
      })
    });
  })
}

function copyDir(src, trgt) {
  return new Promise((resolve) => {
    rmFolder(trgt)
    .then(() => { copyAll(src, trgt)
    .then(() => { resolve(); })
    })
  })
} 

function buildStyles(src, trgt) {

  return new Promise((resolve) => {

    removeFile(trgt)
    .then(() => {

      fs.readdir(src, (err, files) => {
        if (err) {
          return console.error(err);
        }

        for (let file in files) {
          const currentSourceUrl = `${src}/${files[file]}`;

          checkExtension(currentSourceUrl, '.css')
          .then( css => {
            if (css) {

              fs.readFile(currentSourceUrl, 'utf-8', (err, data) => {

                if (err) {
                  return console.error(err);
                }

                fs.appendFile(trgt, data, err => { 
                  if (err) { 
                    console.error(err); 
                  } 
                })
              })
            }
          })
        }
        resolve();
      })
    })
  })
}


function buildHtml(source, destination, components) {

  return new Promise((resolve, reject) => {

    getFileData(source).then( data => {

      handleData(data, components).then( newData => {
        
        writeToFile(destination, newData).then(() => {
          resolve();
        });
      })
    })
  })
}
