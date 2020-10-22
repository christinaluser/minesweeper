import React from 'react';
import * as Constants from '../constants.js';
import { digitToImg } from '../helper.js';
import '../style.css';
import mine from '../Assets/mine.png';
import flag from '../Assets/flag.png';
import correction from '../Assets/correction.png';

class Square extends React.Component {
  getIcon = () => {
    if (this.props.state === Constants.REVEALED_STATE) {
      if (this.props.isMine) {
        return <img src={mine} alt="mine"></img>
      } else {
        return <img src={ digitToImg(this.props.mineCount) } alt={ this.props.mineCount }></img>
      }
    } else if (this.props.state === Constants.FLAGGED_STATE) {
      return <img src={ flag } alt='F'></img>
    } else if (this.props.state === Constants.HIDDEN_STATE) {
      return <img className='hidden' src={ digitToImg(0) } alt='H'></img>
    } else if (this.props.state === Constants.CORRECTED_STATE) {
      return <img src={ correction } alt='C'></img>
    } else {
      return <div>err</div>
    }
  }

  render = () => (
    <button className={`square ${this.props.state}`} onClick={this.reveal} onContextMenu={this.flag}>
      {this.getIcon()}
    </button>
  )
}

export default Square;