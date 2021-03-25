function findPathToEnd(fromi,fromj, maze, result) {
    var endRoom = maze.getEndRoom();
    return findPathToRoom(fromi, fromj, endRoom.x, endRoom.y, maze, result);
}

function findPathToRoom(fromi, fromj, toi, toj, maze, result) {
    var linkedRooms = maze.getLinkedRoom(fromi, fromj);
    var otherRoom = maze.Rooms[toi][toj];
    var nextRoom = [];
    var weight = -1;
    for (var elem = 0; elem < linkedRooms.length; elem++) {
        room = maze.Rooms[linkedRooms[elem][0]][linkedRooms[elem][1]]
        if (weight == -1 || weight > room.weight) {
            weight = room.weight;
            nextRoom[0] = linkedRooms[elem][0];
            nextRoom[1] = linkedRooms[elem][1];
        }
    }
    if (nextRoom[0] == otherRoom.x && nextRoom[1] == otherRoom.y) {
        return []
    }
    result.push(nextRoom);
    findPathToRoom(nextRoom[0],nextRoom[1],otherRoom.x, otherRoom.y, maze, result)
    return result;
}

function findTempPathToRoom(fromi, fromj, toi, toj, maze, result) {
    var linkedRooms = maze.getLinkedRoom(fromi, fromj);
    var otherRoom = maze.Rooms[toi][toj];
    var nextRoom = [];
    var weight = -1;
    var roomweights = '';
    for (var elem = 0; elem < linkedRooms.length; elem++) {
        room = maze.Rooms[linkedRooms[elem][0]][linkedRooms[elem][1]]
        roomweights = roomweights + ' ' + room.tempWeight
        if (weight == -1 || weight > room.tempWeight) {
            weight = room.tempWeight;
            nextRoom[0] = linkedRooms[elem][0];
            nextRoom[1] = linkedRooms[elem][1];
        }
    }
    result.push(nextRoom);
    if (nextRoom[0] != otherRoom.x || nextRoom[1] != otherRoom.y) {
        findTempPathToRoom(nextRoom[0],nextRoom[1],otherRoom.x, otherRoom.y, maze, result)
    }
    return result;
}

function goDownWeightPath(fromi, fromj, maze, result) {
    if (maze.Rooms[fromi][fromj].weight != 0) {
        var linkedRooms = maze.getLinkedRoom(fromi, fromj);
        var nextRoom = [];
        var weight = -1;
        for (var elem = 0; elem < linkedRooms.length; elem++) {
            room = maze.Rooms[linkedRooms[elem][0]][linkedRooms[elem][1]]
            if (weight == -1 || weight > room.weight) {
                weight = room.weight;
                nextRoom[0] = linkedRooms[elem][0];
                nextRoom[1] = linkedRooms[elem][1];
            }
        }
        result.push(nextRoom);
        if (weight != 0) {
            goDownWeightPath(nextRoom[0],nextRoom[1], maze, result)   
        }
    }
    return result;
}

function findPathBetween(fromi,fromj,toi,toj, maze) {
    var firstPath = [[fromi,fromj]];
    var secondPath = [[toi,toj]];
    firstPath = goDownWeightPath(fromi, fromj, maze, firstPath);
    secondPath = goDownWeightPath(toi, toj, maze, secondPath);
    var firstSroom = firstPath[firstPath.length - 1]
    var secondSroom = secondPath[secondPath.length - 1]
    var thirdPath = maze.Rooms[firstSroom[0]][firstSroom[1]].paths.has(maze.Rooms[secondSroom[0]][secondSroom[1]]) ? maze.Rooms[firstSroom[0]][firstSroom[1]].paths.get(maze.Rooms[secondSroom[0]][secondSroom[1]]) : [];
    var juntionfirsti = 0;
    var juntionfirstj = 0;
    var juntionsecondi = 0;
    var juntionsecondj = 0;
    var doContinue = true;
    var path = []
    if (thirdPath.length > 0) {
        for (var i = 0; i < thirdPath.length; i++) {
            for (var j = 0; j < firstPath.length; j++) {
                if (thirdPath[i][0] == firstPath[j][0] && thirdPath[i][1] == firstPath[j][1]) {
                    juntionfirsti = i;
                    juntionfirstj = j;
                    doContinue = false;
                }
            }
            if (!doContinue) {
                break;
            }
        }
        for (var i = 0; i < thirdPath.length; i++) {
            for (var j = 0; j < secondPath.length; j++) {
                if (thirdPath[i][0] == secondPath[j][0] && thirdPath[i][1] == secondPath[j][1]) {
                    juntionsecondi = i;
                    juntionsecondj = j;
                }
            }
        }
        for (var i = 0; i <= juntionfirstj; i++) {
            path.push(firstPath[i]);
        }
        for (var j = juntionfirsti-1; j > juntionsecondi; j--) {
            path.push(thirdPath[j]);
        }
        for (var k = juntionsecondj; k >= 0; k--) {
            path.push(secondPath[k])
        }
    } else {
        for (var i = 0; i < firstPath.length; i++) {
            for (var j = 0; j < secondPath.length; j++) {
                if (firstPath[i][0] == secondPath[j][0] && firstPath[i][1] == secondPath[j][1]) {
                    juntionfirsti = i;
                    juntionfirstj = j;
                    doContinue = false;
                }
            }
            if (!doContinue) {
                break;
            }
        }
        for (var i = 0; i < juntionfirsti; i++) {
            path.push(firstPath[i]);
        }
        for (var k = juntionfirstj; k >= 0; k--) {
            path.push(secondPath[k])
        }
    }
    return path;
}

