import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import './App.css';
import DataPlot from './DataPlot';
import LearningRateSelector from './LearningRateSelector';
import PlayButton from './PlayButton';
import { generateData } from '../tensorflow/data';

const trueCoefficients = {a: -.8, b: -.2, c: .9, d: .5};

// TODO
// test data + predictions
// style
// * styled components

class App extends Component {
  static resetState (learningRate = 0.5) {
    return {
      a: tf.variable(tf.scalar(Math.random())),
      b: tf.variable(tf.scalar(Math.random())),
      c: tf.variable(tf.scalar(Math.random())),
      d: tf.variable(tf.scalar(Math.random())),
      error: [],
      isTraining: false,
      iteration: 0,
      learningRate,
      predictions: new Float32Array(),
      trainingData: generateData(100, trueCoefficients)
    };
  }

  constructor () {
    super();
    this.state = App.resetState();
  }

  componentDidMount () {
    this.optimizer = tf.train.sgd(this.state.learningRate);
    this.setState(({ trainingData, a, b, c, d }) => ({
      predictions: this.predict(trainingData.xs, a, b, c, d).dataSync()
    }));
  }

  loss (prediction, labels) {
    // Having a good error function is key for training a machine learning model
    return prediction.sub(labels).square().mean();
  }

  predict (xs, a, b, c, d) {
    // y = a * x ^ 3 + b * x ^ 2 + c * x + d
    return tf.tidy(() => {
      return a.mul(xs.pow(tf.scalar(3, 'int32')))
        .add(b.mul(xs.square()))
        .add(c.mul(xs))
        .add(d);
    });
  }

  async continuousTrain (xs, ys) {
    while (this.state.isTraining) {
      this.train(xs, ys);
      // Use tf.nextFrame to not block the browser.
      await tf.nextFrame();
    }
  }

  train (xs, ys) {
    this.optimizer.minimize(() => {
      const predictions = this.predict(xs, this.state.a, this.state.b, this.state.c, this.state.d);
      const predictionsAsArray = predictions.dataSync();
      const error = this.loss(predictions, ys);
      const errorValue = error.dataSync()[0];
      this.setState(({ iteration, error }) => ({ error: error.concat(errorValue), iteration: iteration + 1, predictions: predictionsAsArray }));
      this.forceUpdate(); // need to do that because a, b, c, d are "magically" updated here
      return error;
    });
  }

  playToggle () {
    const isTraining = !this.state.isTraining;
    this.setState(() => ({ isTraining }), () => {
      if (this.state.isTraining) {
        const { xs, ys } = this.state.trainingData;
        this.continuousTrain(xs, ys);
      }
    });
  }

  reset (learningRate) {
    const newState = App.resetState(learningRate);
    const { trainingData, a, b, c, d } = newState;
    const predictions = this.predict(trainingData.xs, a, b, c, d).dataSync();
    this.setState(() => Object.assign(newState, { predictions }));
  }

  render () {
    return (
      <div>
        <DataPlot
          a={this.state.a.dataSync()[0]}
          b={this.state.b.dataSync()[0]}
          c={this.state.c.dataSync()[0]}
          d={this.state.d.dataSync()[0]}
          error={this.state.error}
          iteration={this.state.iteration}
          predictions={this.state.predictions}
          xs={this.state.trainingData.xs.dataSync()}
          ys={this.state.trainingData.ys.dataSync()}
        />
        <span>learning rate: 
          <LearningRateSelector learningRate={this.state.learningRate} onChange={(e) => this.reset(parseFloat(e.target.value))} />
        </span>
        <PlayButton
          isTraining={this.state.isTraining}
          onClick={this.playToggle.bind(this)}
        />
        <button onClick={() => this.reset()}>reset</button>
        <button disabled={this.state.isTraining} onClick={() => {
          const { xs, ys } = this.state.trainingData;
          this.train(xs, ys);
        }}>step+</button>
      </div>
    );
  }
}

export default App;
