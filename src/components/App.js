import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import DataPlot from './DataPlot';
import LearningRateSelector from './LearningRateSelector';
import Button from './Button';
import { generateData } from '../tensorflow/data';

const trueCoefficients = {a: -.8, b: -.2, c: .9, d: .5};

// TODO
// style

class App extends Component {
  static resetState (learningRate = 0.5) {
    const { trainXs, trainYs, testXs, testYs } = generateData(trueCoefficients);
    return {
      a: tf.variable(tf.scalar(Math.random())),
      b: tf.variable(tf.scalar(Math.random())),
      c: tf.variable(tf.scalar(Math.random())),
      d: tf.variable(tf.scalar(Math.random())),
      error: [],
      testError: [],
      isTraining: false,
      iteration: 0,
      learningRate,
      predictions: new Float32Array(),
      showTestData: true,
      trainingData: { xs: trainXs, ys: trainYs },
      testData: { xs: testXs, ys: testYs }
    };
  }

  constructor () {
    super();
    this.state = App.resetState();
  }

  componentDidMount () {
    this.optimizer = tf.train.sgd(this.state.learningRate);
    this.singleStepTrain();
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

  singleStepTrain () {
    const { xs, ys } = this.state.trainingData;
    this.train(xs, ys);
  }

  train (xs, ys) {
    this.optimizer.minimize(() => {
      const predictions = this.predict(xs, this.state.a, this.state.b, this.state.c, this.state.d);
      const predictionsValue = predictions.dataSync();
      const error = this.loss(predictions, ys);
      const errorValue = error.dataSync()[0];
      this.setState(({ iteration, error }) => ({ error: error.concat(errorValue), iteration: iteration + 1, predictions: predictionsValue }));
      return error;
    });
    
    const { testData } = this.state;
    const testPredictions = this.predict(testData.xs, this.state.a, this.state.b, this.state.c, this.state.d);
    const testErrorValue = this.loss(testPredictions, testData.ys).dataSync()[0];
    this.setState(({ testError }) => ({ testError: testError.concat(testErrorValue) }));
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
    this.setState(() => App.resetState(learningRate), () => this.singleStepTrain());
  }

  render () {
    return (
      <div>
        <span>learning rate: 
          <LearningRateSelector learningRate={this.state.learningRate} onChange={(e) => this.reset(parseFloat(e.target.value))} />
        </span>
        <span>show test data:
          <input type="checkbox" checked={this.state.showTestData} onChange={(e) => this.setState(({ showTestData }) => ({ showTestData: !showTestData }))} />
        </span>
        <Button onClick={this.playToggle.bind(this)}>{this.state.isTraining ? 'stop' : 'train'}</Button>
        <Button className="btn" onClick={() => this.reset()}>reset</Button>
        <Button className="btn" disabled={this.state.isTraining} onClick={this.singleStepTrain.bind(this)}>step+</Button>
        <DataPlot
          a={this.state.a.dataSync()[0]}
          b={this.state.b.dataSync()[0]}
          c={this.state.c.dataSync()[0]}
          d={this.state.d.dataSync()[0]}
          error={this.state.error}
          testError={this.state.testError}
          iteration={this.state.iteration}
          predictions={this.state.predictions}
          showTestData={this.state.showTestData}
          trainXs={this.state.trainingData.xs.dataSync()}
          trainYs={this.state.trainingData.ys.dataSync()}
          testXs={this.state.testData.xs.dataSync()}
          testYs={this.state.testData.ys.dataSync()}
        />
      </div>
    );
  }
}

export default App;
