const fs = require('fs');
const path = require('path');
const name = 'text.txt';
const folder = '01-read-file';

const url = path.resolve(folder + '/' + name);

const readSteam = fs.createReadStream(url, 'utf-8', (error, data) => {
  if (error) {
    console.error(`Can't read file ${name}`, error);
    return;
  }
});

readSteam.on('data', function(chunk) { console.log(chunk); })