function moveTo(i,j, char, maze){
    var charRoom = maze.getRoomFromChar(char.CanvasChar);
    nextRoom = charRoom
    if (char.type.path != null) {
        nextRoom = maze.Rooms[char.type.path[0][0]][char.type.path[0][1]]
    }
    if (char.CanvasChar.posX == nextRoom.CanvasRoom.posX && char.CanvasChar.posY == nextRoom.CanvasRoom.posY) {
        if (char.type.path == null) {
            char.type.path = findPathBetween(charRoom.x, charRoom.y, i,j, maze);
        }
        char.type.path.shift();
        if (char.type.path.length <= 0) {
            return true;
        } 
        char.type.orientation = getOrientationFromRooms(charRoom, maze.Rooms[char.type.path[0][0]][char.type.path[0][1]]);
        nextPosition = getMovePosFromOrientation(char, char.type.orientation, maze);
        char.type.destination = [nextPosition[0],nextPosition[1]];
    }
    moveAIChar(char.type.orientation,char, maze)
    return false;
}

function moveAI(entity, mazeMaker) {
    var charRoom = gameState.maze.getRoomFromChar(gameState.getCharacter().CanvasChar)
    var seenRooms = entity.roomsInSight;
    var hunt = false;
    for (var i = 0; i < seenRooms.length; i++) {
        hunt = hunt || (charRoom.x == seenRooms[i].x && charRoom.y == seenRooms[i].y);
    }
    if (entity.type.destinationFinal == null) {
        decideNextRoom(entity,mazeMaker)
    }
    if (hunt) {
        entity.type.destinationFinal = charRoom
        entity.type.path = null
    }
    var arrived = moveTo(entity.type.destinationFinal.x , entity.type.destinationFinal.y, entity, gameState.maze)
    if (arrived) {
		entity.CanvasChar.Stop()
        decideNextRoom(entity,mazeMaker)
        entity.type.path = null
    };
    
}

function decideNextRoom(entity) {
    if (entity.type.movementType == monsterMovementType.ROAMER) {
        entity.type.destinationFinal = gameState.maze.getRandomRoom();
    } else {
        var entityRoom = gameState.maze.getRoomFromChar(entity.CanvasChar)
        var treasureRoom = gameState.maze.getRandomTreasureRoom(gameState.maze)
        if (treasureRoom != null) {
            var nextRoomij = gameState.maze.getLinkedRoom(treasureRoom.x, treasureRoom.y)[0]
            var nextRoom = gameState.maze.Rooms[nextRoomij[0]][nextRoomij[1]]
            if (entityRoom.x == nextRoom.x && entityRoom.y == nextRoom.y) {
                nextRoom = gameState.maze.getRandomRoom();
            }
        }
        nextRoom = gameState.maze.getRandomRoom();
        entity.type.destinationFinal = nextRoom;
    }
}

function Restart(char, maze) {
    var startRoom = maze.getStartRoom();
    char.CanvasChar.clear();
    char.CanvasChar.teleport(startRoom.x, startRoom.y);
}

function conflict(foe, attacker) {
    attacker.strike(foe)
    foe.strike(attacker)
}

function checkConflicts() {
	var maze = gameState.maze
	var monsters = gameState.getAllMonsters()
	var allies = gameState.getAllAllies()
	var player = gameState.getCharacter()
    var monsterRoom;
    var allyRoom;
	var playerRoom = maze.getRoomFromChar(player.CanvasChar)
	for (var i = 0; i < monsters.length; i++) {
		monsterRoom = maze.getRoomFromChar(monsters[i].CanvasChar)
		if (monsterRoom.x == playerRoom.x && monsterRoom.y == playerRoom.y) {
            conflict(monsters[i], player)
		}
		for (var j = 0; j < allies.length; j++) {
			allyRoom = maze.getRoomFromChar(allies[j].CanvasChar)
			if (monsterRoom.x == allyRoom.x && allyRoom.y == playerRoom.y) {
				conflict(monsters[i], allies[j])
			}
		}
	}
}

