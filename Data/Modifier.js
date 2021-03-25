function Modifier(key, type, value, duration, elementKey) {
    this.key = key;

    this.elementKey = elementKey;

    this.type = type;

    this.durationType = duration

    this.value = value;
}
typeMap.set('Modifier', Modifier)

function updateWithModifier(modifiers, toUpdate, baseStat, attribut) {
    toUpdate = baseStat;
    for (var i = 0; i < modifiers.length; i++) {
        if (modifiers[i].key == attribut.key) {
            switch(modifiers[i].type) {
                case modifierTypes.ADDITIF :
                    toUpdate = (toUpdate + modifiers[i].value > attribut.minValue) ? toUpdate + modifiers[i].value : attribut.minValue;
                    break;
                case modifierTypes.MULTIPLICATIF :
                    toUpdate = (toUpdate * modifierTypes[i].value > attribut.minValue) ? toUpdate * modifierTypes[i].value : attribut.minValue;
                    break;
                default :
                    break;
            }
        }
    }
    return toUpdate;

}