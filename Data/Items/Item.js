function Item(item = new Key()){

    this.key = item.name;

    this.type = item.type;
	
	this.typeName = itemTypeEnum.CONSUMABLE

    this.uses = item.uses;

    this.totalUses = item.uses;

    this.getAmount = function() {
        return this.totalUses;
    }

    this.entity = item;

    this.addEntity = function(quantity) {
        this.totalUses += this.uses * quantity;
    }

    this.useConsumable = function(room,maze) {
        var consumed = false;
        switch(this.type) {
            case consumableType.ROOM: 
                if (this.totalUses > 0) {
                    consumed = this.entity.effect(room, maze, this);
                }
                break;
            default : 
                break;
        }
        return consumed
    }
}
typeMap.set('Item', Item)

function Key() {
    this.name = 'Key';

    this.description = 'A key that opens locks.'

    this.itemType = itemTypeEnum.CONSUMABLE

    this.type = consumableType.ROOM;

    this.rarity = rarityEnum.COMMON;

    this.subRarity = subRarityEnum.COMMON;

    this.uses = 1;

    this.useText = 'You lose '+  this.uses + ' '+this.name

    this.failUseText = 'There\s nothing to use your ' + this.name + ' with';

    this.effect = function(room, maze, consumable) {
        if (room != null && maze != null) {
            if (room.activatableEntity != null && (room.activatableEntity.type == activatableEntityTypes.DOOR || room.activatableEntity.type == activatableEntityTypes.TREASURE)) {
                var Char = gameState.getCharacter()
                var monsters = gameState.getAllMonsters()
                var charRoom = maze.getRoomFromChar(Char.CanvasChar)
                room.activatableEntity.useItemToActivate();
                var retVal = room.activatableEntity.effect(monsters, Char.type, charRoom)
                if (retVal) {
                    addTextToConsole(this.useText);
                    return true;
                }                
            }
        }  
        addTextToConsole(this.failUseText);
        return false;
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

    this.description = 'A strange bust that ressembles nothing coherant at first glance. It could look like... no, not really, perhaps...'

    this.uses = 1;

    this.itemType = itemTypeEnum.CONSUMABLE

    this.type = consumableType.ROOM;

    this.rarity = rarityEnum.RARE;

    this.subRarity = subRarityEnum.RARE;
    
    this.pickupText = this.name + ' x' + this.uses + '. The air is stuffy around it';
	
	this.useText = 'The ' + this.name + ' does not seem to react. You are watched.';

    this.effect = function(room, maze, consumable) {
        addTextToConsole(this.useText);
        return false;
    }

    this.createNew = function() {
        return new IdolBust();
    }

    this.sellPrice = Random(40,65);

    this.buyPrice = this.sellPrice * 10;
}
typeMap.set('IdolBust', IdolBust)

function HealthPotion() {
    this.name = 'Health potion';

    this.uses = 1;

    this.itemType = itemTypeEnum.CONSUMABLE

    this.type = consumableType.ROOM;

    this.rarity = rarityEnum.COMMON;

    this.subRarity = subRarityEnum.COMMON;
    
    this.pickupText = this.name + ' x' + this.uses;
	
    this.useText = 'The ' + this.name + ' goes down your gullet.'

    this.healthAmount = Random(3,9);

    this.description = 'A potion full of red-colored liquid that heals your wounds upon consumption. It heals for ' + this.healthAmount + ' hitpoints.'

    this.usefulUseText = 'You feel your wounds recovering. You gain ' + this.healthAmount + ' HP'

    this.notUsefulUseText = 'Your body is as healthy as it could be. The ' + this.name + ' has no effect on you.'

    this.effect = function(room, maze, consumable) {
        addTextToConsole(this.useText)
        var Char = gameState.getCharacter()
        var oldHealthAmount = Char.health.currentValue
        Char.gainHealth(this.healthAmount)
        if (oldHealthAmount < Char.health.currentValue) {
            addTextToConsole(this.usefulUseText)
        } else {
            addTextToConsole(this.notUsefulUseText)
        }
        return true;
    }

    this.createNew = function() {
        return new HealthPotion();
    }

    this.sellPrice = Random(10,25);

    this.buyPrice = this.sellPrice * 2;
}
typeMap.set('HealthPotion', HealthPotion)

function VigorPotion() {
	this.name = 'Potion of vigor';

    this.uses = 1;

    this.itemType = itemTypeEnum.CONSUMABLE

    this.type = consumableType.ROOM;

    this.rarity = rarityEnum.COMMON;

    this.subRarity = subRarityEnum.COMMON;
    
    this.pickupText = this.name + ' x' + this.uses;
	
    this.useText = 'The ' + this.name + ' goes down your gullet.'

    this.enduranceAmount = Random(25,50);

    this.description = 'A potion full of green-colored liquid that grants energy upon consumption. It grants ' + this.enduranceAmount + ' endurance points.'

    this.usefulUseText = 'You breath comes more easily. You gain ' + this.enduranceAmount + ' endurance points'

    this.notUsefulUseText = 'You aren\'t fatigued. The ' + this.name + ' has no effect on you.'

    this.effect = function(room, maze, consumable) {
        addTextToConsole(this.useText)
        var Char = gameState.getCharacter()
        var oldEnduranceAmount = Char.endurance.currentValue
        Char.gainEndurance(this.enduranceAmount)
        if (oldEnduranceAmount < Char.endurance.currentValue) {
            addTextToConsole(this.usefulUseText)
        } else {
            addTextToConsole(this.notUsefulUseText)
        }
        return true;
    }

    this.createNew = function() {
        return new VigorPotion();
    }

    this.sellPrice = Random(15,35);

    this.buyPrice = this.sellPrice * 2;
}
typeMap.set('VigorPotion', VigorPotion)

function ScrollScrap() {
	
}

function CrypticScroll() {
	
}

function getConsumableArray() {
    var result = [];
    result.push(new Item(new Key()))
    result.push(new Item(new IdolBust()))
    result.push(new Item(new HealthPotion()))
    result.push(new Item(new VigorPotion()))
    return result;
}

function getTreasureConsumableArray() {
    var result = [];
    result.push(new Item(new Key()))
    result.push(new Item(new IdolBust()))
    result.push(new Item(new HealthPotion()))
    result.push(new Item(new VigorPotion()))
    return result;
}

function getRarifiedConsumableArray(consumableArray) {
    return getRarifiedArray(consumableArray);
}

function getConsumableFromRarifiedArray() {
    var consumableArray = getRarifiedConsumableArray(getConsumableArray());
    var rand = Random(0,consumableArray.length-1);
    consumable = new Item(consumableArray[rand].entity.createNew());
    return consumable;
}

//-------------------------ITEM SECTION--------------------------


function ShinyBaubble() {
    this.name = 'Shiny Baubble';

    this.description = 'A shiny trinket that holds no visible use. Perhaps a merchant could want this.'

    this.type = null;

    this.uses = 1;

    this.itemType = itemTypeEnum.ITEM

    this.rarity = rarityEnum.COMMON;

    this.subRarity = subRarityEnum.COMMON;

    this.sellPrice = Random(20,45);

    this.buyPrice = this.sellPrice * 3;

    this.createNew = function() {
        return new ShinyBaubble();
    }

}
typeMap.set('ShinyBaubble', ShinyBaubble)

function Ruby() {

    this.name = 'Ruby';

    this.description = 'A sparkling red gem. The merchant would probably interested in this.'
	
	this.uses = 1;
	
	this.type = null;

    this.itemType = itemTypeEnum.ITEM

    this.rarity = rarityEnum.RARE;

    this.subRarity = subRarityEnum.UNCOMMON;

    this.sellPrice = Random(150,500);

    this.buyPrice = this.sellPrice * 3;

    this.createNew = function() {
        return new Ruby();
    }
    
}
typeMap.set('Ruby', Ruby)

function Sapphire() {

    this.name = 'Sapphire';
    
    this.description = 'A sparkling blue gem. The merchant would probably interested in this.'
    
	this.uses = 1;
	
	this.type = null;
	
    this.itemType = itemTypeEnum.ITEM

    this.rarity = rarityEnum.UNCOMMON;

    this.subRarity = subRarityEnum.COMMON;

    this.sellPrice = Random(75,300);

    this.buyPrice = this.sellPrice * 3;

    this.createNew = function() {
        return new Sapphire();
    }
    
}
typeMap.set('Sapphire', Sapphire)

function DiamondSetVase() {
    this.name = 'Diamond Set Vase';
    
    this.description = 'An old diamond-set vase. The merchant would probably interested in this.'
	
	this.uses = 1;
	
	this.type = null;

    this.itemType = itemTypeEnum.ITEM

    this.rarity = rarityEnum.RARE;

    this.subRarity = subRarityEnum.RARE;

    this.sellPrice = Random(450,700);

    this.buyPrice = this.sellPrice * 3;

    this.createNew = function() {
        return new DiamondSetVase();
    }
}
typeMap.set('DiamondSetVase', DiamondSetVase)

function AncientVase() {
	
    this.name = 'Ancient Vase';
    
    this.description = 'An ancient vase. The merchant would probably interested in this.'
	
	this.uses = 1;
	
	this.type = null;

    this.itemType = itemTypeEnum.ITEM

    this.rarity = rarityEnum.UNCOMMON;

    this.subRarity = subRarityEnum.COMMON;

    this.sellPrice = Random(75,300);

    this.buyPrice = this.sellPrice * 3;

    this.createNew = function() {
        return new AncientVase();
    }
}
typeMap.set('AncientVase', AncientVase)


function getItemArray() {
    var result = [];
    result.push(new Item(new ShinyBaubble()))
	result.push(new Item(new DiamondSetVase()))
	result.push(new Item(new AncientVase()))
    result.push(new Item(new Sapphire()))
    result.push(new Item(new Ruby()))
    result.push(new Item(new HealthPotion()))
    result.push(new Item(new VigorPotion()))
    return result;
}

function getTreasureItemArray() {
    var result = [];
    result.push(new Item(new ShinyBaubble()))
    result.push(new Item(new Sapphire()))
    result.push(new Item(new Ruby()))
    return result;
}

function getRarifiedItemArray(itemArray) {
    return getRarifiedArray(itemArray);
}

function getItemFromRarifiedArray() {
    var itemArray = getRarifiedItemArray(getItemArray());
    var rand = Random(0,itemArray.length-1);
    item = new Item(itemArray[rand].entity.createNew());
    return item;
}

function getItemOrConsumableFromRarifiedArray() {
	var itemArray = getItemArray()
	itemArray = itemArray.concat(getConsumableArray())
	var resultArray = getRarifiedArray(itemArray)
    var rand = Random(0,resultArray.length-1);
    item = new Item(resultArray[rand].entity.createNew());
    return item;
}