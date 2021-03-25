//Utils
function store(entity) {
	var objectified = objectAssignerRec(entity)
	var stringy = JSON.stringify(objectified)
	localStorage.setItem(entity.id, stringy);	
}

function load(id) {
	entity = localStorage.getItem(id)
	if (entity != null) {
		var parsed = JSON.parse(entity)
		var mappy = namelessobjectToObject(parsed, typeMap.get('Games'))
		delete mappy['gameStates,Map']
		return mappy
	}
	return null
}

function mapToJson(map) {
    return JSON.stringify([...map]);
}
function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}

function isString(myVar) {
	return (typeof myVar === 'string' || myVar instanceof String)
}

function isPrimitive(test) {
    return (test !== Object(test));
};

function isFunction(functionToCheck) {
	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function mapToObjectRec(m) {
    var lo = {}
    for(var [k,v] of m) {
        if(v instanceof Map) {
			k = [k,'Map']		
            lo[k] = mapToObjectRec(v)
        } else if (!isPrimitive(v) && !isFunction(v)) {
			k = [k,v.constructor.name]
			if (!Array.isArray(v)) {
				lo[k] = objectAssignerRec(v)
			} else {
				var type = ''
					if (v.length > 0) {
						type = v[0].constructor.name
					}
					var mapped = arrayToMap(v, type)
					lo[k] = mapToObjectRec(mapped)
			}
		}
        else {
			if (!isPrimitive(v) && !Array.isArray(v)) {
				k = [k,v.constructor.name]
			}
			lo[k] = v
        }
	}
    return lo
}

function objectAssignerRec(m) {
	var lo = {}
	//console.log(m)
	for (var k in m) {
		if (m.hasOwnProperty(k)) {
			var v = m[k]
			if(v instanceof Map) {
				k = [k,'Map']
				lo[k] = mapToObjectRec(v)
			} else if (!isPrimitive(v) && !isFunction(v)) {
				k = [k,v.constructor.name]
				if (!Array.isArray(v)) {
					lo[k] = objectAssignerRec(v)
				} else {
					var type = ''
					if (v.length > 0 && v[0] != null) {
						//console.log(v)
						//console.log(v[0])
						type = v[0].constructor.name
					}
					var mapped = arrayToMap(v, type)
					lo[k] = mapToObjectRec(mapped)
				}
			}
			else {
				if (!isPrimitive(v) && !Array.isArray(v) && !isFunction(v)) {
					k = [k,v.constructor.name]
				}
				lo[k] = v
			}
		}
	}
	return lo
}

function arrayToMap(array, type = '') {
	var map = new Map()
	type = (type.length == 0 ? '': ',' + type)
	for (var k in array) {
		map.set(k + type, array[k]);
	}
	return map;
}

function mapToArray(map) {
	var array = []
	for(var [k,v] of map) {
		array.push(map.get(k))
	}
	return array
}


function namelessobjectToObject(o, type) {
	//console.log(o)
	var m = Object.assign(new (type), o);
    for(var k of Object.keys(o)) {
		var split = k.split(',')
		var oldk = k.concat('')
		k = split[0]
		if (split.length > 1) {
			var propertyName = oldk.toString()
			if (split[1].startsWith('Map')) {
				m[k] = objectMapToObjectRec(o[oldk])
			} else if (split[1].startsWith('Array')){
				var map = objectMapToObjectRec(o[oldk])
				m[k] = mapToArray(map)
				//m[k] = objectArrayToObject(array)
			} else {
				m[k] = namelessobjectToObject(o[oldk], typeMap.get(split[1]))
			}
			delete m[propertyName]
		}
        else {
            m[k] = o[oldk]
        }    
	}
    return m
}

function objectMapToObjectRec(o) {
	var m = new Map()
    for(var k of Object.keys(o)) {
		var split = k.split(',')
		var oldk = k
		k = split[0]
        if (split.length > 1 && !isPrimitive(o[oldk])) {
			if(split[1].startsWith('Map')) {
				m.set(k, objectMapToObjectRec(o[oldk]))
			} else if (split[1].startsWith('Array')){
				var map = objectMapToObjectRec(o[oldk])
				m.set(k, mapToArray(map))
				//m.set(k, objectArrayToObject(o[oldk]))
			} else {
				/*console.log(split[1])
				console.log(oldk)*/
				m.set(k, namelessobjectToObject(o[oldk], typeMap.get(split[1]))) 
			}
		}
        else {
            m.set(k, o[oldk])
        }    
    }
    return m
}

function objectArrayToObject(o) {
	var m = []
	//console.log(o)
	for(var k in o) {
		var split = k.split(',')
		//console.log(split)
		var oldk = k
		k = split[0]
		if (split.length > 1 ) {
			//console.log(split[1])
			if(split[1].startsWith('Map')) {
				m[k] = objectMapToObjectRec(o[oldk])
			} else if (split[1].startsWith('Array')){
				var map = objectMapToObjectRec(o[oldk])
				m[k] = mapToArray(map)
				//m[k] = objectArrayToObject(o[oldk])
			} else {
				//console.log(split[1])
				m[k] = namelessobjectToObject(o[oldk], typeMap.get(split[1]))
				//console.log(m[k])
			}
		}
        else {
            m[k] = o[oldk]
        }    
    }
    return m
}

function uuidv4() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
	  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}

