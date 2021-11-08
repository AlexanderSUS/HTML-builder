const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const greetings = "Enter some text here:\n";
const name = 'input.txt';
const folder = '02-write-file';
const url = path.resolve(folder + '/' + name);

process.on('exit', ()=> {
  console.log('Have a nice day!');
})

console.log("Hello User!");

fs.writeFile(url, '', err => {
  if (err) {
    return console.error(err)
  }
})

askToEnter();

function askToEnter () {


  readline.question(greetings, answer => {
    if (answer == 'exit') {
      return readline.close();
    }
    fs.appendFile(url, answer, err => {
      if (err) {
        console.error(`Can't write file ${url}`);
        return
      }
    })
    askToEnter();
  })
}
