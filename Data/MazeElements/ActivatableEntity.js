function ActivatableEntity(entity = new End()) {

    this.entity = entity;

    this.key = entity.name;

    this.UsedItemToActivate = false;

    this.useItemToActivate = function() {
        this.UsedItemToActivate = true;
    }

    this.type = entity.type;


    this.effect = function(monsters, char, room) {
        var result = false;
        if (this.activatableState == activatableState.ACTIVE) {
            if (this.entity.itemToActivate != null && !this.UsedItemToActivate) {
                var item = char.items.has(this.entity.itemToActivate.key) ? char.items.get(this.entity.itemToActivate.key) : null;
                if (item != null) {
                    this.useItemToActivate();
                    char.useItem(room, gameState.maze, item)
                } else {
                    addTextToConsole(this.entity.failUse);
                }
            } else {
                 result = this.entity.effect(monsters, char, room);
                if (result) {
                    this.deactivateEntity()
                }
            }
        }
        return result;

    }

    this.discoverEntity = function() {
        this.discovered = true;
        addTextToConsole(this.entity.discoveryText);
    }

    this.deactivateEntity = function() {
        this.activatableState = activatableState.UNACTIVE;
    }

    this.activatableState = activatableState.ACTIVE;

    this.discovered = false;
}
typeMap.set('ActivatableEntity', ActivatableEntity)

function End() {
	this.name = 'Exit';
	
	this.discoveryText = 'You have discovered the ' + this.name;
	
    this.useText = 'You enter the portal leaving behind the dangers of the maze';
    
    this.itemToActivate = null

    this.type = activatableEntityTypes.END
	
	this.effect = function(monsters, char, room) {
        addTextToConsole(this.useText);
        gameState.state = gameStateEnum.VICTORY;
    }
	
	this.createNew = function() {
        return new End();
    }
}
typeMap.set('End', End)

function TreasureChest() {
    this.name = 'Treasure Chest';
    
    this.rarity = rarityEnum.COMMON;

    this.subRarity = subRarityEnum.COMMON;
	
	this.treasure = new Treasure();
	
	this.treasure.createAndAssignAmounts(gameDifficulty);
	
	this.discoveryText = 'You have discovered a ' + this.name;
	
    this.useText = 'The ' + this.name + ' opens with a clink to reveal what\'s inside';

    this.failUse = 'The ' + this.name + ' fails to open without a key';
    
    this.itemToActivate = new Item(new Key())

    this.type = activatableEntityTypes.TREASURE
	
	this.effect = function(monsters, char, room) {
        addTextToConsole(this.useText);
        consumable = char.items.get(this.itemToActivate.key)
        for (var i = 0; i < this.treasure.items.length; i++) {
			char.addItem(this.treasure.items[i]);
		}
        char.addGold(this.treasure.goldAmount);
        return true;
    }
	
	this.createNew = function() {
        return new TreasureChest();
    }
}
typeMap.set('TreasureChest', TreasureChest)

function Door() {
	
	this.name = 'Door'
	
	this.discoveryText = 'You have discovered a ' + this.name;
	
	this.useText = 'The ' + this.name + ' opens without a sound';
	
    this.failUse = 'The ' + this.name + ' fails to open without a key';
    
    this.itemToActivate = new Item(new Key())

    this.type = activatableEntityTypes.DOOR
	
	this.effect = function(monsters, char, room) {
        consumable = char.items.get(this.itemToActivate.key)
        for (var i = 0; i < room.doors.length; i++) {
            if (room.doors[i] != null && !room.doors[i]) {
                var otherRoom = getIJFromRoom(room.x, room.y, i, room.n - 1)
                gameState.maze.openDoors(room.x, room.y, otherRoom[0], otherRoom[1],i)
                gameState.maze.Rooms[otherRoom[0]][otherRoom[1]].activatableEntity.discovered = true; 
                gameState.maze.Rooms[otherRoom[0]][otherRoom[1]].activatableEntity.deactivateEntity(); 
                addTextToConsole(this.useText);
            }
        }
        return true;
    }
		
    
	
	this.createNew = function() {
        return new Door();
    }
}
typeMap.set('Door', Door)


