function Trap(trap = new FrostTrap()) {
    
    this.entity = trap;

    this.key = trap.name;

    this.useAmount = trap.useAmount;

    this.totalUseAmount = this.useAmount

    this.activatable = true;

    this.hostilityType = hostilityEnum.ENEMY

    this.effect = function(affected) {
        if (this.activatable) {
            this.entity.effect(affected);
            this.totalUseAmount--;
            if (this.totalUseAmount == 0) {
                this.activatable = false;
            }
        }
    }
}
typeMap.set('Trap', Trap)

function FrostTrap() {
    
    this.name = 'Frost trap'

    this.rarity = rarityEnum.COMMON;
    
    this.subRarity = subRarityEnum.COMMON;

    this.effectModifier = new Modifier(new Speed().name, modifierTypes.ADDITIF, -1 * (Random(10,25) / 10), durationType.TEMPORARY, new Speed().name);

    this.launchText = 'The frost trap snaps shut! You feel your movements slow down under the effects of the bitting cold'

    this.useAmount = 1;

    this.effect = function(affected) {
        addTextToConsole(this.launchText);
        affected.addModifier(this.effectModifier);
        affected.speed.modifiedMaxValue = updateWithModifier(affected.modifiers,affected.speed.modifiedMaxValue,affected.speed.maxValue,new Attribut(new Speed()))
        affected.CanvasChar.updateStatsFromChar(affected.speed.modifiedMaxValue)
    }

    this.createNew = function() {
        return new FrostTrap();
    }
}
typeMap.set('FrostTrap', FrostTrap)

function getTrapArray () {
    var array = [];
    array.push(new Trap(new FrostTrap()));
    return array;
}

function getRarifiedTrapArray() {
    return getRarifiedArray(getTrapArray());
}

function getTrapFromRarifiedArray() {
    array = getRarifiedTrapArray()
    var randomIndex = Random(0, array.length-1);
    return new Trap(array[randomIndex].entity.createNew());
}