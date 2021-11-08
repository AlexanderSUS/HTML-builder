const fs = require('fs');
const path = require('path');
const sourceFoldername = 'files';
const targetFolderName = 'files-copy';
const workFolder = '04-copy-directory';
const sourceUrl = workFolder + '/' + sourceFoldername;
const targetUrl = workFolder + '/' + targetFolderName;

copyDir(sourceUrl, targetUrl);

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
        return console.error(`At rmDir() => Can't remove directoty! '${url}`, err);
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
  return new Promise(resolve => {
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
        console.error(`At isItDir() => Can't read path ${url}`, err)
        return;
      }

      if (stats.isDirectory()) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
  })
}

function copyFile(srcUrl, targetUrl) {
  fs.readdir(srcUrl, (err, files) => {

    if (err) {
      return console.error(`At copyFile() => Can't read the folder. ${err}`)
    }

    createDir(targetUrl).then(()=> {

      for (let file in files) {

        const currentSourceUrl = srcUrl + '/' + files[file];
        const currentTargetUrl = targetUrl + '/' + files[file];

        isItDir(currentSourceUrl).then((dir) => {
          if (dir) {
            isDirEmpty(currentSourceUrl).then(empty => {
              if (!empty) {
                copyFile(currentSourceUrl, currentTargetUrl);
              } else {
                createDir(currentTargetUrl);
              }
            })
          } else {
            fs.readFile(currentSourceUrl, (err, data) => {
              if (err) {
                console.error(`At copyFile => readFile => Can't read file ${currentSourceUrl}`, err);
                return;
              }
              fs.writeFile(currentTargetUrl, data, { flag: 'w+' }, err => {
                if (err) {
                  console.error(`At copyFile => writeFile => Can't write file ${currentTargetUrl}`, err);
                }
              })
            })
          }
        })
      }
    });
  });
}

function copyDir(src, trgt) {
  rmFolder(trgt).then(() => {
    copyFile(src, trgt);
  })
} 