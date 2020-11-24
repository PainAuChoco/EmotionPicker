import './App.css';
import React from "react";
import ImageContainer from './Components/ImageContainer'
import VotingButtons from './Components/VotingButtons'
import Button from "@material-ui/core/Button"
import DirectoriesButtons from './Components/DirectoriesButtons'
import ImageGenerator from "./Components/ImageGenerator"
import Paper from "@material-ui/core/Paper"
import 'bootstrap/dist/css/bootstrap.min.css';

import { ReactComponent as BrainSVG } from "./brain.svg"
import { ReactComponent as TeamSVG } from "./team.svg"

const GOOGLE_API_KEY = "AIzaSyAcNznsnSs9fgpA47oE9EuTYflRSeH6RSc";
const GOOGLE_DRIVE_URL_START = "https://www.googleapis.com/drive/v2/files?q=%27";
const GOOGLE_DRIVE_URL_END = "%27+in+parents&maxResults=1000&key=";
const GOOGLE_DRIVE_IMG_URL = "http://drive.google.com/uc?export=view&id=";
const MAIN_FOLDER_ID = "11XVfzHUzqEStME89y-PgJZIOa-MlUODm"

class App extends React.Component {

  state = {
    votes: [],
    paintings: [],
    dirId: "",
    dirName: "",
    directories: [],
    positive: [],
    negative: [],
    neutral: [],
    currentWidth: 0,
    currentHeight: 0,
    loading: false,
    imgGenerated: false,
    display: null,
    imgId: null,
    driveSync: false,
    matchings: {}
  }

  componentDidMount() {
    this.loadDirectoriesName()
  }

  componentDidUpdate() {
    if (this.state.positive.length !== 0 && this.state.negative.length !== 0 && this.state.neutral.length !== 0) {
      var paintings = this.state.paintings
      paintings = paintings.concat(this.state.negative)
      paintings = paintings.concat(this.state.positive)
      paintings = paintings.concat(this.state.neutral)
      console.log(this.state.positive.length)
      console.log(this.state.negative.length)
      console.log(this.state.neutral.length)
      console.log(paintings.length)

      paintings = this.shuffleArray(paintings)
      paintings = this.removeEdited(paintings)
      var currentWidth = paintings[0].imageMediaMetadata.width
      var currentHeight = paintings[0].imageMediaMetadata.height
      this.setState({
        paintings: paintings,
        positive: [],
        negative: [],
        neutral: [],
        currentHeight: currentHeight,
        currentWidth: currentWidth,
      })
    }
  }

  loadDirectoriesName = () => {
    fetch(
      GOOGLE_DRIVE_URL_START +
      MAIN_FOLDER_ID +
      GOOGLE_DRIVE_URL_END +
      GOOGLE_API_KEY
    )
      .then(response => response.json())
      .then(jsonResp => {
        var dirs = jsonResp.items
        this.setState({
          directories: dirs,
          loading: true
        })
        return dirs
      })
      .then((dirs) => {
        dirs.forEach(dir => {
          var dirId = dir.id
          this.loadSubDir(dirId)
        });
      })
      .then(() => {
        this.setState({ driveSync: true, loading: false })
      })
  }

  removeEdited = (paintings) => {
    for (var i = 0; i < paintings.length; i++) {
      if (paintings[i].title.includes("edited")) {
        paintings.splice(i, 1)
      }
    }
    return paintings
  }

  loadSubDir = (dirId) => {
    fetch(
      GOOGLE_DRIVE_URL_START +
      dirId +
      GOOGLE_DRIVE_URL_END +
      GOOGLE_API_KEY
    )
      .then(response => response.json())
      .then(jsonResp => {
        jsonResp.items.forEach((subdir) => {
          this.state.matchings[subdir.id] = subdir.parents[0].id
          this.loadData(subdir.id, subdir.title)
        })
      })
  }

  loadData = (dirId, type) => {
    fetch(
      GOOGLE_DRIVE_URL_START +
      dirId +
      GOOGLE_DRIVE_URL_END +
      GOOGLE_API_KEY
    )
      .then(response => response.json())
      .then(jsonResp => {
        var data = jsonResp.items
        switch (type) {
          case "positive":
            {
              this.setState({
                positive: data
              })
              break;
            }
          case "neutral":
            {
              this.setState({
                neutral: data
              })
              break;
            }
          case "negative":
            {
              this.setState({
                negative: data
              })
              break;
            }
        }
      })
      .catch(error => console.log(error))
  }

  handleVote = (vote) => {
    var photoTitle = this.state.paintings[0].title
    var type = this.findDirectoryNameById(this.state.paintings[0].parents[0].id)
    console.log(type)
    var votes = this.state.votes
    votes.push({
      id: photoTitle,
      type: type,
      previous: photoTitle.split('_')[1].split('.')[0],
      vote: vote.toLowerCase()
    })

    this.setState({
      votes: votes
    })
    this.nextPhoto()
  }

