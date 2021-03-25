function MazeMaker (n) {

  this.Maze = new Maze(n);

  this.Rooms = this.Maze.Rooms;
  this.tempPath = [];

  this.n = n;

  this.ISteps;

  this.Notify = false;

  this.cycleAmount = this.n / 4
  
  this.doorAmount = this.n / 4

  this.itemAmount = this.n / 3

  this.treasureAmount = this.n / 7

  this.activatableEntityAmount = this.n / 5

  this.passiveEntityAmount = this.n / 15

  //this.trapAmount = this.n / 1
  this.trapAmount = this.n / 10

  //Special Rooms
  this.SRooms = [];

  this.addSRoom = function(elem) {
    this.SRooms.push(elem);
  }

 this.SetPath = function(path) {
    for (var i = 0; i < path.length; i++) {
      this.Rooms[path[i][0]][path[i][1]].addInPath();
    }
  }

  this.getNeighbourRooms = function() {
    var result = [];
    var nextRoom;
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.n; j++) {
        if(this.Rooms[i][j].isInPath()){
          for (var k = 0; k < this.Rooms[i][j].Walls.length; k++) {
            if (this.Rooms[i][j].Walls[k]) {
              nextRoom = getIJFromRoom(i,j,k, (this.n - 1));
              if (!nextRoom.includes(-1)) {
                if (!this.Rooms[nextRoom[0]][nextRoom[1]].isInPath() 
                  && !includesArray(nextRoom,result)
                  && !this.Rooms[i][j].isEnd()) {
                  result.splice((result.length - 1), 0, [i,j]);
                }
              }
            }
          }
        }
      }
    }
    return result;
  }

  this.getLooseRooms = function() {
    return this.getSpecRooms(false);
  }

  this.getSpecRooms = function(val) {
    var result = [];
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.n; j++) {
        if (val) {
          if(this.Rooms[i][j].isInPath()){
          result.push([i,j]);
          }
        } else {
          if(!this.Rooms[i][j].isInPath()){
          result.push([i,j]);
          }
        }
      }
    }
    return result;
  }

  this.getPathRooms = function() {
    return this.getSpecRooms(true);
  }

  this.makePaths = function(i,j) {
	this.Maze.addEnd(i,j);
    this.makeFirstRoomOfPath(i,j);
    this.tempPath = [];
    this.MakeSidePath();
  }

  this.MakeMaze = function() {
	  endRoom = this.Maze.getRandomRoom()  
    this.makePaths(endRoom.x,endRoom.y);
    this.setWeights(endRoom.x,endRoom.y,-1);
    this.makeCycles();
    this.setWeights(endRoom.x,endRoom.y,-1);
    this.setStart();
    this.setEndWeights(endRoom.x,endRoom.y,-1)
    for (var i = 0; i < this.SRooms.length; i++) {
      var room = this.Rooms[this.SRooms[i][0]][this.SRooms[i][1]]
      this.findPathsToSRooms(room)
    }
    for (var i = 0; i < this.SRooms.length; i++) {
      this.setWeights(this.SRooms[i][0],this.SRooms[i][1],-1);
    }
    this.makeDoors();
    this.placeActivatableEntities();
    this.placePassiveEntities();
    this.placeTreasures();
    this.placeItems();
    this.placeTraps();
    this.Notify = true;
  }

  this.findPathsToSRooms = function(room) {
    this.Maze.clearTempWeights();
    this.setTempWeights(room.x,room.y, -1);
    for (var i = 0; i < this.SRooms.length; i++) {
      if (room.x != this.SRooms[i][0] || room.y != this.SRooms[i][1]) {
        var sRoom = this.Rooms[this.SRooms[i][0]][this.SRooms[i][1]]
        if (sRoom.paths.has(room)) {
          room.addPath(getReverseArray(sRoom.paths.get(room)), sRoom);
        } else {
          var path = [[sRoom.x, sRoom.y]];
          findTempPathToRoom(sRoom.x, sRoom.y,room.x, room.y, this.Maze, path)
          room.addPath(path, sRoom)
        }
      }
    }
  }

  this.makeCycles = function() {
    var go;
    var i,j
    var randomRoom;
    var unlinkedRooms = [];
    var highestij = this.Maze.getHighestWeightRoomIJ()
    var highestWeight = this.Maze.Rooms[highestij[0]][highestij[1]].weight
    var rand = Random(0,unlinkedRooms.length-1);
    var allRooms = [];
    for (var i = 0; i < this.Maze.Rooms.length; i++) {
      for (var j = 0; j < this.Maze.Rooms[i].length; j++) {
        allRooms.push(this.Maze.Rooms[i][j])
      }
    }
    for (var i = 0; i < this.Srooms; i++) {
      remove(allRooms, this.Maze[this.Srooms[i].x][this.Srooms[i].y])
    }
    for (var count = 0; count < this.cycleAmount; count++) {
      go = false;
      roomsToCheck = allRooms.concat();
      do {
        randi = Random(0, roomsToCheck.length - 1)
        randomRoom = roomsToCheck[randi]
        i = randomRoom.x;
        j = randomRoom.y;
        unlinkedRooms = this.Maze.getUnlinkedRoom(i,j);
        unlinkedRooms.push([randomRoom.x,randomRoom.y]);
        go = unlinkedRooms.length > 2 && !includesArray(this.SRooms, [unlinkedRooms.x, unlinkedRooms.y]);
        for (var k = 0; k < randomRoom.Attributes.length; k++) {
          if (k != 2) {
            go = go && !randomRoom.Attributes[k]
          }
        }
        unlinkedRooms.pop();
        if (go) {
          fromRoom = this.Rooms[i][j];
          toRoom = this.Rooms[unlinkedRooms[rand][0]][unlinkedRooms[rand][1]]
          //go = go && (!fromRoom.Attributes[3] || fromRoom.Attributes[3] == null) && (!toRoom.Attributes[3] || toRoom.Attributes[3] == null)
          go = go && (!includesArray(this.SRooms,[fromRoom.x, fromRoom.y])) && (!includesArray(this.SRooms,[toRoom.x, toRoom.y]))
        }
        if (go) {
          fromWeight = this.Rooms[i][j].weight
          toWeight = this.Rooms[unlinkedRooms[rand][0]][unlinkedRooms[rand][1]].weight
          go = go && ((fromWeight - toWeight > (highestWeight / 3)) || (toWeight - fromWeight> (highestWeight / 3)))
        }
        remove(roomsToCheck, randomRoom)
      } while (go == false && roomsToCheck.length > 0)
      if (roomsToCheck.length > 0) {
        /*console.log(!includesArray(this.SRooms,[fromRoom.x, fromRoom.y]));
        console.log(!includesArray(this.SRooms,[toRoom.x, toRoom.y]));*/
        if (includesArray(this.SRooms,[unlinkedRooms[rand][0].x,unlinkedRooms[rand][0].y])) {
          remove(this.SRooms, unlinkedRooms[rand][0])
        }
        if (includesArray(this.SRooms,[unlinkedRooms[rand][1].x, unlinkedRooms[rand][1].y])) {
          remove(this.SRooms, unlinkedRooms[rand][1])
        }
        this.Maze.BreakWalls(i, j, unlinkedRooms[rand][0], unlinkedRooms[rand][1], getOrientationFromRooms(this.Rooms[i][j], this.Rooms[unlinkedRooms[rand][0]][unlinkedRooms[rand][1]]));
        var openedRoom = this.Maze.Rooms[i][j]
        this.setWeights(openedRoom.x,openedRoom.y,openedRoom.weight);
      }
    }
  }
  
  this.makeDoors = function() {
    var go;
    var unlinkedRooms = [];
    var highestWeight = this.Maze.getStartRoom().endWeight
    var endRoom = this.Maze.getEndRoom();
    this.Maze.clearTempWeights();
    this.setTempWeights(endRoom.x,endRoom.y, -1);
    var rand
    var previousDoors = [];
    var allRooms = []
    for (var i = 0; i < this.Maze.Rooms.length; i++) {
      for (var j = 0; j < this.Maze.Rooms[i].length; j++) {
        allRooms.push(this.Maze.Rooms[i][j])
      }
    }
    for (var i = 0; i < this.Srooms; i++) {
      remove(allRooms, this.Maze[this.Srooms[i].x][this.Srooms[i].y])
    }
    for (var count = 0; count < this.doorAmount; count++) {
      go = false;
      roomsToCheck = allRooms.concat();
      do {
        randi = Random(0, roomsToCheck.length - 1)
        randomRoom = roomsToCheck[randi]
        i = randomRoom.x;
        j = randomRoom.y;
        fromRoom = this.Maze.getRandomNonSpecialRoom(this);
        unlinkedRooms = this.Maze.getUnlinkedRoom(fromRoom.x,fromRoom.y);
        unlinkedRooms.push([fromRoom.x,fromRoom.y]);
        go = unlinkedRooms.length > 2 && !includesArray(this.SRooms, [unlinkedRooms.x, unlinkedRooms.y]);
        for (var k = 0; k < fromRoom.Attributes.length; k++) {
          if (k != 2) {
            go = go && !fromRoom.Attributes[k]
          }
        }
        unlinkedRooms.pop();
        var toRoom = null;
        if (go) {
          rand = Random(0,unlinkedRooms.length-1);
          toRoom = this.Rooms[unlinkedRooms[rand][0]][unlinkedRooms[rand][1]]
          //go = go && (!fromRoom.Attributes[3] || fromRoom.Attributes[3] == null) && (!toRoom.Attributes[3] || toRoom.Attributes[3] == null)
          go = go && (!includesArray(this.SRooms,[fromRoom.x, fromRoom.y])) && (!includesArray(this.SRooms,[toRoom.x, toRoom.y]))
        }
        if (go) {
          pathLength = findPathBetween(fromRoom.x, fromRoom.y, toRoom.x, toRoom.y, this.Maze).length
          go = go && (pathLength > (highestWeight / 2))
        }
        if (go) {
          for (var globalGoThru = 0; globalGoThru < previousDoors.length; globalGoThru++) {
            strike = 0;
            for (var roomGoThru = 0; roomGoThru < previousDoors[globalGoThru].length; roomGoThru++) {
              fromPathLength = findPathBetween(fromRoom.x, fromRoom.y, previousDoors[globalGoThru][roomGoThru].x, previousDoors[globalGoThru][roomGoThru].y, this.Maze).length 
              toPathLength = findPathBetween(toRoom.x, toRoom.y, previousDoors[globalGoThru][roomGoThru].x, previousDoors[globalGoThru][roomGoThru].y, this.Maze).length 
              strike = strike + (fromPathLength > (highestWeight /2) ? 0 : 1);
              strike = strike + (toPathLength > (highestWeight /2) ? 0 : 1);
            }
            go = go && strike < 2;
          }
        }
        remove(roomsToCheck, randomRoom)
      } while (!go && roomsToCheck.length > 0)
      //console.log(roomsToCheck.length)
      if (roomsToCheck.length > 0) {
        /*console.log(!includesArray(this.SRooms,[fromRoom.x, fromRoom.y]));
        console.log(!includesArray(this.SRooms,[toRoom.x, toRoom.y]));*/
        var orientation = getOrientationFromRooms(fromRoom, this.Rooms[unlinkedRooms[rand][0]][unlinkedRooms[rand][1]]);
        this.Maze.BuildDoors(fromRoom.x,fromRoom.y, unlinkedRooms[rand][0], unlinkedRooms[rand][1],orientation)
        var nextWeight = fromRoom.weight > toRoom.weight ? toRoom.weight + 1 : fromRoom.weight - 1;
        this.setTempWeights(toRoom.x,toRoom.y, nextWeight);
        previousDoors.push([fromRoom, toRoom])
      }
    }
  }

  this.placeItems = function() {
    var randomRoom;
    for (var count = 0; count < this.itemAmount; count++) {
      do {
    go = true;
        randomij = this.SRooms[Random(0, this.SRooms.length - 1)]
        randomRoom = this.Maze.Rooms[randomij[0]][randomij[1]]
        for (var i = 0; i < randomRoom.Attributes.length; i++) {
          if (i != 2) {
            go = go && !randomRoom.Attributes[i]
          }
        }
      } while (!go)
      //console.log(includesArray(this.SRooms,[randomRoom.x, randomRoom.y]));
      item = getItemOrConsumableFromRarifiedArray()
      randomRoom.placeItem(item);
    }
  }

  this.placeTreasures = function() {
    var randomRoom;
    for (var count = 0; count < this.treasureAmount; count++) {
      do {
		go = true;
        randomij = this.SRooms[Random(0, this.SRooms.length - 1)]
        randomRoom = this.Maze.Rooms[randomij[0]][randomij[1]]
        for (var i = 0; i < randomRoom.Attributes.length; i++) {
          if (i != 2) {
            go = go && !randomRoom.Attributes[i]
          }
        }
      } while (!go)
      //console.log(includesArray(this.SRooms,[randomRoom.x, randomRoom.y]));
      var treasure = new ActivatableEntity(new TreasureChest());
      randomRoom.addTreasure(treasure);
      this.Maze.addTreasureRoom(randomRoom);
    }
  }

  this.placeActivatableEntities = function() {
    var randomRoom;
    for (var count = 0; count < this.activatableEntityAmount; count++) {
      do {
		go = true;
        randomij = this.SRooms[Random(0, this.SRooms.length - 1)]
        randomRoom = this.Maze.Rooms[randomij[0]][randomij[1]]
        for (var i = 0; i < randomRoom.Attributes.length; i++) {
          if (i != 2) {
            go = go && !randomRoom.Attributes[i]
          }
        }
      } while (!go)
      //console.log(includesArray(this.SRooms,[randomRoom.x, randomRoom.y]));
      var entity = getActivatableEntityFromRarifiedArray();
      randomRoom.addActivatableEntity(entity);
      this.Maze.addActivatableEntityRoom(randomRoom);
    }
  }

  this.placePassiveEntities = function() {
    var randomRoom;
    for (var count = 0; count < this.passiveEntityAmount; count++) {
      do {
		go = true;
        randomij = this.SRooms[Random(0, this.SRooms.length - 1)]
        randomRoom = this.Maze.Rooms[randomij[0]][randomij[1]]
        for (var i = 0; i < randomRoom.Attributes.length; i++) {
          if (i != 2) {
            go = go && !randomRoom.Attributes[i]
          }
        }
      } while (!go)
      //console.log(includesArray(this.SRooms,[randomRoom.x, randomRoom.y]));
      var entity = getPassiveEntityFromRarifiedArray();
      randomRoom.addPassiveEntity(entity);
      this.Maze.addPassiveEntityRoom(randomRoom);
    }
  }

  this.placeTraps = function() {
    var randomRoom;
    for (var count = 0; count < this.trapAmount; count++) {
      do {
		  go = true;
        randomij = this.SRooms[Random(0, this.SRooms.length - 1)]
        randomRoom = this.Maze.Rooms[randomij[0]][randomij[1]]
        for (var i = 0; i < randomRoom.Attributes.length; i++) {
          if (i != 2) {
            go = go && !randomRoom.Attributes[i]
          }
        }
      } while (!go)
      var trap = getTrapFromRarifiedArray();
      randomRoom.addTrap(trap);
      this.Maze.addTrapRoom(randomRoom);
    }
  }

  this.setStart = function() {
    var ij = this.Maze.getHighestWeightRoomIJ();
    this.Rooms[ij[0]][ij[1]].addStart();
  }

  this.setWeights = function(i,j,newWeight) {
    var weight = this.Rooms[i][j].weight;
    var linkedRooms = this.Maze.getLinkedRoom(i,j);
    if (weight == -1 || weight > newWeight) {
      weight = ++newWeight
      this.Rooms[i][j].weight = newWeight
      for (var count = 0; count < linkedRooms.length; count++) {
        this.setWeights(linkedRooms[count][0], linkedRooms[count][1], weight);
      }
    }
  }

  this.setTempWeights = function(i,j,newWeight) {
    var weight = this.Rooms[i][j].tempWeight;
    var linkedRooms = this.Maze.getLinkedRoom(i,j);
    if (weight == -1 || weight > newWeight) {
      weight = ++newWeight
      this.Rooms[i][j].tempWeight = newWeight
      for (var count = 0; count < linkedRooms.length; count++) {
        this.setTempWeights(linkedRooms[count][0], linkedRooms[count][1], weight);
      }
    }
  }

  this.setEndWeights = function(i,j,newWeight) {
    var weight = this.Rooms[i][j].endWeight;
    var linkedRooms = this.Maze.getLinkedRoom(i,j);
    if (weight == -1 || weight > newWeight) {
      weight = ++newWeight
      this.Rooms[i][j].endWeight = newWeight
      for (var count = 0; count < linkedRooms.length; count++) {
        this.setEndWeights(linkedRooms[count][0], linkedRooms[count][1], weight);
      }
    }
  }

  this.SidePath = function(i,j) {
    var newI = i;
    var newJ = j;
    var checkedLength;
    while(this.Rooms[i][j].checked.length > 0) {
      checkedLength = this.Rooms[i][j].checked.length;
      var rand = Random(0,checkedLength - 1);
      var resOri = this.Rooms[i][j].checked[rand];
      var targetRoomIJ = getIJFromRoom(i,j,resOri, (this.n - 1));
      if (!targetRoomIJ.includes(-1)) {
        if (!this.Rooms[targetRoomIJ[0]][targetRoomIJ[1]].isInPath()) {
          if (this.Maze.BreakWalls(i,j,targetRoomIJ[0],targetRoomIJ[1], resOri)) {
            newI = targetRoomIJ[0];
            newJ = targetRoomIJ[1];
            this.Rooms[newI][newJ].addInPath();
            remove(this.Rooms[newI][newJ].checked,OppositeOrientation(resOri));
            this.tempPath.push([i,j]);
          }
        }
      }
      remove(this.Rooms[i][j].checked,resOri);
      checkedLength = this.Rooms[i][j].checked.length;
      i = newI;
      j = newJ;  
    }
    this.Rooms[i][j].addSideRoom();
    this.addSRoom([i,j]);
    this.tempPath = [];  
  }

  this.makeFirstRoomOfPath = function(i,j){
    do {
      var rand = Random(0,this.Rooms[i][j].checked.length - 1);
      var resOri = this.Rooms[i][j].checked[rand];
      var targetRoomIJ = getIJFromRoom(i,j,resOri, (this.n - 1));
      remove(this.Rooms[i][j].checked,resOri);
    } while(targetRoomIJ.includes(-1));
    this.Maze.BreakWalls(i,j,targetRoomIJ[0],targetRoomIJ[1], resOri)
    newI = targetRoomIJ[0];
    newJ = targetRoomIJ[1];
    this.Rooms[newI][newJ].addInPath();
    remove(this.Rooms[newI][newJ].checked,OppositeOrientation(resOri));
    this.Rooms[i][j].addSideRoom();
    this.addSRoom([i,j]);      
  }

  this.MakeSidePath = function() {
    var looseRooms = this.getLooseRooms();
    var neighbourRooms = this.getNeighbourRooms();
    var randomNRoom;  

    while (looseRooms.length > 0) {
      rand = Random(0,(neighbourRooms.length - 1));
      randomNRoom = neighbourRooms[rand];
      this.SidePath(randomNRoom[0],randomNRoom[1]);
      looseRooms = this.getLooseRooms();
      neighbourRooms = this.getNeighbourRooms();
    }
  }

  this.selectRooms = function() {
    var amount = this.n;
    if ((amount % 2) == 1) {
      amount--;
    }
    var SpecialRooms;
    var rand;
    for (var i = 0; i < amount; i++) {
      rand = Random(0,(this.SRooms.length - 1)); 
      SpecialRooms[i] = SRooms[rand];
      remove(this.SRooms, SpecialRooms[0]);
    }
    this.SRooms = SpecialRooms;
  }
}
typeMap.set('MazeMaker', MazeMaker)