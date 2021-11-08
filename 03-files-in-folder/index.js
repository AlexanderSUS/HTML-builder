const fs = require('fs');
const path = require('path');
const secret = 'secret-folder';
const folder = '03-files-in-folder';
const url = path.resolve(folder + '/' + secret);

fs.readdir(url, (err, files) => {

  if (err) {
    return console.log(`Can't read the folder. ${err}`)
  }

  for (let file in files) {
    fs.stat(path.resolve(url + '/' + files[file]), (err, stats) => {
      if (err) {
       return console.error(err);
      }

      if (stats.isFile()) {
        let extension = path.extname(files[file]).slice(1);
        let fileName = files[file].slice(0, -(extension.length + 1)) 
        console.log(`${fileName} - ${extension} - ${stats.size / 1000}kb`);
      }
    })
  }
});