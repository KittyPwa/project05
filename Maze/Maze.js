function Maze(n) {
  this.id = this.id = uuidv4();

  this.n = n;
  
  this.Rooms = [];

  this.treasureRooms = [];

  this.trapRooms = [];

  this.passiveEntityRooms = [];

  this.activatableEntityRooms = [];

  this.lightRooms = []

  this.CanvasMaze = new CanvasMaze(this);
  //Maze initialization
  for (var i = 0; i < n; i++) {
    this.Rooms[i] = [];
    for (var j = 0; j < n; j++) {
      this.Rooms[i][j] = new Room(i,j,this.n);
    }
  }
  //Breaks walls between two given rooms with specified orientation
  this.BreakWalls = function(fromI,fromJ,toI,toJ, orientation) {
    if (isInMaze(this.n, fromI, fromJ) && isInMaze(this.n, toI, toJ)) {
      this.Rooms[fromI][fromJ].BreakWall(orientation);
      this.Rooms[toI][toJ].BreakWall(OppositeOrientation(orientation));
      return true;
    }
    return false;
  }

  //Builds walls between two given rooms with specified orientation
  this.BuildWalls = function(fromI,fromJ, toI, toJ, orientation) {
    if (isInMaze(this.n, fromI, fromJ) && isInMaze(this.n, toI, toJ)) {
      this.Rooms[fromI][fromJ].BuildWall(orientation);
      this.Rooms[toI][toJ].BuildWall(OppositeOrientation(orientation));
      return true;
    }
    return false;
  }
  
  this.BuildDoors = function(fromI,fromJ, toI, toJ, orientation) {
	if (isInMaze(this.n, fromI, fromJ) && isInMaze(this.n, toI, toJ)) {
      this.Rooms[fromI][fromJ].addDoor(orientation);
      this.Rooms[toI][toJ].addDoor(OppositeOrientation(orientation));
      return true;
    }
    return false;  
  }
  
  this.openDoors = function(fromI,fromJ, toI, toJ, orientation) {
	  this.BreakWalls(fromI, fromJ, toI, toJ, orientation);
	  this.Rooms[fromI][fromJ].openDoors(orientation);
	  this.Rooms[toI][toJ].openDoors(OppositeOrientation(orientation));
  }

  //Draws the maze
  this.drawMaze = function(c) {
  	this.CanvasMaze.drawMaze();
  }

  this.getRoomFromChar = function(canvasChar) {
    //If bug here : probably because it asks for canvasChar
    var RoomSize = this.Rooms[0][0].CanvasRoom.roomSize;
    var x = Math.floor(canvasChar.posX/RoomSize);
    var y = Math.floor(canvasChar.posY/RoomSize);
    return this.Rooms[x][y];
  }

  this.getRoomFromPosXY = function(x,y) {
    var RoomSize = this.Rooms[0][0].CanvasRoom.roomSize;
    var i = Math.floor(x/RoomSize);
    var j = Math.floor(y/RoomSize);
    return this.Rooms[i][j];
  }

  this.getStartRoom = function() {
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        if (this.Rooms[i][j].isStart()){
          return this.Rooms[i][j];
        }
      }
    }
  }

  this.getEndRoom = function() {
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        if (this.Rooms[i][j].isEnd()){
          return this.Rooms[i][j];
        }
      }
    }
  }

  this.getRandomRoom = function() {
    var i = Random(0, this.n - 1);
    var j = Random(0, this.n - 1);
    return this.Rooms[i][j];
  }

  this.getRandomNonSpecialRoom = function(mazeMaker) {
    var randomRoom;
    var array;
    do {
      randomRoom = this.getRandomRoom();
      array = [];
      array.push(randomRoom.x,randomRoom.y)
    } while (includesArray(mazeMaker.SRooms,array));
    return randomRoom;
  }

  this.getTreasureRooms = function() {
    return this.treasureRooms;
  }

  this.addTreasureRoom = function(treasureRoom) {
    this.treasureRooms.push(treasureRoom)
  }

  this.removeTreasureRoom = function(treasureRoom) {
    remove(this.treasureRooms, treasureRoom);
  }

  this.getActivitableEntityRooms = function() {
    return this.activatableEntityRooms;
  }

  this.addActivatableEntityRoom = function(activatableEntity) {
    this.activatableEntityRooms.push(activatableEntity)
  }

  this.removeActivatableEntityRoom = function(activatableEntity) {
    remove(this.activatableEntityRooms, activatableEntity);
  }

  this.addTrapRoom = function(trapRoom) {
    this.trapRooms.push(trapRoom)
  }

  this.removeTrapRoom = function(trapRoom) {
    remove(this.trapRoom, trapRoom)
  }

  this.getTrapRooms = function() {
    return this.trapRooms;
  }

  this.addPassiveEntityRoom = function(passiveEntityRoom) {
    this.passiveEntityRooms.push(passiveEntityRoom)
  }

  this.removePassiveEntityRoom = function(passiveEntityRoom) {
    remove(this.passiveEntityRooms, passiveEntityRoom)
  }

  this.getPassiveEntityRooms = function() {
    return this.passiveEntityRooms;
  }

  this.deactivatePassiveEntities = function() {
    for (var i = 0; i < this.passiveEntityRooms.length; i++) {
      this.passiveEntityRooms[i].returnPassiveEntity().deactivateEntity()
    }
  }

  this.addLightRoom = function(room) {
    this.lightRooms.push(room)
  }

  this.removeLightRoom = function(room) {
    remove(this.lightRooms, room)
  }

  this.resetLightRooms = function() {
    this.lightRooms = []
  }

  this.getLightRooms = function() {
    return this.lightRooms
  }

  this.getRandomTreasureRoom = function(maze) {
    var treasureRooms = maze.getTreasureRooms();
    var index = Random(0,treasureRooms.length - 1);
    return treasureRooms.length > 0 ? treasureRooms[index] : null;
  }

  this.getRandomSpecialRoom = function(mazeMaker) {
    var randomRoom;
    var array;
    do {
      randomRoom = this.getRandomRoom();
      array = [];
      array.push(randomRoom.x,randomRoom.y)
    } while (!includesArray(mazeMaker.SRooms,array));
    return randomRoom;
  }

  this.getLinkedRoom = function(i,j) {
    var linkedRooms = [];
    var room = this.Rooms[i][j];

    for (var count = 0; count < room.Walls.length; count++) {
      if (!room.Walls[count]) {
        ij = getIJFromRoom(i,j,count, (this.n - 1));
        if (ij[0] != -1 && ij[1] != -1) {
          linkedRooms.push(ij);
        }
      }
    }

    return linkedRooms;
  }

  this.getUnlinkedRoom = function(i,j) {
    var linkedRooms = [];
    var room = this.Rooms[i][j];
    //console.log(i,j, this.Rooms, room)

    for (var count = 0; count < room.Walls.length; count++) {
      if (room.Walls[count]) {
        ij = getIJFromRoom(i,j,count, (this.n - 1));
        if (ij[0] != -1 && ij[1] != -1) {
          linkedRooms.push(ij);
        }
      }
    }
    return linkedRooms;
  }

  this.getHighestWeightRoomIJ = function() {
    var weight = 0;
    var ij = [];
    ij.push(0,0);
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        if (this.Rooms[i][j].weight > weight) {
          ij[0] = i;
          ij[1] = j;
          weight = this.Rooms[i][j].weight;
        }
      }
    }
    return ij;
  }

  this.clearTempWeights = function() {
    for (var i = 0; i < this.Rooms.length; i++) {
      for (var j = 0; j < this.Rooms[i].length; j++) {
        this.Rooms[i][j].tempWeight = -1;
      } 
    }
  }
  
  this.drawCrossRooms = function(x,y) {
		this.Rooms[x][y].CanvasRoom.drawRoom(x,y);
		if (x-1 > 0) {
			this.Rooms[x-1][y].CanvasRoom.drawRoom(x-1,y);
		}
		if (y-1 > 0) {
			this.Rooms[x][y-1].CanvasRoom.drawRoom(x,y-1);
		}
		if (x+1 < this.n) {
			this.Rooms[x+1][y].CanvasRoom.drawRoom(x+1,y);
		}
		if (y+1 < this.n) {
			this.Rooms[x][y+1].CanvasRoom.drawRoom(x,y+1);
		}
  }

  this.drawSquareRooms = function(x,y) {
    for (var i = (x - 1 >= 0 ?  x - 1 : x); i <= (x + 1 < this.n ? x + 1 : x); i++ ) {
      for (var j = (y - 1 >= 0 ? y - 1: y); j <= (y + 1 < this.n ? y + 1 : y); j++) {
        this.Rooms[i][j].CanvasRoom.drawRoom(i,j);
      } 
    }

  }
  
  this.addEnd = function(i,j) {
		this.Rooms[i][j].addEnd();
  }
}
typeMap.set('Maze', Maze)