function isInMaze(n, i, j) {
	return (i < n && i >= 0) && (j < n && j >= 0); 
}

function remove(array, element) {
	const index = array.indexOf(element);
    
    if (index !== (-1)) {
        array.splice(index, 1);
    }
}

function removeArray(array, x,y) {
	var arraylength;
	do {
		arraylength = array.length
		for (var i = 0; i < array.length; i++) {
			if (array[i][0] == x && array[i][1] == y) {
				array.splice(i, 1);
			}
		}
	} while(arraylength != array.length)
	return array;
}

//Get the opposite orientation from given orientation
function OppositeOrientation(n) {
	var res;
		if (n <= 1) {
			res = n + 2;
		} else {
			res = n - 2;
		}
		return res;
}

function getReverseArray(array) {
	var result = [];
	for (var i = array.length - 1; i >= 0; i--) {
		result.push(array[i])
	}
	return result;
}

function includesArray(a1,a2) {
	return (JSON.stringify(a1).indexOf(JSON.stringify(a2)) != -1);
}

function getOtherOrientations(orientation) {
	var res = [];
	if (orientation == 1 || orientation == 3) {
		res.push(0);
		res.push(2);
	} else {
		res.push(1);
		res.push(2);
	}
	return res;
}

function getOrientationFromRooms(from,to) {
	var result = -1;
	if (from.x == to.x) {
		if (from.y > to.y) {
			result = 0;
		}
		if (from.y < to.y) {
			result = 2;
		}
	} else {
		if (from.y == to.y) {
			if (from.x > to.x) {
				result = 3;
			}
			if (from.x < to.x) {
				result = 1;
			}
		}
	}
	return result;
}

//Get target coordinates from i,j and specified orientation.
function getIJFromRoom(i,j,orientation, n){
	var resI = i;
	var resJ = j;
	switch (orientation) {
		case 0:
			resJ--;
			break;
		case 1:
			resI++;
			if (i == (n)) {
				resI = -1;
			}
			break;
		case 2:
			resJ++;
			if (j == (n)) {
				resJ = -1;
			}
			break;
		default: 
			resI--;
	}
	return [resI,resJ];

}

//Gives a random number between min and max
function Random(min, max){
  var nb = min + (max-min+1)*Math.random();
  return Math.floor(nb);
}

