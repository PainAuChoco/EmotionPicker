import './App.css';
import React from "react";
import ImageContainer from './Components/ImageContainer'
import VotingButtons from './Components/VotingButtons'

class App extends React.Component {

  handleVote = () => {
    fetch('/listFiles')
      .then(res => res.json())
      .then((response) => {
        console.log(response)
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Emotion Picker by Neurogram
          <ImageContainer
            url='https://images-na.ssl-images-amazon.com/images/I/91I3JlbFABL._AC_SL1500_.jpg'
            width={400}
            height={300}
          />
          <VotingButtons 
            callbackClick={this.handleVote}
          />
        </header>
      </div>
    )
  }
}

export default App;
