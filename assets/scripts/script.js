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
const fuelContainer = document.querySelector('.fuel_container');
const fuelStatusElem = document.querySelector('#fuel_status');

let boxElements;
let duckElement;

let boxSize;
let player;
let spaceship;

let playerPosition = [];
let blockPositions = [];
let endGamePosition = [];
let availablePositions = [];
let duckPosition = [];
let isDuckCaptured = false;
let fuelLeft = 85;


let warpSound = new Audio('./assets/sounds/warp.wav');
let outtaFuelSound = new Audio('./assets/sounds/outtafuel.wav');
let collectSound = new Audio('./assets/sounds/collect.wav');
let bgSong = new Audio('./assets/sounds/bg_song.mp3');
let newMsgSound = new Audio('./assets/sounds/newMessage.wav');
let gameReadySound = new Audio('./assets/sounds/gameReady.wav');
let clickSound = new Audio('./assets/sounds/clickeffect.wav');


// var relacionadas à mensagens de transmissão:

const welcomeScreenContainer = document.querySelector('.welcome_screen__container');
const startProcess = document.querySelector('#startProcess');
const welcomeMsg = document.querySelector('#welcome_msg');
const newMsg = document.querySelectorAll('.newMsg');
const showMsgBtn = document.querySelector('#showTransmission');
const receiverContainer = document.querySelector('.receiver__container');
const broadcastMsg = document.querySelector('#broadcastMsg');
const acceptBtn = document.querySelector('#acceptMission');
const skitBtn = document.querySelector('#skip_transmission');
const infoScreen = document.querySelector('.info_screen__container');
const infoMsg = document.querySelector('#info_msg');
const infoMsgBroadcast = document.querySelectorAll('.info_msg_broadcast');
const broadcastBtn = document.querySelectorAll('.broadcast_button');



// Funções principais de preparação, geração do labirinto e movimentação


const setIdealBlockSize = () => {
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
                img.src = "./assets/imgs/spaceship.png";
                
                div.appendChild(img);
                container.appendChild(div);

                player = document.querySelector('.player');
                spaceship = document.querySelector('.spaceship');
                playerPosition = [boxSize * block,  boxSize * row];
                blockPositions.push([boxSize * -1, boxSize * row])
                blockPositions.push([boxSize * block, boxSize * row])

            } else if (content.includes('F')){
    
                div.classList.add('exit', 'default');
                div.style.left = boxSize * block + "px";
                div.style.top = boxSize * row + "px";
                
                container.appendChild(div);

                endGamePosition = [boxSize * block,  boxSize * row];
            } else {
                availablePositions.push([boxSize * block,  boxSize * row]);
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


const randomizeDuckLocation = () => {

    const idealValue = boxSize * (map[0].length - 10);
    const idealPositions = availablePositions.filter(e => e[0] >= idealValue);
    // const randomizedPosition = idealPositions[Math.floor(Math.random() * idealPositions.length)];
    const randomizedPosition = availablePositions[Math.floor(Math.random() * idealPositions.length)];

    
    const duckDiv = document.createElement('div');
    const img = document.createElement('img');

    img.classList.add('space_duck');
    img.src = "./assets/imgs/spaceDuck.png";

    duckDiv.classList.add('space_duck', 'default');
    duckDiv.style.left = randomizedPosition[0]+'px';
    duckDiv.style.top = randomizedPosition[1]+'px';
    duckDiv.style.width = boxSize + 'px';
    duckDiv.style.height = boxSize + 'px';

    duckDiv.appendChild(img);
    container.appendChild(duckDiv);   

    duckPosition = [randomizedPosition[0], randomizedPosition[1]];

    duckElement = document.querySelector('.space_duck');
}

const resetVariables = () => {
    playerPosition = [];
    blockPositions = [];
    endGamePosition = [];
    availablePositions = [];
    duckPosition = [];
    isDuckCaptured = false;
    fuelLeft = 85;
}

const startGame = () => {
    resetVariables();
    setIdealBlockSize();
    createBlocks();
    setBlockSize();
    randomizeDuckLocation();
    setEventListeners();

    container.classList.remove('disappear');
    container.style.display = 'flex';
    fuelContainer.style.opacity = 1;
    fuelStatusElem.value = 85;
}



const movePlayer = (event) => {

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

        
        if(fuelLeft < 1) {
            outtaFuelSound.play();
            player.classList.remove('boosting');
            displayBroadcastMsg(3);
            return;
        }

        

        move[keyPressed]();
        player.classList.add('boosting');
        checkDuckCapture();
        checkVictory();
        updateFuel();
    }
}


const updateFuel = () => {
    fuelLeft-=1;
    fuelStatusElem.value = fuelLeft;
}

const checkDuckCapture = () => {
    if(playerPosition.join('') === duckPosition.join('')){
        isDuckCaptured = true;
        duckElement.classList.add('captured');
        collectSound.play();
        duckPosition = [];
        setTimeout(() => { duckElement.style.display = 'none' }, 1000);
    }
}