function getSurroundingRoomLinkedWalls(i,j) {
	var room = gameState.maze.Rooms[i][j];
	//walls = [top-left : right, top-left : bottom, top-right : left, top-right : bottom, bottom-left : right, bottom-left : top, bottom-right : left, bottom-right : top]
	var walls = [true, true, true, true, true, true, true, true]
	var room = null;
	if (i > 0) {
		if (j > 0) {
			room = gameState.maze.Rooms[i - 1][j - 1]
			walls[0] = room.Walls[1]
			walls[1] = room.Walls[2]
		}
		if (j < gameState.maze.n - 1) {
			room = gameState.maze.Rooms[i - 1][j + 1]
			walls[4] = room.Walls[1]
			walls[5] = room.Walls[0]
		} 
	}
	if (i < gameState.maze.n - 1) {
		if (j > 0) {
			room = gameState.maze.Rooms[i + 1][j - 1]
			walls[2] = room.Walls[2]
			walls[3] = room.Walls[3]
		}
		if (j < gameState.maze.n - 1) {
			room = gameState.maze.Rooms[i + 1][j + 1]
			walls[6] = room.Walls[3]
			walls[7] = room.Walls[0]
		} 
	}
	return walls
}

function CanMove(char, maze,i,j, posX,posY) {
	var RoomSize = maze.Rooms[0][0].CanvasRoom.roomSize;
    var x = Math.floor(i/RoomSize);
	var y = Math.floor(j/RoomSize);
	var Room = maze.getRoomFromChar(char);
	var gap = 3;
	var walls = getSurroundingRoomLinkedWalls(x,y)
	if (Room.Walls[0] && (posY < y * (RoomSize) + gap + RoomSize / 4)){
		posY = (y * RoomSize + gap + RoomSize / 4);
	}
	if (Room.Walls[1] && (posX + (char.radius*2) > (x+1)  * RoomSize - gap + RoomSize / 4)) {
		posX = ((x+1) * RoomSize - gap - (char.radius*2) + RoomSize / 4);
	}
	if (Room.Walls[2] && (posY + (char.radius*2)> (y+1) * RoomSize - gap + RoomSize / 4)) {
		posY = ((y+1) * RoomSize - gap - (char.radius*2) + RoomSize / 4);
	}
	if (Room.Walls[3] && (posX < x * RoomSize + gap + RoomSize / 4)) {
		posX = (x * RoomSize + gap + RoomSize / 4);
	}

	if ((posY < y * (RoomSize) + gap + RoomSize / 4)) {
		if ((posX + (char.radius*2) > (x+1)  * RoomSize - gap + RoomSize / 4) && (walls[2] || walls[3])) {
			posY = (y * RoomSize + gap + RoomSize / 4);
			posX = ((x+1) * RoomSize - gap - (char.radius*2) + RoomSize / 4);
		}
		if ((posX < x * RoomSize + gap + RoomSize / 4) && (walls[0] || walls[1])) {
			posY = (y * RoomSize + gap + RoomSize / 4);
			posX = (x * RoomSize + gap + RoomSize / 4);
		}
	}
	if (posY + (char.radius*2)> (y+1) * RoomSize - gap + RoomSize / 4) {
		if ((posX + (char.radius*2) > (x+1)  * RoomSize - gap + RoomSize / 4) && (walls[6] || walls[7])) {
			posY = ((y+1) * RoomSize - gap - (char.radius*2) + RoomSize / 4);
			posX = ((x+1) * RoomSize - gap - (char.radius*2) + RoomSize / 4);
		}
		if ((posX < x * RoomSize + gap + RoomSize / 4) && (walls[4] || walls[5])) {
			posY = ((y+1) * RoomSize - gap - (char.radius*2) + RoomSize / 4);
			posX = (x * RoomSize + gap + RoomSize / 4);
		}
	}
	return [posX,posY];
}

function getWindowSize(){
	var d= document, root= d.documentElement, body= d.body;
	var wid= window.innerWidth || root.clientWidth || body.clientWidth, 
	hi= window.innerHeight || root.clientHeight || body.clientHeight ;
	return [wid,hi]
}

function emptyChildNodes(node) {
	while (node.lastChild) {
		node.removeChild(node.lastChild);
	}
}

