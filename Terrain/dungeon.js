var stoper = null

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

	this.updateBase = function(){
		let rooms = [...Object.values(this.getRooms()), ...Object.values(this.getCorridors())]
		for(let room of rooms) {
			for(let spot of Object.values(room.spots)) {
				this.setSpot(spot)
			}
		}
	}

}

function Dungeon(roomAmount, minRoomSpot, maxRoomSpot) {
	this.rooms = {};

	this.currentRoomId = 0;

	this.spotAmount = 

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

	this.maxRoomSpotAmount = maxRoomSpot;
	
	this.minRoomSpotAmount = minRoomSpot;

	this.roomAmount = roomAmount;

	this.updateDungeonMaxMin = function(room) {
		this.maxY = this.maxY == null ? room.maxY : this.maxY < room.maxY ? room.maxY : this.maxY;
		this.minY = this.minY == null ? room.minY : this.minY > room.minY ? room.minY : this.minY;
		this.maxX = this.maxX == null ? room.maxX : this.maxX < room.maxX ? room.maxX : this.maxX;
		this.minX = this.minY == null ? room.minX : this.minX > room.minX ? room.minX : this.minX;
	}

	this.getRoom = function(id) {
		return this.rooms[id];
	}

	this.updateBase = function() {
		let allRooms = [...Object.values(this.rooms), ...Object.values(this.corridors)]
		for(let room of allRooms) {
			this.updateDungeonMaxMin(room)
		}
		DB.updateBase()
	}

	this.initializeDungeon = function(){
		this.spotAmount = getRandomInt(this.minRoomSpotAmount, this.maxRoomSpotAmount) - 1;	
		this.createRoom(null)		
		console.log(DB)
		for(let i = 0; i < this.roomAmount; i++) {
			let rooms = DB.getRooms();
			let corridors = DB.getCorridors();
			if(rooms.length > corridors.length) {
				this.startCorridorCreation(rooms)
			} else if(rooms.length * 1.5 < corridors.length){
				this.startRoomCreation(corridors)
			} else {
				switch(getRandomInt(0,2)) {
					case 0 : 
						this.startCorridorCreation(rooms)
					break;
					default:
						this.startRoomCreation(corridors)
					break;
				}
			}
			/*let startRoom = DB.getRoom(this.currentRoomId - 1)
			this.createCorridor(startRoom);
			startRoom = DB.getRoom(this.currentRoomId - 2)
			this.createRoom(startRoom)*/
		}		
		this.updateBase()		
	}

	this.filterOutConsumedCorridors = function(corridors) {
		let ret = [];
		for(let corridor of corridors) {
			if(!corridor.consumed) {
				ret.push(corridor);
			}
		}
		return ret
	}

	this.startCorridorCreation = function(rooms) {
		rooms = shuffleArray(rooms);
		for (let room of rooms) {
			let res = this.createCorridor(room);
			if(res != null) {
				return;
			}
		}
		
	}

	this.startRoomCreation = function(corridors){
		corridors = this.filterOutConsumedCorridors(corridors)
		corridors = shuffleArray(corridors);
		for(let corridor of corridors) {
			let res = this.createRoom(corridor)
			if(res != null) {
				return;
			}
		}

	} 

	this.createRoom = function(prevCorridor) {
		if(prevCorridor == null) {
			this.initializeRoom(this.currentRoomId,0,0, true);
		} else {
			let newSpot = this.findRoomStart(prevCorridor);
			if(newSpot == null) {
				return null;
			}		
			this.initializeRoom(this.currentRoomId,newSpot.x, newSpot.y, true)
		}
		let startRoom = DB.getRoom(this.currentRoomId)		
		this.populateRoom(startRoom, this.spotAmount);
		if(prevCorridor != null) {
			prevCorridor.consumed = true;
		}
		let filteredSpot = this.findNonIsolatedExtreme(startRoom)
		if(filteredSpot != null) {
			let dirs = this.majDirection(filteredSpot);
			let dir = dirs[0];
			if(dirs.length > 1) {
				let rand = getRandomInt(0, dirs.length -1)
				dir = dirs[rand];
			}
			startRoom.directions[dir.id] = true;
		}		
		this.currentRoomId++;
		return true;
	}

	this.filterOutOtherRoomSpots = function(spots, room) {
		let ret = []
		for (let spot of spots) {
			if(spot.roomId == room.id) {
				ret.push(spot)
			}
		}
		return ret;
	}

	this.findNonIsolatedExtreme = function(room) {
		let extremes = room.getExtremeSpots([]);
		for(let extreme of extremes) {
			let spots = this.getAdjacentSpotToWall(extreme);
			let previousLength = spots.length;
			spots = this.filterOutOtherRoomSpots(spots, room)
			if(previousLength > spots.length) {
				return extreme
			}
		}
		return null;
	}

	this.findCorridorStart = function(prevRoom) {
		let filterDirections = [];
		for(let dir of Object.keys(prevRoom.directions)) {
			filterDirections.push(Object.values(direction)[dir])
		}
		if(filterDirections.length == 4) {
			return null;
		}
		let extremeSpots = prevRoom.getExtremeSpots(filterDirections);
		let newSpot = null;
		extremeSpots = shuffleArray(extremeSpots);
		for(let wall of extremeSpots) {
			if(this.getAdjacentSpotToWall(wall.length > 1)) {
					newSpot = wall
			}
		}
		return newSpot
	}

	this.findRoomStart = function(prevRoom) {
		let lastSpot = prevRoom.lastSpot;
		let newSpot = null;
		let walls = this.getAdjacentWallsToSpot(lastSpot);
		walls = shuffleArray(walls);
		for(let wall of walls) {
			if(this.getAdjacentWallsToSpot(wall).length <= 1) {
				newSpot = wall;
			}
		}		
		return newSpot;
	}

	this.createCorridor = function(prevRoom) {
		let newSpot = this.findCorridorStart(prevRoom);
		if(newSpot != null) {
			this.initializeRoom(this.currentRoomId, newSpot.x, newSpot.y, false);
			let corridor = DB.getRoom(this.currentRoomId)
			let dirs = this.majDirection(newSpot);
			let dir = dirs[0];
			if(dirs.length > 1) {
				let rand = getRandomInt(0, dirs.length -1)
				dir = dirs[rand];
			}
			prevRoom.directions[dir.id] = true;
			let res = this.populateCorridor(corridor, this.spotAmount/3)
			if(res == null) {
				return res;
			}
			this.currentRoomId++;
			return true;
		}
	}

	this.initializeRoom = function(id,x,y, isRoom) {
		let room = new Room(id,isRoom);
		DB.setRoom(room)
		let startSpot = new Spot(x,y,true, room);
		this.updateNewSpot(startSpot, room)
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
	}

	this.destroyRoom = function(room) {
		console.log('DESTROY ROOM: ' + room)
		let spots = Object.values(room.spots);
		for(let spot of spots) {
			delete DB.data.dungeon.spots[spot.id]
		}
		delete DB.data.dungeon.rooms[room.id]
		this.updateBase()	
	}

	this.populateCorridor = function(room, spotAmount) {
		let oldSpot = Object.values(room.getExteriorSpots())[0]
		let spot = this.openAdjacentCorridorWall(oldSpot, null)
		if(spot == null) {
			this.destroyRoom(room)
			return null;
		}
		let direction = this.getDirection(oldSpot, spot)
		for(let i = 0; i<spotAmount-1; i++) {
			spot = this.openAdjacentCorridorWall(spot, direction)
			room.lastSpot = spot
			if(spot == null) {
				this.destroyRoom(room)
				return null;
			}
		}
		if(this.getAdjacentSpotToWall(room.lastSpot).length > 1) {
			room.consumed = true;
		}
		if(Object.values(room.spots).length == 1) {
			this.destroyRoom(room)
			return null;
		}
		return true
	}

	this.majDirection = function(spot) {
		let ret = [];
		room = DB.getRoom(spot.roomId)
		if(spot.x == room.minX) {
			ret.push(direction.left)
		}
		if(spot.x == room.maxX) {
			ret.push(direction.right)
		}
		if(spot.y == room.minY) {
			ret.push(direction.down)
		}
		if(spot.y == room.maxY) {
			ret.push(direction.up)
		}
		return ret;
	}

	this.getDirection = function(oldSpot, newSpot) {
		let ret = direction.right
		if(oldSpot.x > newSpot.x) {
			ret = direction.left
		}
		if(oldSpot.y > newSpot.y) {
			ret = direction.down
		}
		if(oldSpot.y < newSpot.y) {
			ret = direction.up
		}
		return ret;
	}

	//-----------------
	this.updateNewSpot = function(spot, room) {
		room.maxY = room.maxY == null ? spot.y : room.maxY < spot.y ? spot.y : room.maxY;
		room.minY = room.minY == null ? spot.y : room.minY > spot.y ? spot.y : room.minY;
		room.maxX = room.maxX == null ? spot.x : room.maxX < spot.x ? spot.x : room.maxX;
		room.minX = room.minX == null ? spot.x : room.minX > spot.x ? spot.x : room.minX; 
		spot.updateRoomId(room.id)
		room.addSpot(spot)
		return spot;
	}
	this.addSpotToRoom = function(spot, room) {
		DB.setSpot(spot)
		room.exteriorSpots[spot['id']] = spot
		let x = spot['x'];
		let y = spot['y'];
		let left = new Spot(x-1,y, false, room);
		let right = new Spot(x+1,y, false, room);
		let top = new Spot(x,y-1, false, room);
		let bottom = new Spot(x,y+1, false, room);
		if(!DB.getSpot(left['x'],left['y'])) {
			this.updateNewSpot(left, room)
			this.addWallToRoom(left);
		}
		if(!DB.getSpot(right['x'],right['y'])) {
			this.updateNewSpot(right, room)
			this.addWallToRoom(right);
		}
		if(!DB.getSpot(top['x'],top['y'])) {
			this.updateNewSpot(top, room)
			this.addWallToRoom(top);
		}
		if(!DB.getSpot(bottom['x'],bottom['y'])) {
			this.updateNewSpot(bottom, room)
			this.addWallToRoom(bottom);
		}
	}

	this.addWallToRoom = function(wall) {
		DB.setSpot(wall);
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
		room.updateSpot(spot)
		let x = spot['x'];
		let y = spot['y'];
		let left = new Spot(x-1,y, false, room);
		let right = new Spot(x+1,y, false, room);
		let top = new Spot(x,y-1, false, room);
		let bottom = new Spot(x,y+1, false, room);
		if(!DB.getSpot(left['x'],left['y'])) {
			this.updateNewSpot(left, room)
			this.addWallToRoom(left);
		}
		if(!DB.getSpot(right['x'],right['y'])) {
			this.updateNewSpot(right, room)
			this.addWallToRoom(right);
		}
		if(!DB.getSpot(top['x'],top['y'])) {
			this.updateNewSpot(top, room)
			this.addWallToRoom(top);
		}
		if(!DB.getSpot(bottom['x'], bottom['y'])) {
			this.updateNewSpot(bottom, room)
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

	this.filterDirection = function(startSpot, spots, direction) {
		let filtered = []
		for(let spot of spots) {
			if(this.getDirection(startSpot, spot).id != direction.opposite) {
				filtered.push(spot)
			}
		}
		return filtered;
	}

	this.openAdjacentCorridorWall = function(spot, direction) {
		let walls = this.getAdjacentWallsToSpot(spot);
		if(direction) {
			walls = this.filterDirection(spot, walls, direction);
		}
		if(walls.length > 0) {
			let goOn = false;
			let openSpots = []
			for(let wall of walls) {
				let adj = this.getAdjacentSpotToWall(wall)
				if(adj.length == 1) {
					openSpots.push(wall)
				}
			}
			if(openSpots.length < 1) {
				return null
			}
			let openSpot = openSpots[getRandomInt(0, openSpots.length-1)];
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

	this.spots = {}

	this.lastSpot = null;

	this.directions = {};

	this.consumed = false;

	this.addSpot = function(spot) {
		if(!this.spots[spot.id]){
			this.spots[spot.id] = spot		
		}
	}

	this.getExtremeSpots = function(filters) {
		let ret = []
		let min = this.minX < this.minY ? this.minX : this.minY;
		let max = this.maxX > this.maxY ? this.maxX : this.maxY;
		let elementsX = [this.minX, this.maxX];
		let elementsY = [this.minY, this.maxY]
		if(filters.length > 0) {
			for(let filter of filters) {
				if(filter.id == direction.up.id) {
					elementsY.pop()
				}
				if(filter.id == direction.down.id) {
					elementsY.reverse().pop()
				}
				if(filter.id == direction.right.id) {
					elementsX.pop()
				}
				if(filter.id == direction.left.id) {
					elementsX.reverse().pop()
				}
			}
		}
		for(let i = min; i <= max; i++) {
			for(let elem of elementsX) {
				let spot = DB.getSpot(elem, i);
				if(spot && spot.roomId == this.id) {
					ret.push(spot)
				}
			}
			for(let elem of elementsY) {
				let spot = DB.getSpot(i, elem)
				if(spot && spot.roomId == this.id) {
					ret.push(spot)
				}
			}
		}
		return ret;
	}

	this.updateSpot = function(spot) {
		if(this.spots[spot.id]) {
			this.spots[spot.id] = spot
		}
	}

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
		DB.setSpot(this);
	}
}





let DB = new Database();
let dungeon = new Dungeon(1000, 45, 100);
dungeon.initializeDungeon();
console.log(dungeon)
console.log(DB)