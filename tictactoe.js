const canvas = document.getElementById('tutorial');
let ctx = canvas.getContext('2d');
var mapBoard = [0,0,0,
                0,0,0,
                0,0,0];
let empty =  0, X = 1, O = -1;
let humanPlayer = X;
let computer = O;
let cellSize = 200;
let mouse = {
    x: -1,
    y: -1,};
let winPatterns = [
    0b111000000, 0b000111000, 0b000000111, // Rows είναι όπως η μάσκες των δικτύων
    0b100100100, 0b010010010, 0b001001001, // Columns
    0b100010001, 0b001010100, // Diagonals
];
let endGame=false;
let msg = document.getElementById('message');
canvas.width = canvas.height= 3 * cellSize;

canvas.addEventListener('mouseout', function () {
    mouse.x = mouse.y = -1;
});

canvas.addEventListener('mousemove', function (e) {
    let x = e.pageX - canvas.offsetLeft,
        y = e.pageY - canvas.offsetTop;

    mouse.x = x;
    mouse.y = y;
});

canvas.addEventListener('click', function (e) {
    play(getCellByCoords(mouse.x, mouse.y));
});

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //tha to valei panw deksia, thelei translate logika
    drawBoard();
    xando();

    function drawBoard(){
        ctx.strokeStyle = 'red';
        ctx.lineWidth= 10;

        ctx.beginPath();
        ctx.moveTo(cellSize, 0);
        ctx.lineTo(cellSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cellSize * 2, 0);
        ctx.lineTo(cellSize * 2, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, cellSize);
        ctx.lineTo(canvas.width, cellSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, cellSize * 2);
        ctx.lineTo(canvas.width, cellSize * 2);
        ctx.stroke();}

    function xando(){
        ctx.strokeStyle = 'blue';
        ctx.lineWidth= 8;

        for (let i = 0; i < mapBoard.length; i++) {
            let coords = getCellCoords(i);

            ctx.save();
            ctx.translate(coords.x + cellSize / 2, coords.y + cellSize / 2);
            if (mapBoard[i] == X) {
                drawX();
            } else if (mapBoard[i] == O) {
                drawO();
            }
            ctx.restore();

        }}
        requestAnimationFrame(draw);

        function drawX () {
            ctx.beginPath();
            ctx.moveTo(-cellSize / 3, -cellSize / 3);
            ctx.lineTo(cellSize / 3, cellSize / 3);
            ctx.moveTo(cellSize / 3, -cellSize / 3);
            ctx.lineTo(-cellSize / 3, cellSize / 3);
            ctx.stroke();
        }
    
        function drawO () {
            ctx.beginPath();
            ctx.arc(0, 0, cellSize / 3, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
function getCellCoords (cell) {
    let x = (cell % 3) * cellSize; //Modulus (Division Remainder)
    let y = Math.floor(cell / 3) * cellSize;
    
    return {
        'x': x,
        'y': y,
 };}

 function getCellByCoords (x, y) {
    return (Math.floor(x / cellSize) % 3) + Math.floor(y / cellSize) * 3;
}
draw();

function play (cell) {
    if (endGame) return;

    if (mapBoard[cell] == empty) {
        mapBoard[cell] = humanPlayer;
    }else{
        popUpMsg();
        return;
    }   
        msg.textContent = "";

    let winCheckPlayer = checkWin(humanPlayer);
    
    winConditions(winCheckPlayer,humanPlayer);
    if (endGame == true) return;

    let currentMapBoard=[];
    for (let index = 0; index < mapBoard.length; index++) {
        if (mapBoard[index] == empty) {
            currentMapBoard.push(index);
        }
        
    }
    
    let randomO = currentMapBoard[Math.floor(Math.random() * currentMapBoard.length)];
    
    mapBoard[randomO]=computer;
    let winCheckComputer = checkWin(computer);

    winConditions(winCheckComputer,computer);
    if (endGame == true) return;
         
}

function checkWin (player) {
    let playerMapBitMask = 0;
    for (let i = 0; i < mapBoard.length; i++) {
        playerMapBitMask <<= 1;
        if (mapBoard[i] == player)
            playerMapBitMask += 1;
    }

    for (let i = 0; i < winPatterns.length; i++) {
        if ((playerMapBitMask & winPatterns[i]) == winPatterns[i]) {
            return winPatterns[i];
        }
    }

    return 0;
}

function winConditions(winCheck,currentPlayer) {

    if (winCheck != 0) {
        endGame = true;
        msg.textContent = ((currentPlayer == X)? ' X': ' O') + '  Won';
        console.log(currentPlayer);
        return;
    } else if (mapBoard.indexOf(empty) == -1) {
        endGame = true;
        msg.textContent = 'Tie';
        return;
    }
    
}

function popUpMsg() {
    alert("Try a different Box");
}
//restart game
const restartButton = document.getElementById("restart");
// add event listener to restart button
restartButton.addEventListener("click", () =>{
    //reseting game variables
    mapBoard = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
    ],
    humanPlayer = X,
    endGame = false;
    //reset outcome text
    msg.textContent = "New game X's Turn"  
})

