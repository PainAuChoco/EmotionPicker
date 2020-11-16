const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const { spawn } = require('child_process');
const fs = require('fs')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(pino);

app.get('/home', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(200);
});


app.get('/script/:id/:style/:number/:emotion', (req, res) => {
  let id = req.params.id
  let style = req.params.style
  let number = req.params.number
  let emotion = req.params.emotion

  let dataList = []
  // spawn new child process to call the python script
  const python = spawn("python", ["generator_64.py", style, emotion, number, 's', id]);
  // collect data from script
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataList.push(data)
  });
  // in close event we are sure that stream is from child process is closed
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataList.join(""))
  });
})

app.post('/submit', (req, res) => {
  let votes = req.body.votes

  let writeStream = fs.createWriteStream('./votes' + Date.now().toString() + '.csv')

  writeStream.on('finish', () => {
    console.log('finish write stream, file created')
  }).on('error', (err) => {
    console.log(err)
  })

  let newLine = []
  newLine.push("ID")
  newLine.push("Folder")
  newLine.push("Previous")
  newLine.push("New")
  writeStream.write(newLine.join(',') + '\n', () => { })

  votes.forEach(vote => {
    let newLine = []
    newLine.push(vote.id)
    newLine.push(vote.type)
    newLine.push(vote.previous)
    newLine.push(vote.vote)
    writeStream.write(newLine.join(',') + '\n', () => { })
  })

  writeStream.end()
  res.sendStatus(200)

})

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);