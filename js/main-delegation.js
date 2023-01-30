import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
    getCellElementList,
    getCellListElement,
    getCurrentTurnElement,
    getReplayButtonElement,
} from "./selectors.js";
import {
    checkGameStatus,
    toggleTurn,
    updategameStatus,
    showReplaybutton,
    hideReplaybutton,
    highlightWinCell,
} from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function handleCellClick(cell, index) {
    const isClicked =
        cell.classList.contains(TURN.CIRCLE) ||
        cell.classList.contains(TURN.CROSS);

    const isEndGame = gameStatus !== GAME_STATUS.PLAYING;

    if (isClicked || isEndGame) return;

    // set selected cell
    cell.classList.add(currentTurn);

    //update cell value
    cellValues[index] =
        currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    //toggle turn
    currentTurn = toggleTurn(currentTurn).current;

    //check game status
    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED: {
            //update game status
            gameStatus = game.status;
            updategameStatus(game.status);
            //show replay button
            showReplaybutton();
            break;
        }
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN:
            //update game status
            gameStatus = game.status;
            updategameStatus(game.status);
            //show replay button
            showReplaybutton();
            //highlight win cells
            highlightWinCell(game.winPositions);
            break;

        default:
        //playing
    }
}
function initCellElementList() {
    const liList = getCellElementList();

    liList.forEach((cell, index) => {
        cell.dataset.idx = index;
    });

    const ulElement = getCellListElement();

    if (ulElement) {
        ulElement.addEventListener("click", (event) => {
            if (event.target.tagName !== "LI") return;
            const index = Number.parseInt(event.target.dataset.idx);
            handleCellClick(event.target, index);
        });
    }
}

function resetGame() {
    //reset temp global var
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => "");
    //reset DOM element
    //reset game status
    updategameStatus(GAME_STATUS.PLAYING);
    //reset current turn
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }
    //reset game board
    const cellElementList = getCellElementList();
    for (const cellElement of cellElementList) {
        cellElement.className = "";
    }
    //hide replay button
    hideReplaybutton();
}
function initReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) {
        replayButton.addEventListener("click", resetGame);
    }
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
    //Bind click event for li cells
    initCellElementList();
    initReplayButton();
})();
