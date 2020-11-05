import './App.css';
import React from "react";
import ImageContainer from './Components/ImageContainer'
import VotingButtons from './Components/VotingButtons'
import Button from "@material-ui/core/Button"

class App extends React.Component {

  state = {
    mostViewedPaintings: [],
    currentPhoto: 0,
    votes: {}
  }

  componentDidMount() {
    this.fetchMostViewed()
  }

  fetchMostViewed = () => {
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
  }

  handleVote = (type) => {
    var photoId = this.state.mostViewedPaintings[this.state.currentPhoto].id
    var votes = this.state.votes
    votes[photoId] = type
    this.setState({
      votes: votes
    })
    this.nextPhoto()
  }

  nextPhoto = () => {
    var currentPhoto = this.state.currentPhoto
    if (currentPhoto === this.state.mostViewedPaintings.length - 1) {

    }
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
          Emotion Picker by Neurogram
          {this.state.mostViewedPaintings.length !== 0 &&
            <React.Fragment>
              <ImageContainer
                url={this.state.mostViewedPaintings[this.state.currentPhoto].image}
              //width={400}
              //height={300}
              />
              <div id="navBtn">
                <Button disabled={this.state.currentPhoto === 0} variant="contained" onClick={this.previousPhoto} value="<">{"<"}</Button>
                <Button disabled={this.state.currentPhoto === this.state.mostViewedPaintings.length - 1} variant="contained" onClick={this.nextPhoto} value=">">{">"}</Button>
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
