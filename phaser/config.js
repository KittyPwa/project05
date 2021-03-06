var imageBank  = {
    wall: 1028,
    tile: 967,
    character: 129,
}
var scaling = {
    global: 0.25,
    mobs: 0.75,
}
var tileSize= scaling.global * 32;
var movespeed = scaling.global * 160;
var config = {
    type: Phaser.AUTO,
    width: 3000,
    height: 3000,
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'phaser/assets/sky.png');
    this.load.image('ground', 'phaser/assets/platform.png');
    this.load.image('star', 'phaser/assets/star.png');
    this.load.image('bomb', 'phaser/assets/bomb.png');
    this.load.spritesheet('dude', 'phaser/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('tilesets', 'phaser/assets/tilesets.png', { frameWidth: 32, frameHeight:32});
}

function create ()
{
    let walls = this.physics.add.staticGroup();
    let tiles = this.physics.add.staticGroup();
    let todraw = Object.values(DB.getSpots())
    for(let i = 0; i <= dungeon.maxX - dungeon.minX; i++) {
        for(let j = 0; j <= dungeon.maxY - dungeon.minY; j++) {
            let x = i + dungeon.minX;
            let y = -j + dungeon.maxY;
            let spotOrRoom = DB.getSpot(x, y)                
            if(spotOrRoom) {
                if(spotOrRoom.isSpot) {
                    tiles.create(tileSize * i + tileSize/2, 1*(tileSize * j) + tileSize/2, 'tilesets', imageBank.tile).setScale(scaling.global).refreshBody();
                } else {
                    walls.create(tileSize * i+ tileSize/2, 1*(tileSize * j)+ tileSize/2, 'tilesets', imageBank.wall).setScale(scaling.global).refreshBody();
                }
                //this.add.text(tileSize * i+ tileSize/2 - 15, 1*(tileSize * j)+ tileSize/2,spotOrRoom.id, {fontSize: "9px"});

            }
        }
    }
    


    player = new player(this);
    player = this.physics.add.sprite(tileSize * (-1 * dungeon.minX) + tileSize/2, tileSize * (dungeon.maxY) + tileSize/2, 'tilesets', 129).setScale(scaling.global* scaling.mobs).refreshBody();

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis

    //  Collide the player and the stars with the platforms
    //this.physics.add.collider(player.sprite, walls);
    this.physics.add.collider(player, walls);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
}

function update ()
{
    let xvelocity = 0;
    let yvelocity = 0;
    if (cursors.left.isDown)
    {    
        xvelocity -= (movespeed)

    }
    if (cursors.right.isDown)
    {
        xvelocity += (movespeed)

    }
    if (cursors.up.isDown)
    {
        yvelocity -= (movespeed)

    }
    if (cursors.down.isDown)
    {
        yvelocity += (movespeed)

    }
    if (!cursors.left.isDown && !cursors.right.isDown) {
        xvelocity = 0

    }
    if (!cursors.up.isDown && !cursors.down.isDown) {
        yvelocity = 0
    }
    /*else {
        player.setVelocityX(0)
        player.setVelocityY(0);        

        player.anims.play('turn');
    }*/
        player.setVelocityX(xvelocity);
        player.setVelocityY(yvelocity);
        /*player.sprite.setVelocityX(xvelocity);
        player.sprite.setVelocityY(yvelocity);*/

        // player.anims.play('turn',true);
        

}
