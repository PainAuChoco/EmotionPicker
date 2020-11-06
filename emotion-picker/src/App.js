import './App.css';
import React from "react";
import ImageContainer from './Components/ImageContainer'
import VotingButtons from './Components/VotingButtons'
import Button from "@material-ui/core/Button"
import DirectoriesButtons from './Components/DirectoriesButtons'

const GOOGLE_API_KEY = "AIzaSyAcNznsnSs9fgpA47oE9EuTYflRSeH6RSc";
const GOOGLE_DRIVE_URL_START = "https://www.googleapis.com/drive/v2/files?q=%27";
const GOOGLE_DRIVE_URL_END = "%27+in+parents&key=";
const GOOGLE_DRIVE_IMG_URL = "http://drive.google.com/uc?export=view&id=";
const MAIN_FOLDER_ID = "11XVfzHUzqEStME89y-PgJZIOa-MlUODm"

class App extends React.Component {

  state = {
    //mostViewedPaintings: [],
    currentPhoto: 0,
    votes: {},
    paintings: [],
    dirId: "",
    dirName: "",
    directories: [],
    subDirsId: [],
    temp: []
  }

  componentDidMount() {
    this.loadDirectoriesName()
    //this.loadData()
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

  loadSubDirs = (dirId) => {
    fetch(
      GOOGLE_DRIVE_URL_START +
      dirId +
      GOOGLE_DRIVE_URL_END +
      GOOGLE_API_KEY
    )
      .then(response => response.json())
      .then(jsonResp => {
        var subDirsId = [], paintings = this.state.paintings
        jsonResp.items.forEach((subdir) => {
          subDirsId.push(subdir.id)
        })
        this.setState({
          subDirsId: subDirsId
        })
        subDirsId.forEach(id => {
          this.loadData(id)
        });
      })
  }

  concatSubDirs = () => {
    var temp = this.state.temp
    console.log(typeof (temp))
    console.log(temp)
    var arr = Object.keys(temp).reduce(function (res, v) {
      console.log("bonjour")
      return res.concat(temp[v]);
    }, []);
    this.setState({
      paintings: arr
    })
  }

  loadData = (dirId) => {
    fetch(
      GOOGLE_DRIVE_URL_START +
      dirId +
      GOOGLE_DRIVE_URL_END +
      GOOGLE_API_KEY
    )
      .then(response => response.json())
      .then(jsonResp => {
        var data = jsonResp.items
        console.log(data)
        /*var temp = this.state.temp
        temp.push(data)
        this.state.temp = temp*/
        this.setState({paintings: data})
      })
      .catch(error => console.log(error))
  }

  handleVote = (type) => {
    var photoTitle = this.state.paintings[this.state.currentPhoto].title
    var votes = this.state.votes
    votes[photoTitle] = type
    this.setState({
      votes: votes
    })
    this.nextPhoto()
  }

  nextPhoto = () => {
    var currentPhoto = this.state.currentPhoto
    this.setState({
      currentPhoto: currentPhoto + 1
    })
  }

  previousPhoto = () => {
    var currentPhoto = this.state.currentPhoto
    this.setState({
      currentPhoto: currentPhoto - 1
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
    this.loadSubDirs(dirId)
  }

  handleReturnClick = () => {
    this.setState({
      dirId: "",
      paintings: []
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
          </div>
          {this.state.dirId === "" &&
            <DirectoriesButtons
              handleDirectorySelection={this.handleDirectorySelection}
            />
          }
          {this.state.paintings.length !== 0 &&
            <React.Fragment>
              <span>{this.state.dirName}</span>
              <ImageContainer
                url={GOOGLE_DRIVE_IMG_URL + this.state.paintings[this.state.currentPhoto].id}
                width={this.state.paintings[this.state.currentPhoto].imageMediaMetadata.width}
                height={this.state.paintings[this.state.currentPhoto].imageMediaMetadata.height}
              />
              <div hidden>
                <ImageContainer
                  url={GOOGLE_DRIVE_IMG_URL + this.state.paintings[this.state.currentPhoto + 1].id}
                  width={this.state.paintings[this.state.currentPhoto].imageMediaMetadata.width}
                  height={this.state.paintings[this.state.currentPhoto].imageMediaMetadata.height}
                />
              </div>
              {/*Navigation buttons
              <div id="navBtn" hidden>
                <Button disabled={this.state.currentPhoto === 0} variant="contained" onClick={this.previousPhoto} value="<">{"<"}</Button>
                <Button disabled={this.state.currentPhoto === this.state.paintings.length - 1} variant="contained" onClick={this.nextPhoto} value=">">{">"}</Button>
          </div>*/}
              <VotingButtons
                callbackClick={this.handleVote}
              />
            </React.Fragment>
          }
        </header>
      </div>
    )
  }
}

export default App;
