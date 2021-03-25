function storeData() {
  localStorage.clear();
  storeArmors();
  storeWeapons();
  storeCharacters();
}

function storeCharacters() {
  store(new Entity(1,'Tom'));
  store(new Entity(2,'Chad'));
  store(new Entity(3, 'Henry'));
  store(new Entity(4, 'Zack'));
}

function storeArmors() {
	store(new Armor(1,'Linnen Hood', 4));
	store(new Armor(2,'Linnen Vest', 10));
	store(new Armor(3,'Linnen Pants', 7));
}

function storeWeapons() {
  store(new Weapon(1,'Iron Dagger', [1,2]));
  store(new Weapon(2,'Iron Sword', [2,5]));
}