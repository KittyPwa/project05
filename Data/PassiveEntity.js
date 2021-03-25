function PassiveEntity(entity = new DarkPortal()) {

    this.entity = entity;

    this.key = entity.name;

    this.UsedItemToActivate = false;

    this.type = entity.type

    this.effect = function(room) {
        if (this.activatableState == activatableState.ACTIVE) {
            this.entity.effect(room, this);
        }
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
typeMap.set('PassiveEntity', PassiveEntity)

function DarkPortal() {

    this.name = 'Dark Portal';

    this.type = activatableEntityTypes.PORTAL

    this.discoveryText = 'You have discovered a ' + this.name;
    
    this.monsterAmount = 2;

    this.effectText = function() {
        return 'From the ' + this.name + ', ' + this.monsterAmount + '  vicious creatures have crept, famished for a thief\'s blood'
    }

    this.effectDuration = Random(30,60) * 1000;
    
    this.effect = function(room, entity) {
        setTimeout(function() {
            if (gameState.state == gameStateEnum.CONTINUE && entity.activatableState == activatableState.ACTIVE) {
                var monsterAmountIncrease = Random(0,1);
                if (monsterAmountIncrease > 0) {
                    addTextToConsole(entity.entity.effectText());
                    for (var i = 0; i < entity.entity.monsterAmount; i++) {
                        var monsterSpeed = Random(1,charSpeed-1);
                        var type = monsterMovementType.ROAMER;
                        var player = new Monster(type)
                        var monster = new Character('red', monsterSpeed, player);
                        gameState.addMonster(monster);
                        monster.updateCanvasChar(room.x,room.y)
                        monster.CanvasChar.teleport(monster.CanvasChar.posX, monster.CanvasChar.posY);
                    }
                }
                entity.entity.monsterAmount += monsterAmountIncrease;
                entity.entity.effectDuration = Random(30,60) * 1000;
                entity.effect(room)
            }
        }, this.effectDuration, entity, room);
	}

    this.rarity = rarityEnum.COMMON;

    this.subRarity = subRarityEnum.UNCOMMON;

    this.createNew = function() {
        return new DarkPortal();
    }
}
typeMap.set('DarkPortal', DarkPortal)

function getPassiveEntityArray () {
    var array = [];
    array.push(new PassiveEntity(new DarkPortal()));
    return array;
}

function getRarifiedPassiveEntityArray(array) {
    return getRarifiedArray(array);
}

function getPassiveEntityFromRarifiedArray() {
    array = getRarifiedPassiveEntityArray(getPassiveEntityArray())
    var randomIndex = Random(0, array.length-1);
    return new PassiveEntity(array[randomIndex].entity.createNew());
}