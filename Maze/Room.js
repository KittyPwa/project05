
function Room(x,y,n) {
	//The wall's order is : North-East-South-West

	this.x = x;

	this.y = y;

	this.n = n;

	this.weight = -1;

	this.endWeight = -1;

	this.tempWeight = -1;

	this.Walls = [];
	for (var i=0; i < 4; i++) {
		this.Walls[i] = true;
	}
	
	this.discovered = false;
	
	this.doors = [null, null, null, null];
	
	this.CanvasRoom = new CanvasRoom(this, n);

	this.treasure = null;
	//attributes : [start,end,path,door,treasure,entity,item, trap]
	this.Attributes = [false, false, false, false, false, false, false, false, false];

	this.inCharacterSight = new Map();

	this.activatableEntity = null;

	this.trap = null;

	this.passiveEntity = null

	this.Speciality;

	this.item = null;

	this.paths = new Map();

	this.addPath = function(path, room) {
		this.paths.set(room, path)
	}

	this.addStart = function() {
		this.Attributes[0] = true;
		this.addInPath();
	}

	this.isStart = function() {
		return this.Attributes[0];
	}

	this.addEnd = function() {
		this.activatableEntity = new ActivatableEntity(new End());
		this.Attributes[5] = true;
		this.Attributes[1] = true;
		this.addInPath();
	}

	this.isEnd = function() {
		return this.Attributes[1];
	}

	this.addSideRoom = function() {
		this.Speciality = 'side';
	}

	this.isSideRoom = function() {
		return this.Speciality === 'side';
	}

	this.addInPath = function() {
		this.Attributes[2] = true;
	}

	this.removeFromPath = function() {
		this.Attributes[2] = false;
	}

	this.isInPath = function() {
		return this.Attributes[2];
	}

	this.addDoor = function(orientation) {
		this.Attributes[3] = true
		this.Attributes[5] = true
		this.doors[orientation] = false;
		this.activatableEntity = new ActivatableEntity(new Door())
	}
	
	this.removeDoor = function(orientation) {
		this.doors[orientation] = null;
	}	
	
	this.openDoors = function() {
		for (var i = 0; i < this.doors.length; i++) {
			if (this.doors[i] != null && !this.doors[i]) {
				this.doors[i] = true;
			}
		}
		this.drawRoom();
	}

	this.hasDoor = function() {
		returnValue = false;
		for (var i = 0; i < this.doors.length; i++) {
			returnValue = returnValue || this.doors[i] != null
		}
		return returnValue;
	}

	this.addTreasure = function(treasure) {
		this.Attributes[4] = true;
		this.Attributes[5] = true;
		this.activatableEntity = treasure;
	}
	
	this.returnAndRemoveTreasure = function() {
		this.Attributes[4] = false;
		this.Attributes[5] = false;
		var treasure = this.treasure;
		this.treasure = null;
		return treasure;
	}

	this.hasTreasure = function() {
		return this.treasure != null;
	}

	this.addActivatableEntity = function(entity) {
		this.Attributes[5] = true;
		this.activatableEntity = entity;
	}

	this.returnActivatableEntity = function() {
		var entity = this.activatableEntity;
		return entity;
	}

	this.returnAndActivateEntity = function() {
		this.Attributes[5] = false;
		var entity = this.activatableEntity;
		this.activatableEntity = null;
		return entity;
	}

	this.hasActivatableEntity = function() {
		return this.activatableEntity != null
	}

	this.addTrap = function(trap) {
		this.Attributes[7] = true;
		this.Attributes[5] = true;
		this.trap = trap;
	}

	this.returnTrap = function() {
		return this.trap;
	}

	this.hasTrap = function() {
		return this.trap != null;
	}

	this.removeTrap = function() {
		this.Attributes[7] = false;
		this.Attributes[5] = false;
		this.trap = false;
	}

	this.addPassiveEntity = function(entity) {
		this.Attributes[8] = true;
		this.Attributes[5] = true;
		this.passiveEntity = entity;
	}

	this.returnPassiveEntity = function() {
		return this.passiveEntity;
	}

	this.hasPassiveEntity = function() {
		return this.passiveEntity != null;
	}

	this.removePassiveEntity = function() {
		this.Attributes[8] = false;
		this.Attributes[5] = false;
		this.passiveEntity = null;
	}

	this.checked;

	this.placeItem = function(item) {
		this.Attributes[6] = true;
		this.item = item;
	}

	this.removeAndReturnItem = function() {
		this.Attributes[6] = false;
		item = this.item;
		this.item = null;
		return item;
	}

	this.hasItem = function() {
		return this.item != null;
	}

	this.initializeSightMap = function() {
		for (var [key, value] of gameState.entities) {
			for (var i = 0; i < value.length; i++) {
				this.inCharacterSight.set(value[i].id, false)
			}
		}	
	}

	this.setRoomInSight = function(character, inSight) {
		if (this.inCharacterSight.has(character.id)) {
			this.inCharacterSight.delete(character.id)
		}
		this.inCharacterSight.set(character.id, inSight)
	}

	this.isRoomInSight = function(character) {
		return this.inCharacterSight.get(character.id)
	}
	
	this.isRoomInDark = function() {
		return !this.inCharacterSight.get(gameState.getCharacter().id)
	}

	//initializes the checked orientations
	this.initializeChecked = function() {
		this.checked = [0,1,2,3];	
	}
	
	this.initializeChecked();

	//Breaks a wall with the specified orientation
	this.BreakWall = function(n) {
		this.Walls[n] = false;
	}

	//Builds a wall with the specified orientation
	this.BuildWall = function(n) {
		this.Walls[n] = true;
	}

	//Only to be used in the case where there is only 1 open wall
	this.getOpenOrientation = function() {
		if (this.Walls.includes(false)){
			for (var i = 0; i < this.Walls.length; i++) {
				if (!this.Walls[i]) {
					return i;
				}
			}
		}
		return -1;
	}

	this.drawRoom = function(){
		this.CanvasRoom.drawRoom(this.x, this.y);
	}
	
	this.drawCrossRooms = function() {
		this.CanvasRoom.drawRoom(this.x, this.y);
		this.CanvasRoom.drawRoom(this.x-1, this.y);
		this.CanvasRoom.drawRoom(this.x, this.y-1);
		this.CanvasRoom.drawRoom(this.x+1, this.y);
		this.CanvasRoom.drawRoom(this.x, this.y+1);
	}
}
typeMap.set('Room', Room)