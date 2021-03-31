
function player(conf) {

  var tilePos = Phaser.Math.Vector2
  this.sprite = conf.physics.add.sprite(tileSize * (-1 * dungeon.minX) + tileSize/2, tileSize * (dungeon.maxY) + tileSize/2, 'tilesets', 129).setScale(scaling.global* scaling.mobs).refreshBody();

  const offsetX = tileSize / 2;
  const offsetY = tileSize;

  this.sprite.setOrigin(0.5, 1);
  this.sprite.setPosition(
    tilePos.x * tileSize + offsetX,
    tilePos.y * tileSize + offsetY
  );
}
