// square states
export const REVEALED_STATE = "revealed"; 
export const HIDDEN_STATE = "hidden";
export const FLAGGED_STATE = "flagged";
export const CORRECTED_STATE = "corrected";

// difficulty levels
export const EASY_MODE = {name: "easy", numRows: 10, numCols: 8, numMines: 10};
export const MEDIUM_MODE = {name: "medium", numRows: 13, numCols: 15, numMines: 40};
export const HARD_MODE = {name: "hard", numRows: 16, numCols: 30, numMines: 99};

// game state
export const START_STATE = "start"; // before first click
export const IN_PROGRESS_STATE = "in progress"; // after first click
export const WIN_STATE = "win"; // all non mine squares revealed
export const LOSE_STATE = "gameover"; // mine revealed