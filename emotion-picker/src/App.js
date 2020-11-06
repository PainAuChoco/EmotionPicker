import './App.css';
import React from "react";
import ImageContainer from './Components/ImageContainer'
import VotingButtons from './Components/VotingButtons'
import Button from "@material-ui/core/Button"
import GDImageViewer from './GDImageViewer';
import './GDImageViewer.css'

const required_fields = {
  gkey: "AIzaSyAcNznsnSs9fgpA47oE9EuTYflRSeH6RSc",
  dirId: "1x2BqcvGBuyGYugdgFVFuLU2y91QrfAJW",
  name: "ff555ddf7526fbb7218e3b51f4ad8ae5_positive.jpg",
  options: {
    style: {},
    onClick: {
      modal: true,
      newWindow: false
    },
    exclude: {},
    attachClass: {},
    attachId: {},
    hover: true
  },
}

const GOOGLE_API_KEY = "AIzaSyAcNznsnSs9fgpA47oE9EuTYflRSeH6RSc";
const GOOGLE_DRIVE_URL_START = "https://www.googleapis.com/drive/v2/files?q=%27";
const GOOGLE_DRIVE_URL_END = "%27+in+parents&key=";
const GOOGLE_DRIVE_IMG_URL = "http://drive.google.com/uc?export=view&id=";


class App extends React.Component {

  state = {
    //mostViewedPaintings: [],
    currentPhoto: 0,
    votes: {},
    paintings: []
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    fetch(
      GOOGLE_DRIVE_URL_START +
      '1x2BqcvGBuyGYugdgFVFuLU2y91QrfAJW' +
      GOOGLE_DRIVE_URL_END +
      GOOGLE_API_KEY
    )
      .then(response => response.json())
      .then(jsonResp => {
        var data = jsonResp.items
        this.setState({
          paintings: data
        })
      });
  }

  /*fetchMostViewed = () => {
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/', targetUrl = 'https://www.wikiart.org/en/api/2/MostViewedPaintings?imageFormat=Blog'
    fetch(proxyUrl + targetUrl)
      .then(res => res.json())
      .then((response) => {
        console.log(response)
        var MostViewedPaintings = response.data
        var paginationToken = response.paginationToken
        this.setState({
          mostViewedPaintings: MostViewedPaintings,
          currentPaginationToken: paginationToken
        })
      })
      .catch(error => console.log(error))
  }*/

  handleVote = (type) => {
    var photoId = this.state.paintings[this.state.currentPhoto].id
    var votes = this.state.votes
    votes[photoId] = type
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <span id="title">Emotion Picker by Neurogram</span>
          {this.state.paintings.length !== 0 &&
            <React.Fragment>
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
              <div id="navBtn">
                <Button disabled={this.state.currentPhoto === 0} variant="contained" onClick={this.previousPhoto} value="<">{"<"}</Button>
                <Button disabled={this.state.currentPhoto === this.state.paintings.length - 1} variant="contained" onClick={this.nextPhoto} value=">">{">"}</Button>
              </div>
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
