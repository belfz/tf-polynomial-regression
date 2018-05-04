import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import './App.css';
import DataPlot from './DataPlot';
import PlayButton from './PlayButton';
import { generateData } from '../tensorflow/data';

const trueCoefficients = {a: -.8, b: -.2, c: .9, d: .5};

class App extends Component {
  constructor () {
    super();
    this.state = {
      a: tf.variable(tf.scalar(Math.random())),
      b: tf.variable(tf.scalar(Math.random())),
      c: tf.variable(tf.scalar(Math.random())),
      d: tf.variable(tf.scalar(Math.random())),
      isTraining: false,
      iteration: 0,
      learningRate: 0.5,
      predictions: new Float32Array(),
      trainingData: generateData(100, trueCoefficients)
    };
  }

  componentDidMount () {
    this.optimizer = tf.train.sgd(this.state.learningRate);
    this.setState(({ trainingData }) => ({
      predictions: this.predict(trainingData.xs).dataSync()
    }));
  }

  loss (prediction, labels) {
    // Having a good error function is key for training a machine learning model
    return prediction.sub(labels).square().mean();
  }

  predict (x) {
    // y = a * x ^ 3 + b * x ^ 2 + c * x + d
    return tf.tidy(() => {
      return this.state.a.mul(x.pow(tf.scalar(3, 'int32')))
        .add(this.state.b.mul(x.square()))
        .add(this.state.c.mul(x))
        .add(this.state.d);
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
      const predictions = this.predict(xs);
      const predictionsAsArray = predictions.clone().dataSync();
      this.setState(({ iteration }) => ({ predictions: predictionsAsArray, iteration: iteration + 1 }));
      const error = this.loss(predictions, ys); // TODO eventually plot it, too
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

  render () {
    return (
      <div>
        <DataPlot
          a={this.state.a.dataSync()[0]}
          b={this.state.b.dataSync()[0]}
          c={this.state.c.dataSync()[0]}
          d={this.state.d.dataSync()[0]}
          iteration={this.state.iteration}
          predictions={this.state.predictions}
          xs={this.state.trainingData.xs.dataSync()}
          ys={this.state.trainingData.ys.dataSync()}
        />
        {/* buttons: at least one button (run/stop), step+1, reset */}
        <PlayButton
          isTraining={this.state.isTraining}
          onClick={this.playToggle.bind(this)}
        />
      </div>
    );
  }
}

export default App;