  findDirectoryNameById = (id) => {
    var res
    this.state.directories.forEach(dir => {
      if (dir.id === this.state.matchings[id]) {
        res = dir.title
      }
    });
    return res
  }

  nextPhoto = () => {
    var paintings = this.state.paintings
    paintings.splice(0, 1)

    var currentWidth = paintings[0].imageMediaMetadata.width
    var currentHeight = paintings[0].imageMediaMetadata.height

    this.setState({
      currentHeight: currentHeight,
      currentWidth: currentWidth
    })
  }

  handleDirectorySelection = (dirName) => {
    var dirId
    this.state.directories.forEach(dir => {
      if (dir.title === dirName) dirId = dir.id
    });
    this.setState({
      dirId: dirId,
      dirName: dirName,
    })
    this.loadSubDir(dirId)
  }

  handleReturnClick = () => {
    this.setState({
      dirId: "",
      paintings: []
    })
  }

  shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array
  }

  submitVotes = () => {
    var votes = this.state.votes
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ votes: votes })
    }

    fetch('/submit', requestOptions)
      .then(res => console.log(res))
      .catch(error => console.log(error))
  }

  getGeneratedImages = (style, imgNumber, emotion) => {
    var now = Date.now().toString()
    fetch('/script/' + now + '/' + style + '/' + imgNumber + '/' + emotion)
      .then((response) => { return response.json() })
      .then((res) => {
        this.setState({ res: res })
        var imgId = process.env.PUBLIC_URL + "/images/" + now + '.png'
        return imgId
      })
      .then((imgId) => {
        this.setState({ imgGenerated: true, imgId: imgId })
      })
  }

  displayGenerator = () => {
    this.setState({ display: "Artwork Generator" })
  }

  displayEmotionPicker = () => {
    this.setState({ display: "Emotion Picker" })
  }

  auth = () => {
    fetch("/test")
      .then((response) => {return response.json()})
      .then((res) => window.open(res, '_self'))
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div id="title">
            {this.state.display !== null &&
              <span> {this.state.display + " by "}</span>
            }
            <span id="neurogramTitle" onClick={() => this.setState({ display: null })}>Neurogram</span>
            {this.state.dirId !== "" &&
              <Button id="returnbtn" variant="outlined" color="secondary" onClick={this.handleReturnClick}>Return</Button>
            }
          </div>
          {this.state.display === null &&
            <div className="d-flex">
              <div>
                <Paper className="mr-2" id="menuCard" elevation={5} onClick={this.displayGenerator} >
                  <BrainSVG className="mt-4" width="150" height="150" />
                </Paper>
                <span id="cardTitle">Generate original artworks</span>
              </div>
              <div>
                <Paper className="ml-2" id="menuCard" elevation={5} onClick={this.displayEmotionPicker} >
                  <TeamSVG className="mt-4" width="150" height="150" />
                </Paper>
                <span id="cardTitle">Help us improve our AI</span>
              </div>
            </div>
          }
          {this.state.display === "Artwork Generator" &&
            <div>
              <Button onClick={this.auth}>Here</Button>
              <ImageGenerator
                show={this.state.imgGenerated}
                imgId={this.state.imgId}
                getGeneratedImages={this.getGeneratedImages}
              />
            </div>
          }
          {this.state.display === "Emotion Picker" &&
            <div>
              {/*this.state.dirId === "" &&
                <DirectoriesButtons
                  handleDirectorySelection={this.handleDirectorySelection}
                />

        */}
              {this.state.loading &&
                <div className="spinner-border" role="status"></div>
              }
              {this.state.paintings.length !== 0 && this.state.driveSync &&
                <React.Fragment>
                  <span>{this.state.dirName}</span>
                  <ImageContainer
                    url={GOOGLE_DRIVE_IMG_URL + this.state.paintings[0].id}
                    width={this.state.currentWidth}
                    height={this.state.currentHeight}
                  />
                  {this.state.paintings[1] !== undefined &&
                    <div hidden>
                      <ImageContainer
                        url={GOOGLE_DRIVE_IMG_URL + this.state.paintings[1].id}
                        width={this.state.paintings[1].imageMediaMetadata.width}
                        height={this.state.paintings[1].imageMediaMetadata.height}
                      />
                    </div>
                  }
                  {this.state.paintings.length < 10 &&
                    <div id="alert" className="mb-1">Warning: only {this.state.paintings.length - 2} artworks left to classify in this genre !</div>
                  }
                  {this.state.paintings.length >= 4 &&
                    <VotingButtons
                      callbackClick={this.handleVote}
                    />
                  }
                </React.Fragment>
              }
              {Object.entries(this.state.votes).length !== 0 &&
                <Button id="submitBtn" className="noOutline" variant="contained" color="primary" value="Submit" onClick={this.submitVotes}>Submit</Button>
              }
            </div>
          }
        </header>
      </div >
    )
  }
}

export default App;