function AltarOfTheThunderLord() {

    this.name = 'Altar to the Thunder Lord';

    this.type = activatableEntityTypes.ALTAR

    this.discoveryText = 'You have discovered an ' + this.type;

    this.dialoguesUseText = [];
    this.dialoguesUseText.push(new Dialogue(rarityEnum.COMMON,'The ' + this.name + ' hums to life.\'I will hold them back for a while, run now mortal.\''));
    this.dialoguesUseText.push(new Dialogue(rarityEnum.COMMON,'The ' + this.name + ' hums to life.\'Run along now mortal, they will remain static.\''));
    this.dialoguesUseText.push(new Dialogue(rarityEnum.UNCOMMON,'The ' + this.name + ' hums to life.\'They won\'t hunt you for a moment still. Does She help you as much as I do?\''));
    this.dialoguesUseText.push(new Dialogue(rarityEnum.UNCOMMON,'The ' + this.name + ' hums to life.\'So powerless, yet so quick on yout feet. To think that I was so, once upon a time...\''));
    this.dialoguesUseText.push(new Dialogue(rarityEnum.RARE,'The ' + this.name + ' hums to life.\'Fine, mortal, I\'ll keep them still. Perhaps, then, She might forgive me.\''));

    this.useText = 'The ' + this.name + ' hums to life.\'I will hold them back for a while, run now mortal.\'';

    this.endEffectText = '\'Mortal, my powers bind them no longer, beware!\''

    this.effectDuration = Random(2000,5000);

    this.itemToActivate = null
    
    this.effect = function(monsters, char, room) {
        addTextToConsole(getRandomDialogue(this.dialoguesUseText));
        for (var i = 0; i < monsters.length; i++) {
            monsters[i].addState(characterStates.PARALYZED);
            this.reactivateMonsters(monsters[i]);
        }
        var entity = this;
        setTimeout(function() {
            addTextToConsole(entity.endEffectText);
        }, this.effectDuration, entity);
        return true;
    }

    this.reactivateMonsters = function(monster) {
        setTimeout(function() {
            monster.removeState(characterStates.PARALYZED);
        }, this.effectDuration, monster)
    }

    this.rarity = rarityEnum.COMMON;

    this.subRarity = subRarityEnum.COMMON;

    this.createNew = function() {
        return new AltarOfTheThunderLord();
    }
}
typeMap.set('AltarOfTheThunderLord', AltarOfTheThunderLord)

function AltarOfTheOldKnight() {

    this.name = 'Altar to the Old Knight';

    this.type = activatableEntityTypes.ALTAR

    this.discoveryText = 'You have discovered an ' + this.type;

    this.itemToActivate = null

    this.dialoguesUseText = [];
    this.dialoguesUseText.push(new Dialogue(rarityEnum.COMMON, 'The ' + this.name + ' hums to life.\'Every challenge is an opportunity to learn. Let this one be no different.\''))
    this.dialoguesUseText.push(new Dialogue(rarityEnum.UNCOMMON, 'The ' + this.name + ' hums to life.\'You remind me of another, a long time ago. I\'ll give you the same opportunity, use it wisely.\''))
    this.dialoguesUseText.push(new Dialogue(rarityEnum.COMMON, 'The ' + this.name + ' hums to life.\'Ah youth... So quick to take action, thinking too little of the consequences. So be it.\''))
    this.dialoguesUseText.push(new Dialogue(rarityEnum.UNCOMMON, 'The ' + this.name + ' hums to life.\'Was I ever this foolhardy? Perhaps. Make mistakes, young one.\''))
    this.dialoguesUseText.push(new Dialogue(rarityEnum.RARE, 'The ' + this.name + ' hums to life.\'Elric, boy, is that you ? No, time has muddled my senses... Take this, be gone and survive.\''))
    
    this.effectModifier = new Modifier(new Speed().name, modifierTypes.ADDITIF, 0.25, durationType.PERMANENT, new Speed().name);
    
    this.effect = function(monsters, char, room) {
        addTextToConsole(getRandomDialogue(this.dialoguesUseText));
        for (var i =0; i < monsters.length; i++) {
            monsters[i].addModifier(this.effectModifier);
            monsters[i].speed.modifiedMaxValue = updateWithModifier(monsters[i].modifiers, monsters[i].speed.modifiedMaxValue, monsters[i].speed.maxValue, new Attribut(new Speed()))
            monsters[i].CanvasChar.updateStatsFromChar(monsters[i].speed.modifiedMaxValue)
        }
        goldAmount = Random(25,50)
        char.addGold(goldAmount)
        return true;
	}

    this.rarity = rarityEnum.COMMON;

    this.subRarity = subRarityEnum.UNCOMMON;

    this.createNew = function() {
        return new AltarOfTheOldKnight();
    }
}
typeMap.set('AltarOfTheOldKnight', AltarOfTheOldKnight)