function victoryOrDefeat(maze, char, monsters) {
    var charRoom = maze.getRoomFromChar(char.CanvasChar);
    var monsterRoom;
	for (var i = 0; i < monsters.length; i++) {
        monsterRoom = maze.getRoomFromChar(monsters[i].CanvasChar)
		if ((charRoom.x == monsterRoom.x) && (charRoom.y == monsterRoom.y)) {
			gameState.state = gameStateEnum.DEFEAT
		}
	}
}

function moveChar(x,y,char, maze) {
    CharRoom = maze.getRoomFromChar(char.CanvasChar);
    if (!CharRoom.isRoomInDark()) {
        char.CanvasChar.clear();
    }
	if (x == 0 && y == 0) {
	} else {
		char.CanvasChar.Accelerate();
		speed = (char.CanvasChar.Speed + char.CanvasChar.Acceleration)
		if (speed > char.CanvasChar.MaxSpeed) {
			speed = char.CanvasChar.MaxSpeed
		}
		var tempX = char.CanvasChar.posX +  speed * x;
		var tempY = char.CanvasChar.posY + speed * y;
		if (tempX < 1) {
			tempX = 1;
		}
		if (tempY < 1) {
			tempY = 1;
		}
		var tempVals = CanMove(char.CanvasChar, maze,char.CanvasChar.posX, char.CanvasChar.posY, tempX,tempY);
		char.CanvasChar.move(tempVals[0],tempVals[1]);

		CharRoom = maze.getRoomFromChar(char.CanvasChar);
		if (CharRoom.hasItem()) {
			char.type.pickUpItem(CharRoom)
			updateCharacterInfo()
        }
        var seenRooms = char.roomsInSight;
        for (var i = 0; i < seenRooms.length; i++) {
            if (seenRooms[i].hasActivatableEntity()) {
                var activatableEntity = seenRooms[i].returnActivatableEntity();
                if (!activatableEntity.discovered) {
                    activatableEntity.discoverEntity();
                }
				room.discovered = true;
            }
        }

		
        if (CharRoom.hasTrap()) {
            if (CharRoom.trap.hostilityType == hostilityEnum.ENEMY) {
                CharRoom.trap.effect(char);
            }
		}
    }
}

function returnAndToggleSeenRooms(character) {
    var room = gameState.maze.getRoomFromChar(character.CanvasChar);
    room.setRoomInSight(character, true)
    if (character.type.playerType == playerTypes.CHARACTER) {
        gameState.maze.addLightRoom(room)
        room.discovered = true;
    }
    var unlinkedRooms = gameState.maze.getLinkedRoom(room.x, room.y);
    var radii = [];
    var orientations = [];
    for (var i = 0; i < unlinkedRooms.length; i++) {
        radii.push(character.type.sightRadius);
        orientations.push(getOrientationFromRooms(room,gameState.maze.Rooms[unlinkedRooms[i][0]][unlinkedRooms[i][1]]))
    }
    var allUnlinkedRooms = [room]
    var seenRooms = [room]
    for (var i = 0; i < orientations.length; i++) {
        var tempRoom = room
        var ij;
        var go = true;
        do {
            unlinkedRooms = gameState.maze.getLinkedRoom(tempRoom.x, tempRoom.y);
            allUnlinkedRooms.push(unlinkedRooms);
            ij = getIJFromRoom(tempRoom.x,tempRoom.y, orientations[i],gameState.maze.n);
            stop = true;
            for (var j = 0; j < unlinkedRooms.length; j++) {
                if (unlinkedRooms[j][0] == ij[0] && unlinkedRooms[j][1] == ij[1]){
                    tempRoom = gameState.maze.Rooms[unlinkedRooms[j][0]][unlinkedRooms[j][1]];
                    seenRooms.push(tempRoom)
                    tempRoom.setRoomInSight(character, true)
                    if (character.type.playerType == playerTypes.CHARACTER) {
                        gameState.maze.addLightRoom(tempRoom)
                        tempRoom.discovered = true;
                    }
                    radii[i]--
                    stop = false;
                }
            }
            go = go && !stop
        } while(radii[i] > 0 && go)
    }
    character.clearRoomsInSight();
    character.addRoomsInSight(seenRooms) 
    for (var i = 0; i < seenRooms; i++) {
        remove(allUnlinkedRooms, seenRooms[i]);
    }
    for (var i = 0; i < allUnlinkedRooms; i++) {
        gameState.maze.removeLightRoom(tempRoom)
        allUnlinkedRooms[i].setRoomInSight(character, false)
    }
    return seenRooms;
}