function getRarifiedArray(array) {
	var subRarities = Object.values(subRarityEnum)
    var rarities = Object.values(rarityEnum);
    var rarityMap = new Map();
    for(var i =0; i < rarities.length; i++) {
        var subRarityMap = new Map();
        rarityMap.set(rarities[i], subRarityMap);
        for(var j = 0; j < subRarities.length; j++) {
            subRarityMap.set(subRarities[j], [])
        }
    }
    for(var i = 0; i < array.length; i++) {
        rarityMap.get(array[i].entity.rarity).get(array[i].entity.subRarity).push(array[i]);
    }
    var go;
    do {
        go = false
        var rarityIndex = getRandomRarity(rarityEnum);
        var tempMap = rarityMap.get(rarityIndex)
        for (var [key, value] of tempMap) {
            go = go || (value.length > 0)
        }
    } while(!go)

    do {
        rarityIndex = getRandomRarity(subRarityEnum);
        var result = tempMap.get(rarityIndex)
    } while(result.length < 1)
    return result;
}

function getRandomRarity(enumeration) {
	var rarities = Object.values(enumeration);
	var maxValue = 0;
	for (var i = 0; i < rarities.length; i++) {
		maxValue += rarities[i];
	}
	var rand = Random(0, maxValue);
	var rarity = enumeration.RARE;
	if (rand <= (enumeration.UNCOMMON + enumeration.COMMON) ) {
		rarity = enumeration.UNCOMMON
	}
	if (rand <= enumeration.COMMON) {
		rarity = enumeration.COMMON
	}
	return rarity;
}

function isMonsterInRoom(monster,room, maze) {
	charRoom = maze.getRoomFromChar(monster.CanvasChar);
	return (charRoom.x == room.x && charRoom.y == room.y);
}

function blurElement(showShopGameScreen) {
	document.getElementById(showShopGameScreen).blur();
}

function toggleOldLightRooms(oldLightRooms, newLightRooms, character) {
	/*console.log(oldLightRooms[0])
	console.log(newLightRooms[0])*/
	toUpdate = [].concat(oldLightRooms);
	for (var i = 0; i < newLightRooms.length; i++) {
		remove(toUpdate, newLightRooms[i]);
	}
	for (var i = 0; i < toUpdate.length; i++) {
		toUpdate[i].setRoomInSight(character, false)
	}
}

var typeMap = new Map()

//ENUMS

var timerBooleans = {
	CYCLENEXTACTIVEITEM: 0,
	CYCLEPREVIOUSACTIVEITEM: 1,
	USEACTIVEITEM: 2,
	USEACTIVATABLEENTITY: 3
}

var playerTypes = {
	CHARACTER: 1,
	MONSTER: 2,
	ALLY: 3
}

var rarityEnum = {
    RARE: 5,
    UNCOMMON: 35,
    COMMON: 115,
};

var subRarityEnum = {
	RARE: 1,
	UNCOMMON: 2,
	COMMON: 3
};

var consumableType = {
    SELF: 1,
    ROOM: 2
};

var monsterMovementType = {
	ROAMER: 1,
	PATROLLER: 2
};

var gameStateEnum = {
	VICTORY: 'You exit the labyrinth safely',
	DEFEAT: 'The monster pounces on you, devouring you whole. You are dead',
	CONTINUE: 'Go on',
	PAUSE: 'The Game is paused' 
};

var activatableEntityTypes = {
	ALTAR: 'Altar',
	CAMP: 'Camp',
	END: 'End',
	TREASURE: 'Treasure',
	DOOR: 'Door'
}

var modifierTypes = {
	ADDITIF: 1,
	MULTIPLICATIF: 2
}

var activatableState = {
	ACTIVE: 1,
	UNACTIVE: 2
}

var characterStates = {
	PARALYZED: 1
}

var hostilityEnum = {
	ALLY: 1,
	ENEMY: 2
}

var itemTypeEnum = {
	CONSUMABLE: 1,
	ITEM: 2
}

var durationType = {
	PERMANENT: 1,
	TEMPORARY: 2
}

var equipementEnum = {
	WEAPON: 1,
	ARMOR: 2
}

var handEquipEnum = {
	LEFT: 0,
	RIGHT: 1,
	DOUBLE: 2,
	NONE: 3
}

var damageTypeEnum = {
	BLUNT: 1,
	PIERCING: 2,
	SLASHING: 3
}

var damageElementTypeEnum = {
	BASIC: 1
}