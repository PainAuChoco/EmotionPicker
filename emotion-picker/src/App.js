import './App.css';
import React from "react";
import ImageContainer from './Components/ImageContainer'
import VotingButtons from './Components/VotingButtons'
import Button from "@material-ui/core/Button"

class App extends React.Component {

  state = {
    mostViewedPaintings: [],
    currentPhoto: 0
  }

  componentDidMount() {
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/', targetUrl = 'https://www.wikiart.org/en/api/2/MostViewedPaintings?imageFormat=Blog'
    fetch(proxyUrl + targetUrl)
      .then(res => res.json())
      .then((response) => {
        console.log(response)
        var MostViewedPaintings = response.data
        this.setState({
          mostViewedPaintings: MostViewedPaintings
        })
      })
      .catch(error => console.log(error))
  }

  handleVote = () => {
    fetch('/listFiles')
      .then(res => res.json())
      .then((response) => {
        console.log(response)
      })
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
          Emotion Picker by Neurogram
          {this.state.mostViewedPaintings.length !== 0 &&
            <React.Fragment>
              <ImageContainer
                url={this.state.mostViewedPaintings[this.state.currentPhoto].image}
              //width={400}
              //height={300}
              />
              <div className="d-flex inline">
                <Button className="navBtn" disabled={this.state.currentPhoto === 0} variant="contained" onClick={this.previousPhoto} value="<">{"<"}</Button>
                <Button className="navBtn" disabled={this.state.currentPhoto === this.state.mostViewedPaintings.length - 1} variant="contained" onClick={this.nextPhoto} value=">">{">"}</Button>
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
