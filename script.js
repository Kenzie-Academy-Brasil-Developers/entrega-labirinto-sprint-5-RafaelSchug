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
    "W       W       W   W",
    "WWWWWWWWWWWWWWWWWWWWW",
];


const container = document.querySelector('.container');
let boxElements;


let boxSize;
let player;

let playerPosition = [];
let blockPositions = [];


const setIdealBlockSize = ()=> {
     if(window.innerWidth > window.innerHeight){
        boxSize = Math.floor(window.innerHeight / map[0].length);
     } else {
        boxSize = Math.floor(window.innerWidth / map[0].length);
     }
}

setIdealBlockSize();


const createBlocks = () => {
    for(let row = 0; row < map.length; row++){
        for(let block = 0; block < map[0].length; block++){
    
            const content = map[row][block];
            const div = document.createElement('div');
    
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
                
                container.appendChild(div);

                player = document.querySelector('.player');
                playerPosition = [boxSize * block,  boxSize * row];

            } else if (content.includes('F')){
    
                div.classList.add('exit', 'default');
                div.style.left = boxSize * block + "px";
                div.style.top = boxSize * row + "px";
                
                container.appendChild(div);
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
                nextPlayerMove = [player.offsetLeft - boxSize, playerPosition[1]];
                isPathBlocked = blockPositions.find(e => e[0] === nextPlayerMove[0] && e[1] === nextPlayerMove[1]);

                if(!isPathBlocked){
                    player.style.left = player.offsetLeft - boxSize + 'px';
                    playerPosition = nextPlayerMove;
                }
            },
            'ArrowUp': ()=>{
                nextPlayerMove = [playerPosition[0], player.offsetTop - boxSize];
                isPathBlocked = blockPositions.find(e => e[0] === nextPlayerMove[0] && e[1] === nextPlayerMove[1]);

                if(!isPathBlocked){
                    player.style.top = player.offsetTop - boxSize + 'px';
                    playerPosition = nextPlayerMove;
                }
            },
            'ArrowRight': ()=>{
                nextPlayerMove = [player.offsetLeft + boxSize, playerPosition[1]];
                isPathBlocked = blockPositions.find(e => e[0] === nextPlayerMove[0] && e[1] === nextPlayerMove[1]);

                if(!isPathBlocked){
                    player.style.left = player.offsetLeft + boxSize + 'px';
                    playerPosition = nextPlayerMove;
                }
            },
            'ArrowDown': ()=>{
                nextPlayerMove = [playerPosition[0], player.offsetTop + boxSize];
                isPathBlocked = blockPositions.find(e => e[0] === nextPlayerMove[0] && e[1] === nextPlayerMove[1]);

                if(!isPathBlocked){
                    player.style.top = player.offsetTop + boxSize + 'px';
                    playerPosition = nextPlayerMove;
                }
                
            }
        }

        move[keyPressed]();
    }
}

document.addEventListener('keydown', movePlayer);


startGame();
