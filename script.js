const map = [
    "WWWWWWWWWWWWWWWWWWWWW",
    "W   W     W     W W W",
    "W W W WWW WWWWW W W W",
    "W W W   W     W W   W",
    "W WWWWWWW W WWW W W W",
    "W         W     W W W",
    "W WWW WWWWW WWWWW W W",
    "W W   W   W W     W W",
    "W WWWWW W W W WWW W F",
    "S     W W W W W W WWW",
    "WWWWW W W W W W W W W",
    "W     W W W   W W W W",
    "W WWWWWWW WWWWW W W W",
    "W               W   W",
    "WWWWWWWWWWWWWWWWWWWWW",
];


const container = document.querySelector('.container');
let boxElements;


let boxSize;
let player;
let spaceship;

let playerPosition = [];
let blockPositions = [];
let endGamePosition = [];
let availableSpaces = [];


const setIdealBlockSize = ()=> {
     if(window.innerWidth > window.innerHeight){
        boxSize = Math.floor(window.innerHeight / map[0].length);
     } else {
        boxSize = Math.floor(window.innerWidth / map[0].length);
     }
}




const createBlocks = () => {
    for(let row = 0; row < map.length; row++){
        for(let block = 0; block < map[0].length; block++){
    
            const content = map[row][block];
            const div = document.createElement('div');
            const img = document.createElement('img');
    
            if(content.includes('W')){
                
                div.classList.add('block', 'default');
                div.style.left = boxSize * block + "px";
                div.style.top = boxSize * row + "px";
    
                container.appendChild(div);
    
                blockPositions.push([boxSize * block, boxSize * row])
    
            } else if (content.includes('S')){
    
                div.classList.add('player', 'default');
                div.style.left = boxSize * block + "px";
                div.style.top = boxSize * row + "px";
                img.classList.add('spaceship');
                img.src = "spaceship.png";
                
                div.appendChild(img);
                container.appendChild(div);

                player = document.querySelector('.player');
                spaceship = document.querySelector('.spaceship');
                playerPosition = [boxSize * block,  boxSize * row];

            } else if (content.includes('F')){
    
                div.classList.add('exit', 'default');
                div.style.left = boxSize * block + "px";
                div.style.top = boxSize * row + "px";
                
                container.appendChild(div);

                endGamePosition = [boxSize * block,  boxSize * row];
            } else {
                availableSpaces.push([boxSize * block,  boxSize * row]);
            }
        }
    }
}


const setBlockSize = () => {

    boxElements = document.querySelectorAll('.default');

    boxElements.forEach(element => {
        element.style.width = boxSize +'px';
        element.style.height = boxSize +'px';
    })

    container.style.width = `${boxSize * map[0].length}px`;
    container.style.height = `${boxSize * map.length}px`;
}

const startGame = () =>{
    setIdealBlockSize();
    createBlocks();
    setBlockSize();
}



const movePlayer = (event)=>{

    const keyPressed = event.key;
    
    let nextPlayerMove = [];
    let isPathBlocked;

    if(keyPressed.includes('Arrow')){
        const move = {
            'ArrowLeft': ()=>{
                nextPlayerMove = [playerPosition[0] - boxSize, playerPosition[1]];
                isPathBlocked = blockPositions.find(e => e[0] === nextPlayerMove[0] && e[1] === nextPlayerMove[1]);

                if(!isPathBlocked){
                    player.style.left = playerPosition[0] - boxSize + 'px';
                    playerPosition = nextPlayerMove;
                    player.style.transform = 'rotate(270deg)';
                }
            },
            'ArrowUp': ()=>{
                nextPlayerMove = [playerPosition[0], playerPosition[1] - boxSize];
                isPathBlocked = blockPositions.find(e => e[0] === nextPlayerMove[0] && e[1] === nextPlayerMove[1]);

                if(!isPathBlocked){
                    player.style.top = playerPosition[1] - boxSize + 'px';
                    playerPosition = nextPlayerMove;
                    player.style.transform = 'rotate(0)';
                }
            },
            'ArrowRight': ()=>{
                nextPlayerMove = [playerPosition[0] + boxSize, playerPosition[1]];
                isPathBlocked = blockPositions.find(e => e[0] === nextPlayerMove[0] && e[1] === nextPlayerMove[1]);

                if(!isPathBlocked){
                    player.style.left = playerPosition[0] + boxSize + 'px';
                    playerPosition = nextPlayerMove;
                    player.style.transform = 'rotate(90deg)';

                }
            },
            'ArrowDown': ()=>{
                nextPlayerMove = [playerPosition[0], playerPosition[1] + boxSize];
                isPathBlocked = blockPositions.find(e => e[0] === nextPlayerMove[0] && e[1] === nextPlayerMove[1]);

                if(!isPathBlocked){
                    player.style.top = playerPosition[1] + boxSize + 'px';
                    playerPosition = nextPlayerMove;
                    player.style.transform = 'rotate(180deg)';
                }
                
            }
        }

        move[keyPressed]();
        player.classList.add('boosting');
        checkVictory()
    }
}


const checkVictory = () => {
    console.log(playerPosition, endGamePosition)
    if(playerPosition.join('') === endGamePosition.join('')){
        console.log("Congrats!")
    }
}


document.addEventListener('keydown', movePlayer);
document.addEventListener('keyup', ()=>{
    player.classList.remove('boosting');
})


startGame();