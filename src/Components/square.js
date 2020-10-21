import React from 'react';
import * as Constants from '../constants.js';
import { digitToWord } from '../helper.js';
import '../style.css';
import mine from '../Assets/mine.png';
import flag from '../Assets/flag.png';
import correction from '../Assets/correction.png';
import hidden from '../Assets/hidden.png';

class Square extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isMine: this.props.isMine,
      state: this.props.state,
    }
  }

  getIcon = () => {
    if (this.props.state === Constants.REVEALED_STATE) {
      if (this.props.isMine) {
        return <img src={mine} alt="mine"></img>
      } else {
        return <img src={digitToWord(this.props.mineCount)} alt={this.props.mineCount}></img>
      }
    } else if (this.props.state === Constants.FLAGGED_STATE) {
      return <img src={flag} alt='flag'></img>
    } else if (this.props.state === Constants.HIDDEN_STATE) {
      return <img className='hidden' src={hidden} alt='flag'></img>
    } else if (this.props.state === Constants.CORRECTED_STATE) {
      return <img src={correction} alt='flag'></img>
    } else {
      return <div>err</div>
    }
  }

  render = () => (
    <button className="square" onClick={this.reveal} onContextMenu={this.flag}>
      {this.getIcon()}
    </button>
  )
}

export default Square;