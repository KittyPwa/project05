var imageBank  = {
    wall: 1028,
    tile: 967,
    character: 129,
}
var scaling = {
    global: 1.5,
    mobs: 0.75,
}
var tileSize= scaling.global * 32;
var movespeed = scaling.global * 160;
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    let todraw = [...Object.values(dungeon.rooms)]
    for(let room of todraw) {
        for(let i = 0; i <= room.maxX - room.minX; i++) {
            for(let j = 0; j <= room.maxY - room.minY; j++) {
                let x = i + room.minX;
                let y = j + room.minY;
                let spotOrRoom = room.getSpot(i + room.minX, j + room.minY)                
                if(spotOrRoom) {
                    if(spotOrRoom.isSpot) {
                        tiles.create(tileSize * i + tileSize/2, tileSize * j + tileSize/2, 'tilesets', imageBank.tile).setScale(scaling.global).refreshBody();
                        //this.add.image(32 * i, 32 * j, 'tilesets', imageBank.tile);
                    } else {
                        walls.create(tileSize * i+ tileSize/2, tileSize * j+ tileSize/2, 'tilesets', imageBank.wall).setScale(scaling.global).refreshBody();
                    }
                }
            }
        }
    }
    


    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    //  Now let's create some ledges
    // The player and its settings
    player = this.physics.add.sprite(tileSize * (-1 * dungeon.minX), tileSize * (-1 * dungeon.minY), 'tilesets', 129).setScale(scaling.global* scaling.mobs).refreshBody();

    //  Player physics properties. Give the little guy a slight bounce.
    //player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
/*    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('tilesets', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'tilesets', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('tilesets', { start: 64, end: 66 }),
        frameRate: 10,
        repeat: -1
    });
*/
    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis

    //  Collide the player and the stars with the platforms
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

        // player.anims.play('turn',true);
        

}
