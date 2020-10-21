// import { ReactComponent } from '*.svg';
import React from 'react';
import Square from './square.js';
import Timer from './timer.js';
import * as Constants from '../constants.js';
import {randomInt} from '../helper.js';
import '../style.css';
import mine from '../Assets/mine.png';
import flag from '../Assets/flag.png';
// import timer from '../Assets/timer.png';

class Map extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      difficulty: props.difficulty,
      numRevealed: 0,
      numFlagged: 0,
      grid: [],
      gameState: null,
      startTime: null,
      endTime: null,
    }
    this.initGrid = this.initGrid.bind(this);
    this.resetMap = this.resetMap.bind(this);
    this.plantMines = this.plantMines.bind(this);
    this.clearMap = this.clearMap.bind(this);
    this.flag = this.flag.bind(this);
    this.reveal = this.reveal.bind(this);
    this.checkWin = this.checkWin.bind(this);
    this.setMineCounts = this.setMineCounts.bind(this);
    this.revealMines = this.revealMines.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount() {
    this.initGrid();
  }

  componentDidUpdate() {
    if (this.state.difficulty.name !== this.props.difficulty.name) {
      this.resetMap();
      this.initGrid();
    }
  }

  resetMap() {
    this.setState({ 
      difficulty: this.props.difficulty,
      numRevealed: 0,
      numFlagged: 0,
      grid: [],
      gameState: null,
      startTime: null,
      endTime: null,
    });
  }

  // create an empty map (ie. no mines, all values set to 0)
  initGrid() {
    const newGrid = [];
    for (let row = 0; row < this.props.difficulty.numRows; row++) {
      newGrid[row] = [];
      for (let col = 0; col < this.props.difficulty.numCols; col++) {
        newGrid[row][col] = {row: row, col: col, state: Constants.HIDDEN_STATE, isMine: false, mineCount: 0};
      }
    }
    this.setState({ 
      gameState: Constants.START_STATE,
      grid: newGrid, 
    });
  }

  // plants mine after first click
  plantMines(row, col) {
    // prepare a list of allowed coordinates for mine placement
    let allowed = [];
    for (let r = 0; r < this.props.difficulty.numRows; r++) {
      for (let c = 0; c < this.props.difficulty.numCols; c++) {
        if (Math.abs(row - r) > 2 || Math.abs(col - c) > 2)
          allowed.push([r, c]);
      }
    }

    let newGrid = this.state.grid.slice();
    for (let i = 0; i < this.props.difficulty.numMines; i++) {
      let j = randomInt(i, allowed.length - 1);
      [allowed[i], allowed[j]] = [allowed[j], allowed[i]];
      let [r, c] = allowed[i];
      newGrid[r][c].isMine = true;
    }
    this.setState({
      grid: newGrid,
      gameState: Constants.IN_PROGRESS_STATE,
      startTime: Date.now(),
    });
    
    this.clearMap();
    this.setMineCounts();
  }

  // returns the count of the given coordinate
  calculateMineCount(row, col) {
    const c = (r, c) => (
      this.validateCoordinate(r, c) && this.state.grid[r][c].isMine ? 1 : 0);
    let count = 0;
    for (let adjRow = row - 1; adjRow <= row + 1; adjRow++) {
      for (let adjCol = col - 1; adjCol <= col + 1; adjCol++) {
        count += c(adjRow, adjCol);
      }
    }
    return count;
  }

  // returns true if the given coordinate is on the map
  validateCoordinate(row, col) {
    return (row >= 0 && row < this.props.difficulty.numRows &&
      col >= 0 && col < this.props.difficulty.numCols) ? true : false;
  }

  // uncovers a cell at a given coordinate
  // this is the 'left-click' functionality
  reveal(square) {
    if (this.state.gameState === Constants.LOSE_STATE || this.state.gameState === Constants.WIN_STATE) return;

    let isValidCoordinate = this.validateCoordinate(square.row, square.col);
    if(!isValidCoordinate) return false;

    let isHidden = this.state.grid[square.row][square.col].state === Constants.HIDDEN_STATE;
    if(!isHidden) return false;

    if(this.state.gameState === Constants.START_STATE)
      this.plantMines(square.row, square.col); 
    
    let counter = 0;
    const floodFill = (r,c) => {
      let updatedGrid = this.state.grid.slice();
      let isValidCoordinate = this.validateCoordinate(r, c);
      if(!isValidCoordinate) return false;

      let isHidden = updatedGrid[r][c].state === Constants.HIDDEN_STATE;
      if(!isHidden) return false;

      updatedGrid[r][c].state = updatedGrid[r][c].state !== Constants.FLAGGED_STATE ? Constants.REVEALED_STATE : updatedGrid[r][c].state;
      counter++;
      this.setState({
        grid: updatedGrid,
      });

      if(updatedGrid[r][c].mineCount !== 0) return;

      floodFill(r-1,c-1);  floodFill(r-1,c);  floodFill(r-1,c+1);
      floodFill(r  ,c-1);                  ;  floodFill(r  ,c+1);
      floodFill(r+1,c-1);  floodFill(r+1,c);  floodFill(r+1,c+1);
    };
    floodFill(square.row, square.col);

    let newRevealed = this.state.numRevealed + counter;
    this.setState({
      numRevealed: newRevealed,
    }, () => this.checkWin());
    // have we hit a mine?
    if( this.state.grid[square.row][square.col].isMine) {
      this.setState({ 
        gameState: Constants.LOSE_STATE,
        endTime: Date.now(),
      }, () => this.revealMines());
    }

    return true;
  }

  flag(square) {
    clearTimeout(this.clickHoldTimer);
    let isValidCoordinate = this.validateCoordinate(square.row,square.col);
    if(!isValidCoordinate) return false;

    let isRevealed = this.state.grid[square.row][square.col].state === Constants.REVEALED_STATE;
    if(isRevealed) return false;

    let updatedGrid = this.state.grid.slice();
    updatedGrid[square.row][square.col].state = updatedGrid[square.row][square.col].state === Constants.FLAGGED_STATE? Constants.HIDDEN_STATE : Constants.FLAGGED_STATE;

    this.setState({
      numFlagged: this.state.numFlagged + (this.state.grid[square.row][square.col].state === Constants.FLAGGED_STATE ? 1 : -1),
      grid: updatedGrid,
    }, () => this.checkWin());

    return true;
  }
  
  handleMouseDown(e, square) {
    this.isLongPress = false;
    this.clickHoldTimer = setTimeout(() => {
        this.flag(square);
        this.isLongPress = true;
    }, 2000);
    
    return () => clearTimeout(this.clickHoldTimer);
  }

  handleMouseUp(e, square) {
    clearTimeout(this.clickHoldTimer);
    if (!this.isLongPress){
      if (e.nativeEvent.which === 1) {
        this.reveal(square);
      }
    }
  }
  
  // remove flags
  clearMap() {
    let newGrid = this.state.grid.slice();
    for (let row = 0; row < this.props.difficulty.numRows; row++) {
      for (let col = 0; col < this.props.difficulty.numCols; col++) {
        if (this.state.grid[row][col].state === Constants.FLAGGED_STATE)
          newGrid[row][col].state = Constants.HIDDEN_STATE;
      }
    }
    this.setState({
      grid:newGrid,
      numFlagged: 0,
    });
  }

  // update mine counts
  setMineCounts() {
    let newGrid = this.state.grid.slice();
    for (let row = 0; row < this.props.difficulty.numRows; row++) {
      for (let col = 0; col < this.props.difficulty.numCols; col++) {
        newGrid[row][col].mineCount = this.calculateMineCount(row, col);
      }
    }
    this.setState({grid:newGrid,});
  }

  revealMines() {
    let revealedMinesGrid = this.state.grid.slice();
    for (let row = 0; row < this.props.difficulty.numRows; row++) {
      for (let col = 0; col < this.props.difficulty.numCols; col++) {
        if (revealedMinesGrid[row][col].isMine){
          // is a mine but not flagged -> reveal mine
          if (revealedMinesGrid[row][col].state !== Constants.FLAGGED_STATE){
            revealedMinesGrid[row][col].state = Constants.REVEALED_STATE;
          }
        } else {
          // not a mine but flagged -> correct
          if (revealedMinesGrid[row][col].state === Constants.FLAGGED_STATE){
            revealedMinesGrid[row][col].state = Constants.CORRECTED_STATE;
          }
        }
      }
    }

    this.setState({grid:revealedMinesGrid,});
  }

  checkWin() {
    if (this.state.numRevealed === this.props.difficulty.numRows * this.props.difficulty.numCols - this.props.difficulty.numMines) {
      this.setState({
        gameState: Constants.WIN_STATE,
        endTime: Date.now(),
      });
    }
  }

  renderRestart = () => (
    <div>
      <div className="status-bar">
          <h2>{this.state.gameState === Constants.LOSE_STATE || this.state.gameState === Constants.WIN_STATE ? this.state.gameState + '!' : "" }</h2>
          <button className='restart' onClick={() => {this.resetMap(); this.initGrid()}}>{this.state.gameState === Constants.LOSE_STATE || this.state.gameState === Constants.WIN_STATE ? 'Play Again' : 'Restart'}</button>
        </div> 
    </div>
  )

  renderStatus = () => (
    <div>
      <div className="status-bar">
        <img src={flag} alt="flag"></img>
        <span>{this.state.numFlagged} / </span>
        <img src={mine} alt="mine"></img>
        <span>{this.state.difficulty.numMines}</span>
        <div className="empty"></div>
        <Timer startTime={this.state.startTime} endTime={this.state.endTime} currentTime={Date.now()}></Timer>
      </div>
    </div>
  )

  render = () => (
    <div>
      {this.renderStatus()}
      {this.renderRestart()}
      <div className="map">
        {this.state.grid.map((row, rindex) => (
          <div key={rindex} className="row">{row.map((square, index) => (
            <div key={index} className="square-wrapper" onMouseDown={(e)=>{this.handleMouseDown(e, square)}} onMouseUp={(e)=>{this.handleMouseUp(e, square)}}  onContextMenu={(e)=>{e.preventDefault(); this.flag(square);}}>
                <Square state={square.state} mineCount={square.mineCount} isMine={square.isMine}></Square>
            </div>
          ))}</div>
        ))}
      </div>
    </div>
  )
}

export default Map;