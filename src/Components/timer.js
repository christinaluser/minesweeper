import React from 'react';
import timer from '../Assets/timer.png';

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.gettime = this.getTime.bind(this);
  }

    // eslint-disable-next-line
    setTime = ()=> setInterval(() => {
      let time = this.getTime();
      document.querySelector(".time-elapsed").innerHTML = Math.floor(time);
    }, 1000);

  getTime = () => {
    if (this.props.endTime === null) {
      if (this.props.startTime === null) {
        return 0;
      } else {
        return (this.props.currentTime-this.props.startTime)/(1000);
      }
    } else {
      return (this.props.endTime-this.props.startTime)/(1000);
    }
  }

  render = () => (  
    <div className='timer-wrapper'>
      <img src={timer} alt='timer'></img>
      <div className="time-elapsed">{this.setTime()}</div>
    </div>
  );
}

export default Timer;