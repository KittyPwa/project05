function Attribut(attribut = new Endurance(), value, maxValue) {

    this.type = attribut

    this.key = attribut.name

    this.minValue = attribut.minValue

    this.maxValue = maxValue;

    this.modifiedMaxValue = maxValue;

    this.currentValue = value;

    this.critique = false;
}
typeMap.set('Attribut', Attribut)

function Endurance() {
    this.name = 'endurance'

    this.minValue = 0;

    this.consumeAmount = 1;

    this.gainAmount = 0.5;

    //this.gainAmount = 5;

    this.exhausted = false;
}
typeMap.set('Endurance', Endurance)

function Speed() {
    this.name = 'speed'

    this.minValue = 0.5;
}
typeMap.set('Speed', Speed)

function Health() {
    this.name = 'health'

    this.minValue = 0;
}
typeMap.set('Health', Health)