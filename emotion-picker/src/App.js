import './App.css';
import React from "react";
import ImageContainer from './Components/ImageContainer'
import VotingButtons from './Components/VotingButtons'
import Button from "@material-ui/core/Button"
import DirectoriesButtons from './Components/DirectoriesButtons'
import 'bootstrap/dist/css/bootstrap.min.css';

const GOOGLE_API_KEY = "AIzaSyAcNznsnSs9fgpA47oE9EuTYflRSeH6RSc";
const GOOGLE_DRIVE_URL_START = "https://www.googleapis.com/drive/v2/files?q=%27";
const GOOGLE_DRIVE_URL_END = "%27+in+parents&key=";
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
  }

  componentDidMount() {
    this.loadDirectoriesName()
  }

  componentDidUpdate() {
    if (this.state.positive.length !== 0 && this.state.negative.length !== 0 && this.state.neutral.length !== 0) {
      var paintings = []
      paintings = paintings.concat(this.state.negative)
      paintings = paintings.concat(this.state.positive)
      paintings = paintings.concat(this.state.neutral)
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
        loading: false
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
          directories: dirs
        })
      });
  }

  removeEdited = (paintings) => {
    for (var i = 0; i < paintings.length; i++) {
      if (paintings[i].title.includes("edited")) {
        console.log("found")
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
          this.setState({
            loading: true,
          })
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

  handleVote = (type) => {
    var photoTitle = this.state.paintings[0].title
    var votes = this.state.votes
    votes.push({
      id: photoTitle,
      type: this.state.dirName,
      previous: photoTitle.split('_')[1].split('.')[0],
      vote: type.toLowerCase()
    })

    this.setState({
      votes: votes
    })
    this.nextPhoto()
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

  getGeneratedImages = () => {
    var now = Date.now().toString()
    fetch('/script/' + now)
      .then((response) => console.log(response))
      .then((res) => {
        console.log("res")
        this.setState({imgGenerated: true, imgId: now })
      })
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div id="title">
            Emotion Picker by Neurogram
            {this.state.dirId !== "" &&
              <Button id="returnbtn" variant="outlined" color="secondary" onClick={this.handleReturnClick}>Return</Button>
            }
          </div>
          <div>
            <Button onClick={this.getGeneratedImages}>Generate Image</Button>
            {this.state.imgGenerated &&
              <img src={process.env.PUBLIC_URL + '/images/'+  this.state.imgId + '_0.jpg'} />
            }
          </div>
          {this.state.dirId === "" &&
            <DirectoriesButtons
              handleDirectorySelection={this.handleDirectorySelection}
            />

          }
          {this.state.loading &&
            <div className="spinner-border" role="status"></div>
          }
          {this.state.paintings.length !== 0 &&
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
        </header>
      </div>
    )
  }
}

export default App;
