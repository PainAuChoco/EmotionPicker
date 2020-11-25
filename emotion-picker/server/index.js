const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const { spawn } = require('child_process');
const fs = require('fs')
const readline = require('readline');
const opn = require('opn')
const { google } = require('googleapis');
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');
const { file } = require('googleapis/build/src/apis/file');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';

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
    res.json(dataList)
  });
})

app.post('/submit/:id', (req, res) => {
  let votes = req.body.votes
  let id = req.params.id
  let code = req.body.authCode
  let filename = 'votes_' + id + '.csv'

  console.log(code)

  let writeStream = fs.createWriteStream('./votes/' + filename)

  writeStream.on('finish', () => {
    fs.readFile('./credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, th,en call the Google Drive API.
      //authorize(JSON.parse(content), uploadFile);
      var credentials = JSON.parse(content)
      const { client_secret, client_id, redirect_uris } = credentials.web;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        uploadFile(oAuth2Client, filename)
      })
    })
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

/**
 * Create an OAuth2 client with the given credentials, and then execute the given callback function.
 */
function authorize(credentials, callback) {
  console.log(credentials)
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  opn(authUrl, { app: "chrome" });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log("here")
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      console.log("anything")
      callback(oAuth2Client);
    });
  });
}
/**
* Describe with given media and metaData and upload it using google.drive.create method()
*/
function uploadFile(auth, filename) {
  console.log("uploadFile")
  const drive = google.drive({ version: 'v3', auth });

  drive.files.create({
    requestBody: {
      'name': filename,
      parents: ["1sDDrC0guO5ZhXklkLFZ4lF95ysG-NXCy"]
    },
    media: {
      mimeType: 'text/csv',
      body: fs.createReadStream('./votes/' + filename)
    },
    fields: 'id'
  }, (err, file) => {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File Id: ', file.id);
    }
  });
}

app.get('/register', (req, res) => {
  fs.readFile('./credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, th,en call the Google Drive API.
    //authorize(JSON.parse(content), uploadFile);
    var credentials = JSON.parse(content)
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
    authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('authurl ', authUrl)
    res.json(authUrl)
  });
})



app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);