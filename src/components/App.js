import React, { Component } from 'react';
import './App.css';
import PlayButton from './PlayButton';

class App extends Component {
  constructor () {
    super();
    this.state = {
      isTraining: false
    };
  }

  render() {
    return (
      <div>
        <PlayButton
          isTraining={this.state.isTraining}
          onClick={() => this.setState(prevState => ({ isTraining: !prevState.isTraining }))}
        />
      </div>
    );
  }
}

export default App;
