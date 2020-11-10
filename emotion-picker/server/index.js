const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(pino);

app.get('/home', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(200);
});

app.post('/submit', (req, res) => {
  let fs = require("fs")
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