const checkVictory = () => {

    if(playerPosition.join('') === endGamePosition.join('')){
        
        warpSound.currentTime = 0.1;
        warpSound.volume = 0.3;
        warpSound.play();

        player.classList.add('disappear');
        fuelContainer.style.opacity = 0;

        setTimeout(() => {
            player.style.display = 'none';
            container.classList.add('disappear');
        }, 500);

        setTimeout(() => {
            container.style.display = 'none';
            if(isDuckCaptured){
                displayBroadcastMsg(1);
            } else {
                displayBroadcastMsg(2);
            }

        }, 1500)
    }
}


const setEventListeners = () => {
    document.addEventListener('keydown', movePlayer);
    document.addEventListener('keyup', () => {
        player.classList.remove('boosting');
    })
}



// Mensagens de transmissão:


const startWelcomeTransmission = () => {
    
    setTimeout(()=>{
        welcomeMsg.style.display = 'none';
    }, 5000);

    setTimeout(()=>{

        newMsg[0].style.display = 'flex';
        newMsg[0].style.opacity = '1';
        newMsgSound.play();

    }, 5200);

    setTimeout(()=>{
        showMsgBtn.style.opacity = '1';
        showMsgBtn.style.pointerEvents = "initial";
    }, 6200);
    
}

const startInitialMsgTransmission = () => {

    receiverContainer.style.display = 'flex';

    let messages = [
        "Recebemos um sinal de socorro vindo de um cinturão de asteróides.",
        " Não temos muitas informações sobre a origem do problema, apenas sabemos que o tripulante da nave era um pato, e que...",
        " Espere, um pato?",
        " Isso não me parece estar correto.",
        " Aguarde um momento enquanto verifico a veracidade dessas informações...",
        " Holy duck!",
        " As informações estão corretas, e o pato se localiza fora da nave e precisa ser resgatado!",
        " Um pato...no espaço...",
        " É, não é todo dia que recebemos um sinal de socorro dessa magnitude.",
        " Você poderia nos ajudar nessa missão?",
    ]

    let messageTimer = 100;
    let letterTimer = 100;
    
    messages.forEach(message=>{
        setTimeout(()=>{
           
            message = message.split('');

            for(let letter = 0; letter < message.length; letter++){
                
                setTimeout(()=>{
                    broadcastMsg.children[0].innerHTML += message[letter];
                },letterTimer);
                
                letterTimer+=30;

            }
            
        }, messageTimer);

        messageTimer+=1000;
    })

    setTimeout(()=>{
        acceptBtn.style.opacity = '1';
        acceptBtn.style.pointerEvents = 'initial';
        acceptBtn.addEventListener('click', ()=>{
            clickSound.play();
            prepareToStartGame();            
        })
    }, 25000)

}

const showInfoMsg = () => {
    clickSound.play();
    infoMsg.style.display = 'none';   
    infoMsgBroadcast[0].style.display = 'flex';

}

const prepareToStartGame = () => {
    welcomeScreenContainer.style.opacity = 0;
    
    gameReadySound.play();

    setTimeout(()=>{
        welcomeScreenContainer.style.display = 'none';
        startGame();
    }, 500);

    setTimeout(()=>{
        newMsg[1].style.display = 'flex';
        newMsg[1].style.opacity = 1;
        infoScreen.style.display = 'flex';
        infoMsg.style.opacity = 1;
        newMsgSound.play();

        infoMsg.addEventListener('click', showInfoMsg);

    }, 1500);


}

const modalControl = (event) => {

    const parentTarg = event.currentTarget.parentElement;
    const action = event.currentTarget.dataset.check;


    parentTarg.style.opacity = 0;
    infoScreen.style.opacity = 1;

    clickSound.play();

    setTimeout(()=>{
        infoMsgBroadcast.forEach(bcElement=>{
            bcElement.style.display = 'none';
            bcElement.style.opacity = 1;
        })
        infoScreen.style.opacity = 0;
        
    }, 500);

    setTimeout(()=>{
        infoScreen.style.display = 'none';
    }, 1000)

    if(action === 'restart'){

        player.style.display = 'none';
        container.classList.add('disappear');
        
        setTimeout(()=>{
            [...container.children].forEach(child => {
                child.remove();
            })
            container.style.display = 'none';
            startGame();
        }, 800);
    }
}

const displayBroadcastMsg = (msgIndex) =>{
    infoScreen.style.display = 'flex';
    infoMsgBroadcast[msgIndex].style.display = 'flex';
    infoScreen.style.opacity = 1;
}

showMsgBtn.addEventListener('click', ()=>{
    
    newMsg[0].style.display = 'none';
    clickSound.play();
    startInitialMsgTransmission();

})

startProcess.addEventListener('click', ()=>{
    startProcess.style.opacity = 0;
    
    bgSong.loop = true;
    clickSound.play();
    bgSong.play();


    setTimeout(()=>{
        startProcess.style.display = 'none';
        welcomeMsg.style.display = 'initial';
    }, 1200);

    setTimeout(()=>{
        startWelcomeTransmission();
    }, 2200);

    
});


broadcastBtn.forEach(element => {
    element.addEventListener('click', modalControl);
})

skitBtn.addEventListener('click', prepareToStartGame);


