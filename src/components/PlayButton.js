import React from 'react';

const PlayButton = ({ isTraining, onClick }) =>
  <button onClick={onClick}>{ isTraining ? 'stop' : 'train' }</button>;

export default PlayButton;
