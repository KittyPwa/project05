function Treasure() {

    this.key = 'Treasure Chest'
    
    this.goldAmount = 0;

    this.consumables = []

    this.items = []

    this.createAndAssignAmounts = function(gameDifficulty) {
        var goldAmount = Random(0, (200 + 2*mazeSize)/ gameDifficulty);
        var consumableArray = getRarifiedConsumableArray(getTreasureConsumableArray());
        var itemArray = getRarifiedItemArray(getItemArray());
        var consumablesAmount = Random(0, (mazeSize / 5) / gameDifficulty);
        var itemsAmount = Random(0, (mazeSize / 5) / gameDifficulty);
        for (var i = 0; i < consumablesAmount; i++) {
            consumableIndex = Random(0, consumableArray.length - 1);
            consumable = new Item(consumableArray[consumableIndex].entity.createNew())
            this.consumables.push(consumable) 
        }
        for (var i = 0; i < itemsAmount; i++) {
            itemIndex = Random(0, itemArray.length - 1);
            item = new Item(itemArray[itemIndex].entity.createNew())
            this.items.push(item) 
        }
        this.goldAmount = goldAmount;
    }
}
typeMap.set('Treasure', Treasure)