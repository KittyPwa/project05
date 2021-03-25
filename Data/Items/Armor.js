function Armor(id, name, defense){
	this.type = equipementEnum.ARMOR;

	this.id = id;

	this.name = name;

	this.defense = defense;

	this.effects = [];

	this.addEffect = function(effect) {
		this.effects.append(effect);
	}
}
typeMap.set('Armor', Armor)