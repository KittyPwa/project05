function Dialogue(rarity, dialogue) {
    this.rarity = rarity;

    this.dialogue = dialogue;
}
typeMap.set('Dialogue', Dialogue)

function getRandomDialogue(dialogueArray) {
    rarifiedArray = []
    for (var i = 0; i < dialogueArray.length; i++) {
        for (var j = 0; j < dialogueArray[i].rarity; j++) {
            rarifiedArray.push(dialogueArray[i].dialogue)
        }
    }
    index = Random(0,rarifiedArray.length - 1);
    return rarifiedArray[index]

}