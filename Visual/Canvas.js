var myGameArea = {
    canvas : document.createElement("canvas"),
	
    start : function() {
        this.canvas.width = CSize;
        this.canvas.height = CSize + 50;
        this.context = this.canvas.getContext("2d");
        this.context.beginPath();
        this.context.strokeStyle = 'black';
        this.context.moveTo(0,0);
        this.context.lineTo(CSize,0);
        this.context.lineTo(CSize,CSize + 50);
        this.context.lineTo(0,CSize + 50);
        this.context.lineTo(0,0);
        this.context.stroke();
        this.canvas.id = "canvasId";
		this.canvas.className = "toggleHide canvas"
        buttonElem = document.getElementById('showShopGameScreen')
        parentNode = buttonElem.parentNode
        parentNode.insertBefore(this.canvas,buttonElem);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function CanvasMaze() {

    this.drawMaze = function() {
        var Maze = gameState.maze
        var roomSize = CSize/Maze.n;
        myGameArea.clear();
        for (var i = 0; i < Maze.n; i++) {
            for (var j = 0; j < Maze.n; j++) {
                Maze.Rooms[i][j].drawRoom(roomSize*i, roomSize*j, roomSize);
            }
        }
    }
}

function CanvasRoom(Room, n) {
    this.size = CSize;

    this.roomSize = CSize/n;
	
	this.n = n

    this.posX = i * this.roomSize + (this.roomSize / 2);

    this.posY = j * this.roomSize + (this.roomSize / 2);

    this.getPosition = function() {
        return [this.posX,this.posY];
    }

    this.getRoomSize = function() {
        return this.roomSize;
    }

    this.getRoom = function(i,j) {
        return this.gameState.maze.Rooms[i][j]
    }

    this.drawRoom = function(i,j){
        if (i >= 0 && j >= 0 && i < n && j < n) {
			this.posX = i * this.roomSize + (this.roomSize / 2);
			this.posY = j * this.roomSize + (this.roomSize / 2);
			ctx = myGameArea.context;
            var room = gameState.maze.Rooms[i][j];
            j = j * this.roomSize;
            i = i * this.roomSize;
            this.clearRoom(i,j)
			if (!room.discovered) {
                ctx.fillStyle = '#808080';
				ctx.fillRect(i, j, this.roomSize, this.roomSize);
            } else {
                ctx.font = "5px Arial black";
                ctx.fillStyle = (room.isRoomInDark() ? '#b3b3b3' : 'white');
                /*console.log(room)
                console.log(room.isRoomInDark())
                console.log(ctx.fillStyle)*/
                ctx.fillRect(i, j, this.roomSize, this.roomSize);
				ctx.moveTo(i,j);
				ctx.beginPath();
                ctx.strokeStyle = 'black';
				if (Room.Walls[0]) {
					ctx.moveTo(i,j);
					ctx.lineTo(i + this.roomSize,j);    
				}
				if (Room.Walls[1]) {                    
					ctx.moveTo(i + this.roomSize,j);
					ctx.lineTo(i + this.roomSize,j + this.roomSize);    
				}
				if (Room.Walls[2]) {                    
					ctx.moveTo(i + this.roomSize,j + this.roomSize);
					ctx.lineTo(i,j + this.roomSize);    
				}
				if (Room.Walls[3]) {                    
					ctx.moveTo(i ,j + this.roomSize);
					ctx.lineTo(i,j);    
				}
				ctx.stroke();
				ctx.beginPath();
				//door == false : door exists and is closed
				if (Room.doors[0] != null) {
					ctx.strokeStyle = Room.doors[0] ? 'blue' : 'yellow';
					ctx.moveTo(i,j);
					ctx.lineTo(i + this.roomSize,j);    
				}
				if (Room.doors[1] != null) {
					ctx.strokeStyle = Room.doors[1] ? 'blue' : 'yellow';
					ctx.moveTo(i + this.roomSize,j);
					ctx.lineTo(i + this.roomSize,j + this.roomSize);    
				}
				if (Room.doors[2] != null) {
					ctx.strokeStyle = Room.doors[2] ? 'blue' : 'yellow';
					ctx.moveTo(i + this.roomSize,j + this.roomSize);
					ctx.lineTo(i,j + this.roomSize);    
				}
				if (Room.doors[3] != null) {
					ctx.strokeStyle = Room.doors[3] ? 'blue' : 'yellow';
					ctx.moveTo(i ,j + this.roomSize);
					ctx.lineTo(i,j);    
				}
				ctx.stroke();
				ctx.font = "bold " + (this.roomSize / 3) + "px Arial";
				ctx.fillStyle = "black"
				var pixelDisplacement = this.roomSize/10;
				if (Room.Attributes[1]) {
					ctx.fillText('E', i-1+this.roomSize/2, j +this.roomSize/2);
				}
				else if (Room.hasItem()) {
					var key = Room.item.key
					if (imageBase.hasImg(key)) {
                        img = imageBase.getImg(key);
						ctx.drawImage(img, i + pixelDisplacement / 2, j + pixelDisplacement / 2 , (this.roomSize - pixelDisplacement), (this.roomSize - pixelDisplacement));
					} else {
						ctx.fillText('I', i-1+this.roomSize/2, j +this.roomSize/2);
					}
				}
				else if (Room.hasTrap()) {
					//should be !Room.trap.activatable
					if (!Room.trap.activatable) {
						var key = Room.trap.key
						if (imageBase.hasImg(key)) {
							img = imageBase.getImg(key);
							ctx.drawImage(img, i + pixelDisplacement  / 2, j + pixelDisplacement  / 2, this.roomSize - pixelDisplacement,this.roomSize - pixelDisplacement);
						} else {
							ctx.fillText('T', i-1+this.roomSize/2, j +this.roomSize/2);
						}
					}
				}
				else if (Room.hasPassiveEntity()) {
					
					var key = Room.passiveEntity.key
					if (imageBase.hasImg(key)) {
						img = imageBase.getImg(key);
						ctx.drawImage(img, i + pixelDisplacement  / 2, j + pixelDisplacement  / 2, this.roomSize - pixelDisplacement,this.roomSize - pixelDisplacement);
					} else {
						ctx.fillText('P', i-1+this.roomSize/2, j +this.roomSize/2);
					}
					
				}
				else if (Room.hasActivatableEntity() && Room.activatableEntity.type != activatableEntityTypes.DOOR) {
					var key =Room.activatableEntity.activatableState + ' ' + 
						(Room.activatableEntity.activatableState == activatableState.UNACTIVE ? Room.activatableEntity.key : Room.activatableEntity.type)
					if (imageBase.hasImg(key)) {
						img = imageBase.getImg(key);
						ctx.drawImage(img, i + pixelDisplacement  / 2, j + pixelDisplacement  / 2 , this.roomSize - pixelDisplacement ,this.roomSize - pixelDisplacement);
					} else {
						ctx.fillText('A', i-1+this.roomSize/2, j +this.roomSize/2);
					}
				} 
                //else ctx.fillText(this.Room.endWeight, i-1+this.roomSize/2, j +this.roomSize/2)
                //else ctx.fillText(this.Room.isRoomInDark(), i-1+this.roomSize/2, j +this.roomSize/2)
			}
		}
    }

	this.clearRoom = function(i,j) {
		ctx = myGameArea.context;
        ctx.clearRect(i, j, this.roomSize, this.roomSize);
    }
}
