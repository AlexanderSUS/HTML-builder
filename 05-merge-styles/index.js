const fs = require('fs');
const path = require('path');
const sourceFolder = 'styles';
const targetFolder = 'project-dist';
const targetFile = 'bundle.css';
const workFolder = '05-merge-styles';
const source = `${workFolder}/${sourceFolder}`;
const destination = `${workFolder}/${targetFolder}/${targetFile}`;

removeAll(destination)
.then(() => {

  fs.readdir(source, (err, files) => {
    if (err) {
      return console.error(err);
    }

    for (let file in files) {
      const currentSourceUrl = `${source}/${files[file]}`;

      isCssFile(currentSourceUrl)
      .then( css => {
        if (css) {
          fs.readFile(currentSourceUrl, 'utf-8', (err, data) => {
            if (err) {
              return console.error(err);
            }
            fs.appendFile(destination, data, err => {
              if (err) {
                return console.error(err);
              }
            })
          })
        }
      })
    }
  })
})

function isCssFile(url) {
   return new Promise((resolve, reject) => {
    fs.stat(path.resolve(url), (err, stats) => {
      if (err) {
        return console.error(err)
      }

      if (stats.isFile()) {
        if (path.extname(url) == '.css') {
          resolve(true)
        } else { 
          resolve(false);
        }
      }
    })
  })
}

function removeAll(url) {
  return new Promise((resolve) => {
    fs.unlink(url, err => {
      resolve();
    })
  })
}


