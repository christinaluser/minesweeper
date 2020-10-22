import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import Map from './Components/map.js';
import * as Constants from './constants.js';

class App extends React.Component {
  componentDidMount(){
    document.title = "Minesweeper";
  }

  list = [Constants.EASY_MODE, Constants.MEDIUM_MODE];
  constructor(props) {
    super(props);
    this.state = {
      difficulty: this.list[0],
    }
    this.handleDifficultyChange = this.handleDifficultyChange.bind(this);
  }

  handleDifficultyChange(event) {
    this.setState({ difficulty: this.list[event.target.value]});
  }


  render = () => (
    <div className="game">
      <div className="difficulty">
        <select onChange={this.handleDifficultyChange}>
          {this.list.map((option, index) =>
            <option key={index} value={index}>
              {option.name}
            </option>
          )}
        </select>
      </div>
      <Map difficulty={this.state.difficulty}></Map>
    </div>
  );

}

export default App;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


