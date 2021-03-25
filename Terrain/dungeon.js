function Dungeon() {
	this.rooms = {};

	this.corridors = {};

	this.entrance = {
		'x': 0,
		'y': 0
	}

	this.exit = {};

	this.maxX = null;

	this.maxY = null;

	this.minX = null;

	this.minY = null;

	this.maxRoomSpotAmount = 50;
	this.minRoomSpotAmount = 45;

	this.updateDungeonMaxMin = function(room) {
		this.maxY = this.maxY == null ? room.maxY : this.maxY < room.maxY ? room.maxY : this.maxY;
		this.minY = this.minY == null ? room.minY : this.minY > room.minY ? room.minY : this.minY;
		this.maxX = this.maxX == null ? room.maxX : this.maxX < room.maxX ? room.maxX : this.maxX;
		this.minX = this.minY == null ? room.minX : this.minX > room.minX ? room.minX : this.minX;
	}

	this.getRoom = function(id) {
		return this.rooms[id];
	}

	this.initializeDungeon = function(){
		let roomId = 0;
		this.initializeRoom(roomId,0,0, true);
		let startRoom = this.getRoom(roomId)		
		roomId++;
		let spotAmount = getRandomInt(this.minRoomSpotAmount, this.maxRoomSpotAmount) - 1;			
		this.populateRoom(startRoom, spotAmount);
		let randExtSpots = Object.values(startRoom.getExteriorSpots())
		let rand = getRandomInt(0, randExtSpots.length -1)
		let randSpot = randExtSpots[rand]
		let newRoom = null
		let goOn = false;
		while(!goOn) {
			let walls = startRoom.getAdjacentWallsToSpot(randSpot);
			for(let wall of walls) {
				if(startRoom.getAdjacentWallsToSpot(wall).length > 1) {
					newRoom = wall;
					goOn = true;
				}
			}
			randExtSpots = Object.values(startRoom.getExteriorSpots())
			rand = getRandomInt(0, randExtSpots.length -1)
			randSpot = randExtSpots[rand]
		}		
		this.initializeRoom(roomId, newRoom.x, newRoom.y, false);
		let corridor = this.getCorridor(roomId)
		console.log(corridor)
		this.populateCorridor(corridor, spotAmount/3)
	}

	this.getCorridor = function(id) {
		return this.corridors[id]
	}

	this.initializeRoom = function(id,x,y, isRoom) {
		let room = new Room(id,isRoom);
		let startSpot = room.createNewSpot(x,y,true);
		room.addSpotToRoom(startSpot);
		if(isRoom) {
			this.rooms[room.id] = room;
		} else {
			this.corridors[room.id] = room;
		}
	}

	this.populateRoom = function(room, spotAmount) {
		for(let i = 0; i < spotAmount; i++) {
			let randExtSpots = Object.values(room.getExteriorSpots())
			let rand = getRandomInt(0, randExtSpots.length -1)
			let randSpot = randExtSpots[rand]
			room.openAdjacentWall(randSpot)
		}	
		dungeon.updateDungeonMaxMin(room)
	}

	this.populateCorridor = function(room, spotAmount) {
		let spot = Object.values(room.getExteriorSpots())[0]
		for(let i = 0; i<spotAmount; i++) {
			spot = room.openAdjacentWall(spot)
		}
	}
}

