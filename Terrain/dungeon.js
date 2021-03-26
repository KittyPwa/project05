
function Database() {
	this.data = {
		dungeon: {
			rooms: {

			},
			spots: {

			}
		}
	}

	this.getSpot = function(x,y) {
		return this.data.dungeon.spots[x + '_' + y]
	}

	this.getSpots = function() {
		return Object.values(this.data.dungeon.spots);
	}

	this.setSpot = function(spot) {
		//console.log(spot)
		this.data.dungeon.spots[spot.x + '_' + spot.y] = spot
	}

	this.getRoom = function(id) {
		return this.data.dungeon.rooms[id]
	}

	this.getRooms = function() {
		let roomsOrCorridors = Object.values(this.data.dungeon.rooms)
		let rooms = []
		for(let elem of roomsOrCorridors) {
			if(elem.isRoom) {
				rooms.push(elem)
			}
		}
		return rooms;
	}

	this.getCorridors = function() {
		let roomsOrCorridors = Object.values(this.data.dungeon.rooms)
		let corridors = []
		for(let elem of roomsOrCorridors) {
			if(!elem.isRoom) {
				corridors.push(elem)
			}
		}
		return corridors;
	}

	this.setRoom = function(room) {
		this.data.dungeon.rooms[room.id] = room
	}

}

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
		let startRoom = DB.getRoom(roomId)		
		roomId++;
		let spotAmount = getRandomInt(this.minRoomSpotAmount, this.maxRoomSpotAmount) - 1;			
		this.populateRoom(startRoom, spotAmount);
		let randExtSpots = Object.values(startRoom.getExteriorSpots())
		let rand = getRandomInt(0, randExtSpots.length -1)
		let randSpot = randExtSpots[rand]
		let newRoom = null
		let goOn = false;
		while(!goOn) {
			let walls = this.getAdjacentWallsToSpot(randSpot);
			for(let wall of walls) {
				if(this.getAdjacentWallsToSpot(wall).length > 1) {
					newRoom = wall;
					goOn = true;
				}
			}
			randExtSpots = Object.values(startRoom.getExteriorSpots())
			rand = getRandomInt(0, randExtSpots.length -1)
			randSpot = randExtSpots[rand]
		}		
		this.initializeRoom(roomId, newRoom.x, newRoom.y, false);
		let corridor = DB.getRoom(roomId)
		this.populateCorridor(corridor, spotAmount/3)
	}

	this.initializeRoom = function(id,x,y, isRoom) {
		let room = new Room(id,isRoom);
		DB.setRoom(room)
		let startSpot = this.createNewSpot(x,y,true, room);
		this.addSpotToRoom(startSpot, room);
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
			this.openAdjacentWall(randSpot)
		}	
		dungeon.updateDungeonMaxMin(room)
	}

	this.populateCorridor = function(room, spotAmount) {
		let spot = Object.values(room.getExteriorSpots())[0]
		for(let i = 0; i<spotAmount; i++) {
			spot = this.openAdjacentWall(spot)
		}
	}

	//-----------------
	this.createNewSpot = function(x,y,isSpot, room) {
		this.maxY = this.maxY == null ? y : this.maxY < y ? y : this.maxY;
		this.minY = this.minY == null ? y : this.minY > y ? y : this.minY;
		this.maxX = this.maxX == null ? x : this.maxX < x ? x : this.maxX;
		this.minX = this.minY == null ? x : this.minX > x ? x : this.minX; 
		let spot = new Spot(x,y,isSpot);
		spot.updateRoomId(room.id)
		return spot;
	}

	this.addSpotToRoom = function(spot, room) {
		DB.setSpot(spot)
		//this.spots[spot['id']] = spot;
		room.exteriorSpots[spot['id']] = spot
		let x = spot['x'];
		let y = spot['y'];
		let left = this.createNewSpot(x-1,y, false, room);
		let right = this.createNewSpot(x+1,y, false, room);
		let top = this.createNewSpot(x,y-1, false, room);
		let bottom = this.createNewSpot(x,y+1, false, room);
		if(!DB.getSpot(left['x'],left['y'])) {
			this.addWallToRoom(left);
		}
		if(!DB.getSpot(right['x'],right['y'])) {
			this.addWallToRoom(right);
		}
		if(!DB.getSpot(top['x'],top['y'])) {
			this.addWallToRoom(top);
		}
		if(!DB.getSpot(bottom['x'],bottom['y'])) {
			this.addWallToRoom(bottom);
		}
	}

	this.addWallToRoom = function(wall) {
		DB.setSpot(wall);
		//this.spots[wall['id']] = wall;		
	}

	this.getSpots = function(isSpot) {
		let elems = []
		for(let elem in DB.getSpots()) {
			if(elem.isSpot) {
				elems.push(elem)			
			}
		}
		return elems;
	}

	this.getAdjacentSpotToWall = function(spot) {
		let walls =[];
		let x = spot['x'];
		let y = spot['y'];
		let left = DB.getSpot(x-1,y);
		let right = DB.getSpot(x+1,y);
		let top = DB.getSpot(x,y-1);
		let bottom = DB.getSpot(x,y+1);
		let possibleWalls = [left, right, top, bottom]
		for(let elem of possibleWalls) {
			if(elem && elem['isSpot']) {
				walls.push(elem)
			}
		} 
		return walls;
	}

	this.getAdjacentWallsToSpot = function(spot) {
		let walls =[];
		let x = spot['x'];
		let y = spot['y'];
		let left = DB.getSpot(x-1,y);
		let right = DB.getSpot(x+1,y);
		let top = DB.getSpot(x,y-1);
		let bottom = DB.getSpot(x,y+1);
		let possibleWalls = [left, right, top, bottom]
		for(let elem of possibleWalls) {
			if(elem && !elem['isSpot']) {
				walls.push(elem)
			}
		} 
		return walls;
	}

	this.updateExterior = function(old, newSpot){
		let room = DB.getRoom(old.roomId)
		if(DB.getSpot(old.x-1, old.y).isSpot
			 && DB.getSpot(old.x+1, old.y).isSpot
			 && DB.getSpot(old.x, old.y-1).isSpot
			 && DB.getSpot(old.x, old.y+1).isSpot) {
			delete room.exteriorSpots[old.x+'_'+old.y];
	}
		room.exteriorSpots[newSpot['id']] = newSpot;
	}

	this.openWall = function(spot) {
		let room = DB.getRoom(spot.roomId);
		spot.openWall();
		let x = spot['x'];
		let y = spot['y'];
		let left = this.createNewSpot(x-1,y, false, room);
		let right = this.createNewSpot(x+1,y, false, room);
		let top = this.createNewSpot(x,y-1, false, room);
		let bottom = this.createNewSpot(x,y+1, false, room);
		if(!DB.getSpot(left['x'],left['y'])) {
			this.addWallToRoom(left);
		}
		if(!DB.getSpot(right['x'],right['y'])) {
			this.addWallToRoom(right);
		}
		if(!DB.getSpot(top['x'],top['y'])) {
			this.addWallToRoom(top);
		}
		if(!DB.getSpot(bottom['x'], bottom['y'])) {
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

	this.openAdjacentCorridorWall = function(spot) {
		let walls = this.getAdjacentWallsToSpot(spot);
		if(walls.length > 0) {
			let goOn = false;
			do {
				let openSpot = walls[getRandomInt(0, walls.length-1)];
				if(this.getAdjacentSpotToWall(openSpot).length == 1) {
					goOn = true;
				}
			}while(!goOn)
			this.openWall(openSpot);			
			this.updateExterior(spot, openSpot)
			return openSpot;
		}		
	}
}

function Room(id, isRoom) {
	this.id = id;

	this.minX = null

	this.maxX = null

	this.minY = null

	this.maxY = null

	this.isRoom = isRoom

	this.exteriorSpots = {};

	this.getExteriorSpots = function() {
		return this.exteriorSpots;
	}

	
}

function Spot(x,y,isSpot) {
	this.roomId = null;

	this.id = x+'_'+y;

	this.x = x;

	this.y = y;

	this.isSpot = isSpot;

	this.updateRoomId = function(id) {
		this.roomId = id;
	}

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
		//console.log('opened wall')
		//console.log(this)
		DB.setSpot(this);
	}
}





let DB = new Database();
let dungeon = new Dungeon();
dungeon.initializeDungeon();
console.log(dungeon)
console.log(DB)