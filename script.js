//Function that creates a cell with keys
function cell(row, column, mined, flagged, opened, minedNeighbours) {
    return {
        id: `${row}-${column}`, //id fix
        row,
        column,
        mined,
        flagged,
        opened,
        minedNeighbours,
    }
}

//Populate Minesweeper board by creating cells, defining default cell values
function createBoard(size, mines) {
    document.getElementById("createBoard").classList.add('hidden');
    document.getElementById("overlay").classList.toggle('hidden');
    document.getElementById("startGame").classList.toggle('hidden');
    let boardTest = {};
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            boardTest[`${i}-${j}`] = cell(i, j, false, false, false, false); //id fix
        }
    }
    totalMines = mines;
    board = boardTest;
    mineBoard(size, totalMines, board)
}

const getRandomInteger = (size) => Math.floor(Math.random() * size);

function mineBoard(size, totalMines, board) {
    let mines = [];
    while (mines.length < totalMines) {
        for (let i = mines.length; i < totalMines; i++) {
            let mineRow = getRandomInteger(size);
            let mineColumn = getRandomInteger(size);
            let mineCoordinates = `${mineRow}-${mineColumn}`;
            mines.push(mineCoordinates);
        }
        mines.sort();
        for (let j = 0; j < mines.length; j++) {
            if (mines[j] === mines[j + 1]) {
                mines.splice(j, 1);
            }
        }
    }
    mineCells(size, mines, board)
}

function mineCells(size, mines, board) {
    for (let i = 0; i < mines.length; i++) {
        let x = mines[i];
        board[x].mined = true;
    }
    calcNeighbourMines(size, board)
}

function calcNeighbourMines(size, board) {
    for (let row = 0; row < size; row++) {
        for (let column = 0; column < size; column++) {
            let neighbourArr = [];
            let cellId = `${row}-${column}`; //id fix
            let count;
            if (board[cellId].mined !== true) {
                let neighbours = findNeighbours(row, column, size, neighbourArr);
                count = neighbours.filter(value => board[value].mined === true).length;
                board[cellId].minedNeighbours = count;
            }
        }
    }
    displayBoard(board);
}

function findNeighbours(row, column, size, neighbourArr) {
    if (row > 0) {
        if (column > 0) {
            // id fix - I swapped in a dash in place of a space
            neighbourArr.push((row - 1) + '-' + (column - 1)); // back left
        }
        neighbourArr.push((row - 1) + '-' + (column)); // back 
        if (column < (size - 1)) {
            neighbourArr.push((row - 1) + '-' + (column + 1)); // back right
        }
    }
    if (column > 0) {
        neighbourArr.push((row) + '-' + (column - 1)); // left
    }
    if (column < (size - 1)) {
        neighbourArr.push((row) + '-' + (column + 1)); // right
    }
    if (row < (size - 1)) {
        if (column > 0) {
            neighbourArr.push((row + 1) + '-' + (column - 1)); // forward left
        }
        neighbourArr.push((row + 1) + '-' + (column)); // forward
        if (column < (size - 1)) {
            neighbourArr.push((row + 1) + '-' + (column + 1)); // forward right
        }
    }
    return neighbourArr;
}

function displayBoard(obj) {
    document.getElementById("wrapper").style.visibility = "visible";
    for (let x in obj) {
        if (obj[x].column === 0) {
            let divRow = document.createElement("div");
            divRow.setAttribute("class", "row");
            let container = document.getElementById("container");
            container.appendChild(divRow);
        }
        if (typeof obj[x] === 'object') {
            let div = document.createElement("div");
            div.setAttribute("class", "box");
            let cellId = `cell${x}` //id fix
            div.classList.add(cellId);
            let y = obj[x].row;
            let box = document.getElementsByClassName("row")[y];
            box.appendChild(div);
            // divHover(div);
            let flag = document.createElement("span");
            flag.classList.add("hidden", "icon", "icon-flag");
            div.appendChild(flag)
            //flag(cellId);
            if (obj[x].minedNeighbours !== false) {
                let line = document.createElement("p");
                let cellData = document.createTextNode(obj[x].minedNeighbours);
                line.appendChild(cellData);
                div.insertBefore(line, flag)
            } else {
                let span = document.createElement("span");
                span.classList.add("icon", "icon-bomb");
                div.insertBefore(span, flag)
            }
        }
    }
    mineTally();
    createButtons();
}

function mineTally() {  
    let mineCount = document.createElement("p");
    let cellData = document.createTextNode(`${totalMines} / ${totalMines}`);
    mineCount.appendChild(cellData);
    document.getElementById('count').appendChild(mineCount);
}

function countBombs(obj) {
    let flaggedCells = document.getElementsByClassName('flagged').length;
    let tallyText = `${totalMines - flaggedCells} / ${totalMines}`
    document.getElementById('count').firstElementChild.innerHTML = tallyText;
    if (flaggedCells === totalMines) {
        winCondition()
    }
}

function isMined(obj, row, column) {
    let cell = obj[`${row}-${column}`];
    let mined = 0;
    mined = cell.mined ? 1 : 0;
    return mined;
}

function createButtons() {
    let boxArr = document.getElementsByClassName("box");
    Array.from(boxArr).forEach(function (element) {
        element.addEventListener("click", revealCell, false);
        element.oncontextmenu = function(e) {
            e.preventDefault();
        }
        element.addEventListener("auxclick", flagCells, false);
    })

}

