import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import DataPlot from './DataPlot';
import LearningRateSelector from './LearningRateSelector';
import { generateData } from '../tensorflow/data';

const trueCoefficients = {a: -.8, b: -.2, c: .9, d: .5};

class App extends Component {
  static resetState (learningRate = 0.5) {
    const { trainXs, trainYs, testXs, testYs } = generateData(trueCoefficients);
    return {
      a: tf.variable(tf.scalar(Math.random())),
      b: tf.variable(tf.scalar(Math.random())),
      c: tf.variable(tf.scalar(Math.random())),
      d: tf.variable(tf.scalar(Math.random())),
      trainingError: [],
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
      const trainingError = this.loss(predictions, ys);
      const trainingErrorValue = trainingError.dataSync()[0];
      this.setState(({ iteration, trainingError }) => ({ trainingError: trainingError.concat(trainingErrorValue), iteration: iteration + 1, predictions: predictionsValue }));
      return trainingError;
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

  reset (learningRate = this.state.learningRate) {
    this.setState(() => App.resetState(learningRate), () => this.singleStepTrain());
  }

  render () {
    const { a, b, c, d, isTraining, learningRate, showTestData, ...otherState } = this.state;
    return (
      <MuiThemeProvider>
        <Paper style={{height: '90vh'}} zDepth={2}>
          <Toolbar>
            <ToolbarGroup>
              <LearningRateSelector learningRate={learningRate} onChange={(e, i, value) => this.reset(value)} />
              <Checkbox label="show test data" checked={showTestData} onCheck={() => this.setState(({ showTestData }) => ({ showTestData: !showTestData }))} />
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarSeparator />
              <FlatButton label={isTraining ? 'stop' : 'train'} onClick={this.playToggle.bind(this)} />
              <FlatButton label="reset" onClick={() => this.reset()} secondary={true} />
              <FlatButton label="step+" disabled={isTraining} onClick={this.singleStepTrain.bind(this)} />
            </ToolbarGroup>
          </Toolbar>
          <DataPlot
            a={a.dataSync()[0]}
            b={b.dataSync()[0]}
            c={c.dataSync()[0]}
            d={d.dataSync()[0]}
            showTestData={showTestData}
            {...otherState}
          />
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default App;
