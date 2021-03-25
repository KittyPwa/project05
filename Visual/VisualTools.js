function toggleHideAndSelectGame() {
    loadGames()
    toggleHidden(['MainMenu'], ['ChooseGame'])
    selects = document.getElementsByClassName('chooseGame');
    gameStates = game.getAllGameStates()
    for (var i = 0; i < gameStates.length; i++) {
        selects[i].setAttribute('gameId',gameStates[i].id)
        selects[i].setAttribute('value', 'Continue')
    }
}

function toggleHideAndStartGame(gameId) {
    var id = gameId.getAttribute('gameId')
    if (id == 'null') {
        newGame()
    }
    startVars(id)
    gameState.winGame()
    gameState.removeMaze()
    toggleHidden(['ChooseGame'], ['playerInfo','Village','playerConsoleId'])
}

function toggleHiddenAndShowShop() {
    updateMerchant()
    toggleHidden(['Village','showShopGameScreen'], ['shopTable','playerConsoleId'])
}

function toggleHiddenAndReturnShop() {
    toggleHidden(['playerInfo','GameScreen', 'canvasId'],['shopTable'])
}

function toggleHiddenAndStartMaze() {
    initializeGame()
    toggleHidden(['Village'], ['GameScreen','canvasId'])
    startGame();
}

function toggleHiddenAndVillage() {
    toggleHidden(['canvasId','showShopGameScreen', 'GameScreen'], ['Village','playerConsoleId'])
}

function loadImgs() {
    var base_image = new Image();
    //ITEMS
    base_image.src = 'Visual/img/key.png';
    imageBase.putImg(new Item(new Key()).key, base_image);
    var base_image = new Image();
    base_image.src = 'Visual/img/AncientVase.png';
    imageBase.putImg(new Item(new AncientVase()).key, base_image);
    var base_image = new Image();
    base_image.src = 'Visual/img/diamondVase.png';
    imageBase.putImg(new Item(new DiamondSetVase()).key, base_image);
    var base_image = new Image();
    base_image.src = 'Visual/img/shinyBauble.png';
    imageBase.putImg(new Item(new ShinyBaubble()).key, base_image);
    var base_image = new Image();
    base_image.src = 'Visual/img/Rubis.png';
    imageBase.putImg(new Item(new Ruby()).key, base_image);
    var base_image = new Image();
    base_image.src = 'Visual/img/Sapphire.png';
    imageBase.putImg(new Item(new Sapphire()).key, base_image);
    var base_image = new Image();
    base_image.src = 'Visual/img/healingPotion.png';
    imageBase.putImg(new Item(new HealthPotion()).key, base_image);
    var base_image = new Image();
    base_image.src = 'Visual/img/vigorPotion.png';
    imageBase.putImg(new Item(new VigorPotion()).key, base_image);
    //ACTIVATABLE ENTITIES
    var base_image = new Image();
    base_image.src = 'Visual/img/Chest.png';
    imageBase.putImg(activatableState.ACTIVE + ' ' + new ActivatableEntity(new TreasureChest()).type, base_image);
    var base_image = new Image();
    base_image.src = 'Visual/img/openChest.png';
    imageBase.putImg(activatableState.UNACTIVE + ' ' + new ActivatableEntity(new TreasureChest()).key, base_image);
    var base_image = new Image();
    base_image.src = 'Visual/img/altar.png';
    imageBase.putImg(activatableState.ACTIVE + ' ' + activatableEntityTypes.ALTAR, base_image);
    var base_image = new Image();
    base_image.src = 'Visual/img/oldKnightsAltar.png';
    imageBase.putImg(activatableState.UNACTIVE + ' ' + new ActivatableEntity(new AltarOfTheOldKnight()).key, base_image);
    var base_image = new Image();
    base_image.src = 'Visual/img/oldKnightsAltar.png';
    imageBase.putImg(activatableState.UNACTIVE + ' ' + new ActivatableEntity(new AltarOfTheThunderLord()).key, base_image);
    //PASSIVE ENTITIES
    var base_image = new Image();
    base_image.src = 'Visual/img/darkPortal.png';
    imageBase.putImg(new PassiveEntity(new DarkPortal()).key, base_image);
}

function updateMerchant() {
    var shopHead = document.getElementsByClassName('shopHead')[0];
    var parentNode = shopHead.parentNode;
    var trToDelete = parentNode.getElementsByClassName('itemTr');
    for (var i = 0; i < trToDelete.length; i++) {
        emptyChildNodes(trToDelete[i])
    }
    var tableCloned = document.getElementById('shopTrToClone');
    var elem;
    var itemsMap = shop.getMapFromKey(itemTypeEnum.CONSUMABLE);
    Char = gameState.getCharacter()
    for (var [key,value] of itemsMap) {
        playerQty = Char.type.items.has(key) ? Char.type.items.get(key).getAmount() : 0
        if (playerQty > 0 || value.quantity > 0) {
            elem = tableCloned.cloneNode(true);
            elem.id = ''
           

            elemType = elem.getElementsByClassName('itemKey')[0];
            textNode = document.createTextNode(itemTypeEnum.CONSUMABLE)
            elemType.appendChild(textNode)

            elemImageTd = elem.getElementsByClassName('itemImage')[0];
            var itemImage = imageBase.getImg(key)
            var itemImageSrc = itemImage.getAttribute('src')
            elemImageTd.setAttribute('src', itemImageSrc);
            elemImageTd.setAttribute('key', key);
            updateImage(elemImageTd, value.item)
           

            elemQty = elem.getElementsByClassName('itemQuantity')[0];
            textNode = document.createTextNode(value.quantity)
            elemQty.appendChild(textNode)

            elemBuyPrice = elem.getElementsByClassName('itemBuy')[0].getElementsByClassName('submitAction')[0];
            elemBuyPrice.value = value.item.entity.buyPrice;
            
            elemSellPrice = elem.getElementsByClassName('itemSell')[0].getElementsByClassName('submitAction')[0];
            elemSellPrice.value = value.item.entity.sellPrice;

            itemPlayerQuantity = elem.getElementsByClassName('itemPlayerQuantity')[0];
            textNode = document.createTextNode(playerQty)
            itemPlayerQuantity.appendChild(textNode)

            parentNode.insertBefore(elem,shopHead.nextSibling);
        }
    }
    var merchantGold = document.getElementById("merchantGold");
    textNode = document.createTextNode(shop.merchantGold);
    emptyChildNodes(merchantGold)
    merchantGold.appendChild(textNode)

    var playerGold = document.getElementById("playerGold");
    textNode = document.createTextNode(Char.type.goldAmount);
    emptyChildNodes(playerGold)
    playerGold.appendChild(textNode)
}