function revealCell() {
    let linkedCell = this;
    let cellClass = linkedCell.firstElementChild;
    let cellId = board[linkedCell.classList[1].slice(4)];
    let minedNeighbours = cellId.minedNeighbours;
    selectedCell(linkedCell, cellId, 0)

    switch (minedNeighbours) {
        case 0:
            blankCells(linkedCell)
            break;
        case 1:
            cellClass.setAttribute("id", "blue");
            break;
        case 2:
            cellClass.setAttribute("id", "green");
            break;
        case 3:
            cellClass.setAttribute("id", "red");
            break;
        case 4:
            cellClass.setAttribute("id", "dark-blue");
            break;
        case 5:
            cellClass.setAttribute("id", "maroon");
            break;
        case 6:
            cellClass.setAttribute("id", "teal");
            break;
        case 7:
            cellClass.setAttribute("id", "grey");
            break;
        // 
        case isNaN(minedNeighbours):
            cellClass.setAttribute("id", "bomb");
            // linkedCell.classList.add("redBackground")
            openMines();
            loseCondition(cellId, linkedCell);
            

            // console.log(cellId);
            break;
    }
}

function selectedCell(linkedCell, cellId, arg) {
    linkedCell.removeEventListener("click", revealCell);
    linkedCell.removeEventListener("auxclick", flagCells);
    if (arg === 0) {
        cellId.opened = true;
        linkedCell.classList.add("selected");
    } else if (board[cellId].flagged && board[cellId].mined === false) {
        linkedCell.classList.add("selectedWrongFlag");
    } else if (board[cellId].opened === false) {
        linkedCell.classList.add("selectedGameOver");
    }
    
}

function blankCells(container) {
    let neighbourArr = [];
    let cellClass = container.classList[1];
    let size = Math.sqrt(parseInt(Object.keys(board).length));
    let row = parseInt ((cellClass.slice(4).split('-'))[0])
    let column = parseInt ((cellClass.slice(4).split('-'))[1]);
    // console.log(`Row: ${row} Column: ${column}`);
    let neighbours = findNeighbours(row, column, size, neighbourArr);
    revealBlanks(neighbours, row, column)
    // console.log(neighbours);
}

function revealBlanks(neighbours, row, column) {
    let immediateNeighbours = neighbours.filter(cell => {
        let x = cell.indexOf('-');
        return parseInt(cell.slice(0, x)) === row || parseInt(cell.slice(x + 1)) === column;
    } ); 
    let holdingArr = [];
    if (board[`${row}-${column}`].minedNeighbours === 0) {
        for (let i = 0; i < neighbours.length; i++) {
            let container = document.getElementsByClassName(`cell${neighbours[i]}`)[0];
            let containerClasses = [...container.classList];
            if (board[neighbours[i]].minedNeighbours !== 0) {
                revealCell.apply(container);
            } else if (immediateNeighbours.includes(neighbours[i]) === false){
                //container.classList.add('highlight'); //temp
            }
            else if (containerClasses.includes('selected') === false){
                //container.classList.add('highlightB'); //temp
                holdingArr.push(neighbours[i]);
            }
        }
        holdingArr.forEach(value => {
            let container = document.getElementsByClassName(`cell${value}`)[0];
            revealCell.apply(container);
        })
    }
    }

function flagCells(){
    board[this.classList[1].slice(4)].flagged = true;
    this.classList.toggle('flagged');
    this.childNodes[0].classList.toggle('hidden');
    this.childNodes[1].classList.toggle('hidden');
    countBombs();
}

function beginGame () {
    document.getElementById("overlay").classList.toggle('hidden');
    document.getElementById("startGame").classList.toggle('hidden');
}

function winCondition () {
    let correctAnswers = 0;
    for (let x in board) {
        if (board[x].mined && board[x].flagged) {
            correctAnswers++;
            if (correctAnswers === totalMines) {
                gameWon();
            }
        }   
    }
}

function loseCondition (cellId, linkedCell) {
    if (cellId.mined) {
        gameLost();
        openMines();
    }
}

function gameWon() {
    document.getElementById("overlay").classList.toggle('hidden');
    document.getElementById("winGame").classList.toggle('hidden');
}

function gameLost() {
    document.getElementById("overlay").classList.toggle('hidden');
    document.getElementById("loseGame").classList.toggle('hidden');
    
}

function closeOverlay(end) {
    document.getElementById("overlay").classList.toggle('hidden');
    document.getElementById("textBox").children[1].classList.toggle('hidden');
    if (end === 1){
        document.getElementById('count').firstChild.remove();
        document.getElementById("resetBoard").classList.toggle('hidden');
    }
}

function openMines() {
    let i = 0;
    for(let x in board) {
        let cellId = x;
        let linkedCell = document.getElementsByClassName(`cell${cellId}`)[0];
        if (board[x].mined && board[x].opened === false) {
            linkedCell.firstElementChild.setAttribute("id", "red");
            selectedCell(linkedCell, cellId, 0);
        } else if (board[x].mined === false) {
            selectedCell(linkedCell, cellId, 1);
        }
    }
}

function resetBoard() {
    document.getElementById("createBoard").classList.add('hidden');
    document.getElementById("overlay").classList.add('hidden');
    document.getElementById("startGame").classList.add('hidden');
    document.getElementById("winGame").classList.add('hidden');
    document.getElementById("loseGame").classList.add('hidden');
    document.getElementById("resetBoard").classList.add('hidden');
    document.getElementById("createBoard").classList.add('hidden');
    let finishedGame = Array.from(document.getElementById("container").children);
    for (let i = 0; i < finishedGame.length; i++) {
        finishedGame[i].remove();
    }
    beginGame();
}