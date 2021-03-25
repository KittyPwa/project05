function Equipements(entity) {

    this.equipements = new Map();

    this.addWeapon = function(hand, equipement) {
        this.equipements.set(hand, equipement)
    }

    this.addArmor = function(bodyPart, equipement) {
        this.equipements.set(bodyPart, equipement)
    }

    this.getAllEquipementType = function(type) {
        var equipements = [];
        var entries = this.equipements.entries();
        var entry = entries.next()
        while(!entry.done) {
            if (entry.value[1].type == type) {
                equipements.push(entry.value[1])
            }
            entry = entries.next()
        }
        return equipements
    }
	
	//WEAPONS
	this.getTotalAttackSpeed = function() {
		var weapons = this.getAllEquipementType(equipementEnum.WEAPON)
		var attackSpeed = 0;
		for (var i = 0; i < weapons.length; i++) {
			attackSpeed += weapons[i].entity.attackSpeed
		}
		return attackSpeed / weapons.length
	}

    this.getTotalDamage = function() {
        var weapons = this.getAllEquipementType(equipementEnum.WEAPON)
        var totalDamage = 0;
        for (var i = 0; i < weapons.length; i++) {
            totalDamage += weapons[i].getDamage()
        }
        return totalDamage
    }

}
typeMap.set('Equipements', Equipements)