function AltarOfTheFrostQueen() {

    this.name = 'Frost Queen\'s altar';

    this.type = activatableEntityTypes.ALTAR

    this.discoveryText = 'You have discovered an ' + this.type;

    this.itemToActivate = null

    this.dialoguesUseText = [];
    this.dialoguesUseText.push(new Dialogue(rarityEnum.COMMON, 'The ' + this.name + ' hums to life.\'Grace given must always be repaid. Use this wisely.\''))
    this.dialoguesUseText.push(new Dialogue(rarityEnum.COMMON, 'The ' + this.name + ' hums to life.\'With this, those beasts will find it more difficult to hunt you. May your steps be swift, hunter.\''))
    this.dialoguesUseText.push(new Dialogue(rarityEnum.UNCOMMON, 'The ' + this.name + ' hums to life.\'Raw strength means nothing if you cannot achieve your goals. Tread silently.\''))
    this.dialoguesUseText.push(new Dialogue(rarityEnum.UNCOMMON, 'The ' + this.name + ' hums to life.\'As my old mentor once told me, think long before every move - it could be your last.\''))
    this.dialoguesUseText.push(new Dialogue(rarityEnum.RARE, 'The ' + this.name + ' hums to life.\'If you meet that savage one day, tell Him not to come and find me lest he wants a blade between his ribs.\''))

    

    this.effectModifier = new Modifier(new Speed().name, modifierTypes.ADDITIF, -1 * (Random(5,15) / 10), durationType.PERMANENT, new Speed().name);
    
    this.effect = function(monsters, char, room) {
        addTextToConsole(getRandomDialogue(this.dialoguesUseText));
        for (var i =0; i < monsters.length; i++) {
            monsters[i].addModifier(this.effectModifier);
            monsters[i].speed.modifiedMaxValue = updateWithModifier(monsters[i].modifiers,monsters[i].speed.modifiedMaxValue, monsters[i].speed.maxValue, new Attribut(new Speed()))
            monsters[i].CanvasChar.updateStatsFromChar(monsters[i].speed.modifiedMaxValue)
        }
        return true;
	}

    this.rarity = rarityEnum.COMMON;

    this.subRarity = subRarityEnum.COMMON;

    this.createNew = function() {
        return new AltarOfTheFrostQueen();
    }
}
typeMap.set('AltarOfTheFrostQueen', AltarOfTheFrostQueen)

function ShadowHunterCamp() {

    this.name = 'Shadow hunter camp';

    this.type = activatableEntityTypes.CAMP

    this.price = Random(100,150);
	
    this.rarity = rarityEnum.RARE;
    
    this.subRarity = subRarityEnum.COMMON;

    this.discoveryText = 'You have discovered a ' + this.name + '. For ' + this.price + ' gold pieces, they will hunt a beast.'

    this.successUseText = 'The hunters pocket your coins and go on their way, weapons at the ready';

    this.failureUseText = '\'Do you jest? We work for ' + this.price + ' no less.\' The hunters retreat in the darkness.'

    this.shadowHunterSpeed = charSpeed / 2

    this.itemToActivate = null
    
    this.effect = function(monsters, char, room) {
        if (char.goldAmount < this.price) {
            addTextToConsole(this.failureUseText);
            return false;
        } else {
            char.removeGold(this.price);
            var type = monsterMovementType.ROAMER;
            entity = new ShadowHunter(type)
            shadowHunter = new Character(radius, 'yellow', this.shadowHunterSpeed, entity);
            gameState.addAlly(shadowHunter)
            updateVisuals([shadowHunter])
            return true;
        }
	}

    this.reactivateMonsters = function(monster) {
        setTimeout(function() {
            monster.removeState(characterStates.PARALYZED);
        }, this.effectDuration, monster)
    }

    this.createNew = function() {
        return new ShadowHunterCamp();
    }
}
typeMap.set('ShadowHunterCamp', ShadowHunterCamp)

function getActivatableEntityArray () {
    var array = [];
    array.push(new ActivatableEntity(new AltarOfTheThunderLord()));
    array.push(new ActivatableEntity(new ShadowHunterCamp()));
    array.push(new ActivatableEntity(new AltarOfTheFrostQueen()));
    array.push(new ActivatableEntity(new AltarOfTheOldKnight()));
    return array;
}

function getRarifiedActivatableEntityArray(array) {
    return getRarifiedArray(array);
}

function getActivatableEntityFromRarifiedArray() {
    array = getRarifiedActivatableEntityArray(getActivatableEntityArray())
    var randomIndex = Random(0, array.length-1);
    return new ActivatableEntity(array[randomIndex].entity.createNew());
}