function updateImage(node, value) {
    var tempNode = document.createElement("div")
    var cardCloned = document.getElementById('cardToClone')
    cardElem = cardCloned.cloneNode(true);
    cardElem.id = ''

    itemName = cardElem.getElementsByClassName('itemName')[0];
    itemName.innerText = value.entity.name
    itemDescription = cardElem.getElementsByClassName('itemDescription')[0];
    itemDescription.innerText = value.entity.description
    
    emptyNode(tempNode)
    tempNode.appendChild(cardElem)
    node.setAttribute('title', tempNode.innerHTML)
    node.removeAttribute('data-original-title')
    activateTooltip()
}

function toggleHidden(hideArrayStr, showArrayStr) {
    var hideArray = [];
    for (var i = 0; i < hideArrayStr.length; i++) {	
        hideArray.push(document.getElementById(hideArrayStr[i]));
    }

    var showArray = [];
    for (var i = 0; i < showArrayStr.length; i++) {
        showArray.push(document.getElementById(showArrayStr[i]));
    }

	for (var i = 0; i < showArray.length; i++) {
        showArray[i].className = showArray[i].className.split("toggleHide").join(' toggleShow ');
    }
	for (var i = 0; i < hideArray.length; i++) {
        hideArray[i].className = hideArray[i].className.split("toggleShow").join(' toggleHide ');
    }
    
}

function setCharacterInfo() {
    var character = gameState.getCharacter()
    var updatableInfo = document.getElementsByClassName('updatableInfo')
    for (var i = 0; i < updatableInfo.length; i++) {
        var attribut = character.attributs.get(updatableInfo[i].getAttribute('name'))
        updatableInfo[i].setAttribute('aria-valuenow',attribut.currentValue)
        updatableInfo[i].setAttribute('aria-valuemin',attribut.minValue)
        updatableInfo[i].setAttribute('aria-valuemax',attribut.maxValue)
    }
}
function updateCharacterInfo() {
    var character = gameState.getCharacter()
    var updatableInfo = document.getElementsByClassName('updatableInfo')
    for (var i = 0; i < updatableInfo.length; i++) {
        var attribut = character.attributs.get(updatableInfo[i].getAttribute('name'))
        updatableInfo[i].setAttribute('style', 'width: ' + attribut.currentValue / attribut.maxValue * 100 + '%')
        if (attribut.critique) {
            if (updatableInfo[i].className.split("bg-info").length > 1) {
                updatableInfo[i].className = updatableInfo[i].className.split("bg-info").join(' bg-danger ');
            }
        } else {
            if (updatableInfo[i].className.split("bg-danger").length > 1) {
                updatableInfo[i].className = updatableInfo[i].className.split("bg-danger").join(' bg-info ');
            }
        }
        var currentValue = updatableInfo[i].parentNode.getElementsByClassName('currentValue')[0]
        currentValue.innerHTML = attribut.currentValue
        var maxValue = updatableInfo[i].parentNode.getElementsByClassName('maxValue')[0]
        maxValue.innerHTML = attribut.maxValue
        var goldAmount = document.getElementById('goldAmount')
        goldAmount.innerHTML = character.type.goldAmount
        
        var currentValue = updatableInfo[i].parentNode.getElementsByClassName('currentValue')[0]
        currentValue.innerHTML = attribut.currentValue
        var maxValue = updatableInfo[i].parentNode.getElementsByClassName('maxValue')[0]
        maxValue.innerHTML = attribut.maxValue
    }
}

function updateActiveItem() {
    var character = gameState.getCharacter()
    var oldactivatebleItem = document.getElementById('activeItem')
    var activatebleItem = oldactivatebleItem.cloneNode(true);
    var parentNode = oldactivatebleItem.parentNode;
    parentNode.replaceChild(activatebleItem, oldactivatebleItem)
    var activeItemAmount = document.getElementById('activeItemAmount')
    var activeItem = character.type.activeItem
    if (activeItem != null) {
        toggleHidden([],['activeItem'])
        var itemImage = imageBase.getImg(activeItem.key)
        var itemImageSrc = itemImage.getAttribute('src')
        activatebleItem.setAttribute('src', itemImageSrc);
        updateImage(activatebleItem, activeItem)
        activeItemAmount.innerText = ' x' + activeItem.totalUses;
    } else {
        toggleHidden(['activeItem'], [])
        activeItemAmount.innerText = 'No Item'
    }
    activateTooltip()
}

function activateTooltip() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
}

function emptyNode(myNode) {
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}