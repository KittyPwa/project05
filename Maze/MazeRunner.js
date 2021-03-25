(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var entities = [];
var mazeMaker;
var i = 0;
var j = 0;
var EventFilter = 0;
var game;
var gameState;
var shop;
var imageBase = new Images();
var keys = [];
var mazeSize = 20;
var gameDifficulty = 5;
var charSpeed = 3;

var currentAnimationReq = null;
var CSize = 600;
var timer = null;

function loadGames() {
    game = loadGame();
}


function newGame() {
    gameState = new GameState();
    game.addGameState(gameState);
    createPlayer();
    shop = new Shop();
    shop.InitializeShop();
    gameState.addShop(shop);
}

function startVars(id) {
    if (id != 'null') {
        gameState = game.getGameState(id)
    }
    shop = gameState.shop
    loadImgs();
    saveGame();
    updateCharacterInfo()
    updateActiveItem()
}

function updateGlobalValues() {
    e = document.getElementById("cSizeSelect");
    windowSize = getWindowSize()
    windowSize[1] -= windowSize[1] % 100 
    windowSize[0] -= windowSize[0] % 100 
    CSize = windowSize[0] > windowSize[1] ? windowSize[1] : windowSize[0];
    CSize -= 20;
    e = document.getElementById("playerSpeedSelect");
	charSpeed = parseInt(e.options[e.selectedIndex].value)
    e = document.getElementById("gameLengthSelect");
	mazeSize = parseInt(e.options[e.selectedIndex].value)
    e = document.getElementById("gameDifficultySelect");
	gameDifficulty = parseInt(e.options[e.selectedIndex].value)
}

function createPlayer() {
    clearText();
    gameState.addGameTimer(new gameTimer(null, 50));
    player = new Player()
    var Char = new Character('blue', charSpeed, player);
    Char.type.addItem(new Item(new Key()))
    for (var i = 0; i < 2; i++) {
        Char.type.addItem(new Item(new HealthPotion()))
    }
    gameState.updateCharacter(Char);
}

function updatePlayerVisuals() {
    var Char = gameState.getCharacter()
    var startRoom = gameState.maze.getStartRoom();
    Char.updateCanvasChar(startRoom.x,startRoom.y)
    updateCharacterInfo();
    updateActiveItem()
    Char.CanvasChar.teleport(Char.CanvasChar.posX, Char.CanvasChar.posY);
    gameState.updateCharacter(Char);
}

function initializeGame() {
	document.getElementById('newGameId').blur()
	updateGlobalValues();
	cancelAnimationFrame(currentAnimationReq);
	mazeMaker = null;	
    myGameArea.start();
    myGameArea.clear();
    mazeMaker = new MazeMaker(mazeSize);
    mazeMaker.MakeMaze();
    gameState.updateMaze(mazeMaker.Maze)
    if (mazeMaker.Notify) {
        var patrollerAmount = Random(1,(mazeSize / gameDifficulty) / 3)
        for (var i = 0; i < mazeSize / gameDifficulty; i++) {
        //for (var i = 0; i < 1; i++) {
            var monsterSpeed = Random(1,charSpeed);
            var type = monsterMovementType.ROAMER;
            if (patrollerAmount > 0) {
                patrollerAmount--;
                type = monsterMovementType.PATROLLER
            }
            player = new Monster(type)
            monster = new Character('red', monsterSpeed, player);
            var randomRoom = gameState.maze.getRandomNonSpecialRoom(mazeMaker)
            gameState.addMonster(monster);
            monster.updateCanvasChar(randomRoom.x,randomRoom.y)
            monster.CanvasChar.teleport(monster.CanvasChar.posX, monster.CanvasChar.posY);
        }
		var rooms = gameState.maze.Rooms;
		for (var i = 0; i < rooms.length; i++) {
			for (var j = 0; j < rooms[i].length; j++) {
				rooms[i][j].initializeSightMap()
			}
        }
    }		
}

function startGame() {   
    updatePlayerVisuals()
    var Char = gameState.getCharacter()
    Char.CanvasChar.drawAttributs(Char.type.activeItem, Char.type.goldAmount)
	addTextToConsole('You\'ve entered the maze')
	if (timer != null) {
		clearTimeout(timer)
    }
    timer = launchTimer(gameState.getGameTimer());
    passiveEntityRooms = gameState.maze.getPassiveEntityRooms();
    for (var i = 0; i < passiveEntityRooms.length; i++) {
        passiveEntityRooms[i].passiveEntity.effect(passiveEntityRooms[i])
    }
    gameState.state = gameStateEnum.CONTINUE;
    gameState.maze.drawMaze()
    setCharacterInfo()
    updateCharacterInfo()
    updateActiveItem()
    gameState.resetBooleansArray()
    requestAnimationFrame(updateGameArea);
}

function keyPress() { 
    var x=0;
    var y=0;
    var Char = gameState.getCharacter()
    //left
    if (keys[37]) {
        x = -1;
        y = 0;
    }
    //up
    if (keys[38]) {
        x = 0;
        y = -1;
    }
    //right
    if (keys[39]) {
        x = 1;
        y = 0;
    }
    //down
    if (keys[40]) {
        x = 0;
        y = 1;
    }
	//E : use item
    if (keys[69]) {
		if (!gameState.timerBooleansArray[timerBooleans.USEACTIVEITEM]) {
			gameState.timerBooleansArray[timerBooleans.USEACTIVEITEM] = true;
			charRoom = gameState.maze.getRoomFromChar(Char.CanvasChar)
			Char.type.useItem(charRoom, gameState.maze);
			Char.CanvasChar.drawCharacter();
			updateActiveItem()
			setTimeout(function() {
                if (gameState.timerBooleansArray[timerBooleans.USEACTIVEITEM]) {
                    gameState.timerBooleansArray[timerBooleans.USEACTIVEITEM] = false;
                }
            }, 500)
		}
    }

    //SPACE : use activatable entity
    if (keys[32]) {
		if (!gameState.timerBooleansArray[timerBooleans.USEACTIVATABLEENTITY]) {
			gameState.timerBooleansArray[timerBooleans.USEACTIVATABLEENTITY] = true;
            charRoom = gameState.maze.getRoomFromChar(Char.CanvasChar)
			Char.type.useActivatableEntity(charRoom, gameState.maze,gameState.getAllMonsters());
			Char.CanvasChar.drawCharacter();
            updateActiveItem()
			setTimeout(function() {
                if (gameState.timerBooleansArray[timerBooleans.USEACTIVATABLEENTITY]) {
                    gameState.timerBooleansArray[timerBooleans.USEACTIVATABLEENTITY] = false;
                }
            }, 500)
		}
    }

    //R : cycle next item
    if (keys[90]) {
        if (!gameState.timerBooleansArray[timerBooleans.CYCLENEXTACTIVEITEM]) {
            gameState.timerBooleansArray[timerBooleans.CYCLENEXTACTIVEITEM] = true;
            Char.type.activateNextItem();
            updateActiveItem()
            setTimeout(function() {
                if (gameState.timerBooleansArray[timerBooleans.CYCLENEXTACTIVEITEM]) {
                    gameState.timerBooleansArray[timerBooleans.CYCLENEXTACTIVEITEM] = false;
                }
            }, 150)
        }
    }

    //Z : cycle previous item
    if (keys[82]) {
        if (!gameState.timerBooleansArray[timerBooleans.CYCLEPREVIOUSACTIVEITEM]) {
            gameState.timerBooleansArray[timerBooleans.CYCLEPREVIOUSACTIVEITEM] = true;
            Char.type.activatePreviousItem();
            updateActiveItem()
            setTimeout(function() {
                if (gameState.timerBooleansArray[timerBooleans.CYCLEPREVIOUSACTIVEITEM]) {
                    gameState.timerBooleansArray[timerBooleans.CYCLEPREVIOUSACTIVEITEM] = false;
                }
            }, 150)
        }
    }
    
    //Shift : Sprint
    if (keys[16] && (x != 0 || y != 0)) {
        gameState.getCharacter().sprint()
    } else {
        gameState.getCharacter().walk()
    }
    //any other key
    
    moveChar(x,y,Char, gameState.maze);
}

function updateGameArea() { 
    updateCharacterInfo()
    var oldlightRooms = gameState.maze.getLightRooms();
    gameState.maze.resetLightRooms()
    this.keyPress();
    checkConflicts();
    var drawRooms = [];
    for (var [key,playerArray] of gameState.entities) {
        if (key != playerTypes.CHARACTER) {
            for (var i = 0; i < playerArray.length; i++) {                
				if (playerArray[i].type.toBeRemoved) {
					playerRoom = gameState.maze.getRoomFromChar(playerArray[i].CanvasChar)
					gameState.removeEntity(playerArray[i],key)
				} else {
                    returnAndToggleSeenRooms(playerArray[i])
                    moveAI(playerArray[i], mazeMaker);
                }   
			}
        } else {
            returnAndToggleSeenRooms(playerArray[0])
        }
    }
    var lightRooms = gameState.maze.getLightRooms();
    toggleOldLightRooms(oldlightRooms, lightRooms, gameState.getCharacter())
    for (var i = 0; i < lightRooms.length; i++) {
        remove(oldlightRooms, lightRooms[i]);
        remove(drawRooms, lightRooms[i])
    }
    lightRooms = lightRooms.concat(oldlightRooms);
    drawRooms = drawRooms.concat(lightRooms);
	var linkedRooms = []
	for(var i = 0; i < drawRooms.length; i++) {
		linkedIJRooms = gameState.maze.getLinkedRoom(drawRooms[i].x, drawRooms[i].y)
		for (var j = 0; j < linkedIJRooms.length; j++) {
			var room = gameState.maze.Rooms[linkedIJRooms[j][0]][linkedIJRooms[j][1]];
			var go = true;
			for (var k = 0; k < linkedRooms.length;k++) {
				go = go && (linkedRooms[k].x != room.x || linkedRooms[k].y != room.y)
			}
			if (go) {
				linkedRooms.push(room)
			}
		} 
	}
	for (var i = 0; i < drawRooms.length; i++) {
		remove(linkedRooms, drawRooms[i]);
	}
	for (var i = 0; i < linkedRooms.length; i++) {
        linkedRooms[i].CanvasRoom.drawRoom(linkedRooms[i].x,linkedRooms[i].y);
    }
    for (var i = 0; i < drawRooms.length; i++) {
        drawRooms[i].CanvasRoom.drawRoom(drawRooms[i].x,drawRooms[i].y);
    }
    for (var [key,playerArray] of gameState.entities) {
        for (var i = 0; i < playerArray.length; i++) {
            playerRoom = gameState.maze.getRoomFromChar(playerArray[i].CanvasChar)
            if (!playerRoom.isRoomInDark()) {
                playerArray[i].CanvasChar.clear();
                playerArray[i].CanvasChar.drawCharacter();
            }
        }
    }
    checkConflicts()
	if (gameState.getCharacter().health.currentValue <= 0) {
		gameState.loseGame()
    }
	switch (gameState.state) {
        case gameStateEnum.CONTINUE :
			currentAnimationReq = requestAnimationFrame(updateGameArea);
            break;
        case gameStateEnum.PAUSE : 
            break;
        default :
            //Manually put all pressed down keys to up
            for (var i = 0; i < keys.length; i++) {
                keys[i] = false;
            }
            addTextToConsole(gameState.state)
            clearTimeout(timer);
            returnFromMaze();
	}
}