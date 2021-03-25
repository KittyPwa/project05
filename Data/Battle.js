function Battle(participants) {

    this.participants = participants;

    this.getParticipants = function() {
        return this.participants
    }

    this.removeParticipant = function(participant) {
        remove(this.participants, participant);
    }

    this.participantTimers = new Map()

    this.addTimer = function(participant) {
        var battleTimer = new BattleTimer();
        this.participantTimers.set(participant, battleTimer)
    }

    for (var i = 0; i < this.participants.length; i++) {
        this.addTimer(this.participants[i])
    }

    this.clash = function(foe, attacker) {
        if (!foe.type.toBeRemoved) {
            var weapons = attacker.equipements.getAllEquipementType(equipementEnum.WEAPON)
            for (var i = 0; i < weapons.length; i++){
                if (this.participantTimers.get(attacker).timers[weapons[i].entity.equipHands]) {
                    this.participantTimers.get(attacker).timers[weapons[i].entity.equipHands] = false;
                    addTextToConsole(attacker.type.name + ' strikes with ' + weapons[i].name + ' for : ' + weapons[i].getDamage() + ' damage to ' + foe.type.name);
                    this.recieveDamage(foe, weapons[i])
                    var timer = this.participantTimers.get(attacker).timers[weapons[i].type.equipHands]
                    setTimeout(function() {	
                        timer = true;
                    }, weapons[i].type.attackSpeed, timer);
                }
            }
        }
    }
    
    this.recieveDamage = function(damaged, weapon) {
        var damage = weapon.getDamage()
		damaged.loseHealth(damage)
		if (damaged.health.currentValue <= 0) {
			damaged.type.toBeRemoved = true;
        }
    }
    
}

function RealTimeConflicts() {
    this.conflicts = new Map();

    this.hasConflict = function(participants) {
        var has = true;
        for (var i = 0; i < participants.length; i++) {
            has = has && this.conflicts.has(participants[i])
        }
        return has
    }

    this.addConflict = function(participants) {
        var battle = new Battle(participants)
        for (var i = 0; i < participants.length; i++) {
            if (this.conflicts.has(participants[i])) {
                battle = this.conflicts.has(participants[i])
            }
            
        }
        for (var i = 0; i < participants.length; i++) {
            if (!this.conflicts.has(participants[i])) {
                this.conflicts.set(participants[i], battle)
            }
        }
    }

    this.removeConflict = function(participants) {
        for (var i = 0; i < participants.length; i++) {
            if (this.conflicts.has(participants[i])) {
                this.conflicts.delete(participants[i])
            }
        }
    }

    this.getBattle = function(participant) {
        return this.conflicts.get(participant)
    }
}