function moveAIChar(orientation, char, maze) {
    var go = true;
    for (var i  = 0; i < char.states; i++) {
        switch (char.states[i]) {
            case characterStates.PARALYZED :
                go = false;
                break;
            default :
                break;
        }
    }
    if (!go) {
        char.CanvasChar.Stop();
    } else {
        CharRoom = maze.getRoomFromChar(char.CanvasChar);
        if (!CharRoom.isRoomInDark()) {
            char.CanvasChar.clear();
        }
        char.CanvasChar.Accelerate();
        
        switch(orientation) {
            //North
            case 0 :
                x = 0;
                y = -1;
                break;
            //East    
            case 1 :
                x = 1;
                y = 0;
                break;
            //South
            case 2 :
                x = 0;
                y = 1;
                break;
            //West
            case 3 :
                x = -1;
                y = 0;    
                break;
            default :
                x = 0;
                y = 0;
                break;
        }
        speed = (char.CanvasChar.Speed + char.CanvasChar.Acceleration)
        if (speed > char.CanvasChar.MaxSpeed) {
            speed = char.CanvasChar.MaxSpeed
        }
        var tempX = char.CanvasChar.posX + speed * x;
        var tempY = char.CanvasChar.posY + speed * y;
        if (tempX < 1) {
            tempX = 1;
        }
        if (tempY < 1) {
            tempY = 1;
        }
        var tempVals = [];
        tempVals.push(tempX, tempY);

        var destinationRoom = maze.getRoomFromPosXY(char.type.destination[0], char.type.destination[1]);
        if (tempVals[0] != char.type.destination[0] || tempVals[1] != char.type.destination[1]) {
            switch(orientation) {
                //North
                case 0 :
                    if (tempVals[1] < destinationRoom.CanvasRoom.posY) {
                        tempVals[1] = destinationRoom.CanvasRoom.posY
                    }
                    break;
                //East    
                case 1 :
                    if (tempVals[0] > destinationRoom.CanvasRoom.posX) {
                        tempVals[0] = destinationRoom.CanvasRoom.posX
                    }
                    break;
                //South
                case 2 :
                    if (tempVals[1] > destinationRoom.CanvasRoom.posY) {
                        tempVals[1] = destinationRoom.CanvasRoom.posY
                    }
                    break;
                //West    
                case 3 :
                    if (tempVals[0] < destinationRoom.CanvasRoom.posX) {
                        tempVals[0] = destinationRoom.CanvasRoom.posX
                    }
                    break;
                default : 
                    tempVals[0] = destinationRoom.CanvasRoom.posX
                    tempVals[1] = destinationRoom.CanvasRoom.posY
                    break;
            }            
        }
        var room = gameState.maze.getRoomFromChar(char.CanvasChar)
        char.CanvasChar.move(tempVals[0],tempVals[1]);
    }    
}

function previousActiveItem() {
    var Char = gameState.getCharacter().type;
    Char.activatePreviousItem()
    updateActiveItem()
}

function resetLocalStorage() {
    if (confirm("Are you certain you want to continue? All saved data will be lost.")) {
        localStorage.clear();
    }
}

function nextActiveItem() {
    var Char = gameState.getCharacter().type;
    Char.activateNextItem()
    updateActiveItem()
}

function useItem(node) {
    $(node).tooltip('hide')
    $(node).tooltip('show')
    var item = gameState.getCharacter().type.activeItem;
    var maze = gameState.getMaze();
    var room = maze != null ? maze.getRoomFromChar(gameState.getCharacter().CanvasChar) : null
    gameState.getCharacter().type.useItem(maze, room, item)
    updateActiveItem()
    if (maze == null) {
        console.log('save')
        saveGame()
    }
}

function checkReturnToTown() {
    gameState.pauseGame();
    if (confirm("Are you certain you want to return to town? All current progress will be lost.")) {
        gameState.loseGame();
        returnFromMaze();
    } else {
        gameState.continueGame()
    }
    blurElement('showShopGameScreen');
}

function returnFromMaze() {
    clearText()
    gameState.maze.deactivatePassiveEntities()
    initializeGame()
    if (gameState.state != gameStateEnum.VICTORY) {
        createPlayer()  
    }
    gameState.clearAllButCharacter();
    gameState.getCharacter().rest()
    gameState.getCharacter().clearTemporaryModifiers()
    if (gameState.state == gameStateEnum.VICTORY) {
        var entries = gameState.getCharacter().attributs.entries();
        var entry = entries.next()
        while(!entry.done) {
            gameState.getCharacter().updateModifiedAttribut(entry.value[1])
            entry = entries.next()
        }
    }
    updateCharacterInfo()
    saveGame()
    toggleHiddenAndVillage();
}