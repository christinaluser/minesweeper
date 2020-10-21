import React from 'react';
import timer from '../Assets/timer.png';

class Timer extends React.Component {
  state = {
    currentTime: Date.now(),
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ currentTime: Date.now(), }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getTime = () => {
    if (this.props.endTime === null) {
      if (this.props.startTime === null) {
        return 0;
      } else {
        return Math.ceil((this.state.currentTime-this.props.startTime)/(1000));
      }
    } else {
      return Math.ceil((this.props.endTime-this.props.startTime)/(1000));
    }
  }

  render = () => (  
    <div className='timer-wrapper'>
      <img src={timer} alt='timer'></img>
      <div>{this.getTime()}</div>
    </div>
  );
}

export default Timer;