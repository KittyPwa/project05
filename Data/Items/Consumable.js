function Consumable(consumable){

    this.key = consumable.name;

    this.type = consumable.type;
	
	this.typeName = itemTypeEnum.CONSUMABLE

    this.uses = consumable.uses;

    this.totalUses = consumable.uses;

    this.getAmount = function() {
        return this.totalUses;
    }

    this.entity = consumable;

    this.addEntity = function(quantity) {
        this.totalUses += this.uses * quantity;
    }

    this.useConsumable = function(room,maze) {
        switch(this.type) {
            case consumableType.ROOM: 
                if (this.totalUses > 0) {
                    consumable.effect(room, maze, this);
                }
                break;
            default : 
                break;
        }
        
    }
}
typeMap.set('Consumable', Consumable)

function Key() {
    this.name = 'Key';

    this.type = consumableType.ROOM;

    this.rarity = rarityEnum.COMMON;

    this.subRarity = subRarityEnum.COMMON;

    this.uses = 1;

    this.useText = 'The key enters the lock, you lose a key'

    this.effect = function(room, maze, consumable) {
        for (var i = 0; i < room.doors.length; i++) {
            if (room.doors[i] != null && !room.doors[i]) {
                var otherRoom = getIJFromRoom(room.x, room.y, i, maze.n - 1)
                maze.openDoors(room.x, room.y, otherRoom[0], otherRoom[1],i) 
                consumable.totalUses --;
                addTextToConsole(this.useText);
            }
        }
    }

    this.createNew = function() {
        return new Key();
    }

    this.sellPrice = Random(10,25);

    this.buyPrice = this.sellPrice * 4;
}
typeMap.set('Key', Key)

function IdolBust() {
    this.name = 'Strange idol';

    this.uses = 1;

    this.type = consumableType.ROOM;

    this.rarity = rarityEnum.RARE;

    this.subRarity = subRarityEnum.RARE;
    
    this.pickupText = this.name + ' x' + this.uses + '. The air is stuffy around it';

    //this.useText = 'The ' + this.name + ' melts into your hands and an ominous voice hisses into your ears : \'Sacrifice accepted\'';
	
	this.useText = 'The ' + this.name + ' does not seem to react. You are watched.';

    this.effect = function() {
		addTextToConsole(this.useText)
    }

    this.createNew = function() {
        return new IdolBust();
    }

    this.sellPrice = Random(40,65);

    this.buyPrice = this.sellPrice * 10;
}
typeMap.set('IdolBust', IdolBust)

function getConsumableArray() {
    var result = [];
    result.push(new Consumable(new Key()))
    result.push(new Consumable(new IdolBust()))
    return result;
}

function getTreasureConsumableArray() {
    var result = [];
    result.push(new Consumable(new Key()))
    result.push(new Consumable(new IdolBust()))
    return result;
}

function getRarifiedConsumableArray(consumableArray) {
    return getRarifiedArray(consumableArray);
}

function getConsumableFromRarifiedArray() {
    var consumableArray = getRarifiedConsumableArray(getConsumableArray());
    var rand = Random(0,consumableArray.length-1);
    consumable = new Consumable(consumableArray[rand].entity.createNew());
    return consumable;
}