function Room(id, isRoom) {
	this.id = id;

	this.spots = {};

	this.minX = null

	this.maxX = null

	this.minY = null

	this.maxY = null

	this.isRoom = isRoom

	this.getSpots = function() {
		return this.spots;
	}

	this.exteriorSpots = {};

	this.getExteriorSpots = function() {
		return this.exteriorSpots;
	}

	this.createNewSpot = function(x,y,isSpot) {
		this.maxY = this.maxY == null ? y : this.maxY < y ? y : this.maxY;
		this.minY = this.minY == null ? y : this.minY > y ? y : this.minY;
		this.maxX = this.maxX == null ? x : this.maxX < x ? x : this.maxX;
		this.minX = this.minY == null ? x : this.minX > x ? x : this.minX; 
		return new Spot(x,y,isSpot);
	}

	this.addSpotToRoom = function(spot) {
		this.spots[spot['id']] = spot;
		console.log(spot)
		this.exteriorSpots[spot['id']] = spot
		let x = spot['x'];
		let y = spot['y'];
		let left = this.createNewSpot(x-1,y, false);
		let right = this.createNewSpot(x+1,y, false);
		let top = this.createNewSpot(x,y-1, false);
		let bottom = this.createNewSpot(x,y+1, false);
		if(!this.spots[left['x'] + '_' + left['y']]) {
			this.addWallToRoom(left);
		}
		if(!this.spots[right['x'] + '_' + right['y']]) {
			this.addWallToRoom(right);
		}
		if(!this.spots[top['x'] + '_' + top['y']]) {
			this.addWallToRoom(top);
		}
		if(!this.spots[bottom['x'] + '_' + bottom['y']]) {
			this.addWallToRoom(bottom);
		}
	}

	this.addWallToRoom = function(wall) {		
		this.spots[wall['id']] = wall;		
	}

	this.getWallsOrSpots = function(isSpot) {
		let elems = []
		for(let elem in this.spots) {
			if(elem.isSpot) {
				elems.push(elem)			
			}
		}
		return elems;
	}

	this.getAdjacentWallsToSpot = function(spot) {
		let walls =[];
		let x = spot['x'];
		let y = spot['y'];
		let left = this.getSpot(x-1,y);
		let right = this.getSpot(x+1,y);
		let top = this.getSpot(x,y-1);
		let bottom = this.getSpot(x,y+1);
		let possibleWalls = [left, right, top, bottom]
		for(let elem of possibleWalls) {
			if(elem && !elem['isSpot']) {
				walls.push(elem)
			}
		} 
		return walls;
	}

	this.updateExterior = function(old, newSpot){
		if(this.getSpot(old.x-1, old.y).isSpot
			 && this.getSpot(old.x+1, old.y).isSpot
			 && this.getSpot(old.x, old.y-1).isSpot
			 && this.getSpot(old.x, old.y+1).isSpot) {
			delete this.exteriorSpots[old.x+'_'+old.y];
	}
		this.exteriorSpots[newSpot['id']] = newSpot;
	}

	this.getSpot =function(x,y) {
		return this.spots[x + '_' + y]
	}

	this.openWall = function(spot) {
		spot.openWall();
		let x = spot['x'];
		let y = spot['y'];
		let left = this.createNewSpot(x-1,y, false);
		let right = this.createNewSpot(x+1,y, false);
		let top = this.createNewSpot(x,y-1, false);
		let bottom = this.createNewSpot(x,y+1, false);
		if(!this.spots[left['x'] + '_' + left['y']]) {
			this.addWallToRoom(left);
		}
		if(!this.spots[right['x'] + '_' + right['y']]) {
			this.addWallToRoom(right);
		}
		if(!this.spots[top['x'] + '_' + top['y']]) {
			this.addWallToRoom(top);
		}
		if(!this.spots[bottom['x'] + '_' + bottom['y']]) {
			this.addWallToRoom(bottom);
		}
	}

	this.openAdjacentWall = function(spot) {
		let walls = this.getAdjacentWallsToSpot(spot);
		if(walls.length > 0) {
			let openSpot = walls[getRandomInt(0, walls.length-1)];
			this.openWall(openSpot);			
			this.updateExterior(spot, openSpot)
			return openSpot;
		}		
	}
}

function Spot(x,y,isSpot) {
	this.id = x+'_'+y;

	this.x = x;

	this.y = y;

	this.isSpot = isSpot;

	this.initializeSpot = function(x,y,isSpot) {
		return {
			'id': x+'_'+y,
			'x': x,
			'y': y,
			'isSpot': isSpot
		}
	}

	this.openWall = function() {
		this.isSpot = true;
	}
}






let dungeon = new Dungeon();
dungeon.initializeDungeon();
console.log(dungeon)
console.log(dungeon['rooms']['0']['spots'])
