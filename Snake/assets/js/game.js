var snake, apple, squareSize, score, speed, updateDelay, direction, new_direction, addNew, cursors, scoreTextValue, speedTextValue, textStyle_Key, textStyle_Value;

var Game = {
    
    preload: function(){
        //Load all resources needed. Here we load two images
        //name, image url
        game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');
    },
    
    create: function(){
        // By setting up global variables in the create function, we initialise them on game start.
        // We need them to be globally available so that the update function can alter them.

        snake = [];                     // This will work as a stack, containing the parts of our snake
        apple = {};                     // An object for the apple;
        squareSize = 15;                // The length of a side of the squares. Our image is 15x15 pixels.
        score = 0;                      // Game score.
        speed = 0;                      // Game speed.
        updateDelay = 0;                // A variable for control over update rates.
        direction = 'right';            // The direction of our snake.
        new_direction = null;           // A buffer to store the new direction into.
        addNew = false;                 // A variable used when an apple has been eaten.
        
        //Setting up keyboard input
        cursors = game.input.keyboard.createCursorKeys();
        
        game.stage.backgroundColor = '#061f27';
        
        // Generate the initial snake stack. Our snake will be 10 elements long.
        // Beginning at X=150 Y=150 and increasing the X on every iteration.
        for(var i = 0; i < 10; i++){
            // Parameters are (X coordinate, Y coordinate, image)
            snake[i] = game.add.sprite(150+i*squareSize, 150, 'snake'); 
        }
        
        //Generate the first apple
        this.generateApple();
        
        //add Text to top of game
        textStyle_Key = {font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
        textStyle_Value ={font: "bold 18px sans-serif", fill: "#ffffff", align: "center" };
        
        //score
        game.add.text(30, 20, "SCORE", textStyle_Key);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
        //speed
        game.add.text(500, 20, "SPEED", textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);
        
    },
    
    update: function(){
        // The update function is called constantly at a high rate (somewhere around 60fps),
        // updating the game field every time.
        // We are going to leave that one empty for now.
        
        //Arrow Key Presses
        if(cursors.right.isDown && direction!='left')
            {
                new_direction = 'right';
            }
        else if (cursors.left.isDown && direction!='right')
            {
                new_direction = 'left';
            }
        else if (cursors.up.isDown && direction!='down')
            {
                new_direction = 'up';
            }
        else if (cursors.down.isDown && direction!='up')
            {
                new_direction = 'down';
            }
        
        // A formula to calculate game speed based on the score.
        // The higher the score, the higher the game speed, with a maximum of 10;
        speed = Math.min(10, Math.floor(score/5));
        //update speed text
        speedTextValue.text = '' + speed;
        
        // Since the update function of Phaser has an update rate of around 60 FPS,
        // we need to slow that down make the game playable.

        // Increase a counter on every update call.
        updateDelay++;
        
        // Do game stuff only if the counter is aliquot to (10 - the game speed).
        // The higher the speed, the more frequently this is fulfilled,
        // making the snake move faster.
        if (updateDelay % (10 - speed) == 0) {
            //snake movement (head)
            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift(), 
                oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;
            
            //if new direction has been chosen, use that instead of old one
            if(new_direction){
                direction = new_direction;
                new_direction = null;
            }
            
            // Change the last cell's coordinates relative to the head of the snake, according to the direction.
            if(direction == 'right'){
                lastCell.x = firstCell.x + 15;
                lastCell.y = firstCell.y;
            } else if (direction == 'left'){
                lastCell.x = firstCell.x - 15;
                lastCell.y = firstCell.y;
            } else if (direction == 'up'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y - 15;
            } else if (direction == 'down'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y + 15;
            }
            
            snake.push(lastCell);
            firstCell = lastCell;
            
            // Increase length of snake if an apple had been eaten.
            // Create a block in the back of the snake with the old position of the previous last block
            // (it has moved now along with the rest of the snake).
            if(addNew){
                snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                addNew = false;
            }
            
            //check apple collision
            this.appleCollision();
            
            //check for collision with self
            this.selfCollision(firstCell);
            
            //check for wall collision
            this.wallCollision(firstCell);
            
        }
        
    },
    
    appleCollision: function(){
        // Check if any part of the snake is overlapping the apple.
        // This is needed if the apple spawns inside of the snake.
        for(var i = 0; i < snake.length; i++){
            if(snake[i].x == apple.x && snake[i].y == apple.y){
                //next time snake moves, new block added to length
                addNew = true;
                
                //destroy old apple
                apple.destroy();
                
                //make a new apple
                this.generateApple();
                
                score++;
                scoreTextValue.text = score.toString();
            }
        }
    },
    
    selfCollision: function(head){
        //check collision for each snake segment
        for(var i = 0; i < snake.length - 1; i++){
            if(head.x == snake[i].x && head.y == snake[i].y){
                //change state, you lose
                game.state.start('Game_Over');
            }
        }
    },
    
    wallCollision: function(head){
        if(head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0){
            //change state, you lose
            game.state.start('Game_Over');
        }
    },
    
    generateApple: function(){
        // Chose a random place on the grid.
        // X is between 0 and 585 (39*15)
        // Y is between 0 and 435 (29*15)
        
        var randomX = Math.floor(Math.random() * 40 ) * squareSize,
            randomY = Math.floor(Math.random() * 30 ) * squareSize;
        
        apple = game.add.sprite(randomX, randomY, 'apple');
    }
    
}