 var highScore = 0
        var width = 35
        var height = 15
        var squareSize = 40
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = squareSize * width;
        canvas.height = squareSize * height;
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        function start() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "green";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            var gameOver = false
            var quit = false
            var score = 0
            var speed = 500
            var level = 1
            
            document.getElementById("score").innerHTML = "Score: 0" 
            document.getElementById("gameStatus").innerHTML = "Level: 1" 
            
            //this randomizes an initial direction for the snake
            var initDirection = Math.floor(Math.random() * 4) + 1
            var direction = []

            switch(initDirection){
                case 1:
                    //right
                    direction = [1, 0]
                    break;
                case 2:
                    //left
                    direction = [-1, 0]
                    break;
                case 3:
                    //down
                    direction = [0, 1]
                    break;
                case 4:
                    //up
                    direction = [0, -1]
                    break;
            }

            //initialize the three segments of the starting snake with x coords, y coords, and init directions
            var snakeCoords = []
            snakeCoords.push([Math.floor(Math.random() * (width - 6)) + 3, Math.floor(Math.random() * (height - 6)) + 3, direction])
            snakeCoords.push([snakeCoords[0][0] + (direction[0] * -1), snakeCoords[0][1] + (direction[1] * -1), direction], [snakeCoords[0][0]  + (direction[0] * -2), snakeCoords[0][1]  + (direction[1] * -2), direction]) 
            console.log(snakeCoords)

            var fruitCoords = []

            //create a fruit
            makeFruit();
            function makeFruit() {
                var xrand = Math.floor(Math.random() * width)
                var yrand = Math.floor(Math.random() * height)
                var again = false;
                for (x of snakeCoords) {
                    if (x[0] == xrand && x[1] == yrand) {
                        again = true
                    }
                }
                for (x of fruitCoords) {
                    if (x[0] == xrand && x[1] == yrand) {
                        again = true
                    }
                }
                if(again == true){
                    makeFruit()
                } else if (again == false) {
                    ctx.clearRect(xrand * squareSize, yrand * squareSize, squareSize, squareSize)
                    ctx.fillStyle = "#DD7500"
                    ctx.fillRect(xrand * squareSize, yrand * squareSize, squareSize, squareSize)
                    fruitCoords.push([xrand, yrand])
                }
            }

            //call the load function when page first gets loaded
            load()


            function load() {

                //go through each segment of the snake, erase and regreen the current square
                for(let vertebra of snakeCoords) {
                    ctx.clearRect(squareSize * vertebra[0], squareSize * vertebra[1], squareSize, squareSize)
                    ctx.fillStyle = "green"
                    ctx.fillRect(squareSize * vertebra[0], squareSize * vertebra[1], squareSize, squareSize)
                }

                //check if head is on fruit
                for(let i = 0; i < fruitCoords.length; i++) {
                    if (fruitCoords[i][0] == snakeCoords[0][0] && fruitCoords[i][1] == snakeCoords[0][1]) {
                        //remove the fruit, add a snake segment
                        fruitCoords.splice(fruitCoords[i], 1)
                        snakeCoords.push([snakeCoords[snakeCoords.length - 1][0] + (snakeCoords[snakeCoords.length - 1][2][0] * -1), snakeCoords[snakeCoords.length - 1][1] + (snakeCoords[snakeCoords.length - 1][2][1] * -1), snakeCoords[snakeCoords.length - 1][2]])
                        score+=1;
                        document.getElementById("score").innerHTML = "Score: " + score
                        if (score % 3 == 0) {
                            speed *= 3/4
                            level++;
                            document.getElementById("gameStatus").innerHTML = "Level: " + level
                        }
                        if (fruitCoords.length == 0) {
                            makeFruit();
                        }
                    }
                }

                //run through snake coords in reverse order and update directions
                for (let i = snakeCoords.length - 1; i > 0; i--){
                    snakeCoords[i][2] = snakeCoords[i-1][2]
                    snakeCoords[i][0] += snakeCoords[i][2][0]
                    snakeCoords[i][1] += snakeCoords[i][2][1]
                }

                snakeCoords[0][2] = direction
                snakeCoords[0][0] += snakeCoords[0][2][0]
                snakeCoords[0][1] += snakeCoords[0][2][1]
                
                //Draw snake segments at new locations, according to their directions
                for (let vertebra of snakeCoords) {

                    ctx.clearRect(squareSize * vertebra[0], squareSize * vertebra[1], squareSize, squareSize)

                    //Makes sure the "head" of the snake is red and the rest of the "body" is grey
                    if(vertebra == snakeCoords[0]) {
                        ctx.fillStyle = "#FF0000"
                    } else {
                        ctx.fillStyle = "#202020"
                    }

                    ctx.fillRect(squareSize * vertebra[0], squareSize * vertebra[1], squareSize, squareSize)
                }



                //check for loss w walls
                if (snakeCoords[0][0] == -1 || snakeCoords[0][0] == width || snakeCoords[0][1] == -1 || snakeCoords[0][1] == height){
                    gameOver = true;
                }
                //check for loss w tail
                for(let i = 1; i < snakeCoords.length; i ++){
                    if (snakeCoords[0][0] == snakeCoords[i][0] && snakeCoords[0][1] == snakeCoords[i][1]) {
                        gameOver = true;
                        
                        //draw the head on top of the tail it just ran into. So you dont have a gray blob.
                        ctx.clearRect(snakeCoords[0][0] * squareSize, snakeCoords[0][1] * squareSize, squareSize, squareSize)
                        ctx.fillStyle = "red"
                        ctx.fillRect(snakeCoords[0][0] * squareSize, snakeCoords[0][1] * squareSize, squareSize, squareSize)
                    }   
                }

                
                //roll for fruit creation
                if(gameOver !== true && fruitCoords.length < 5) {
                    var fruitRoll = Math.floor(Math.random() * 10) + 1;
                    if (fruitRoll == 1) {
                        //success; create a fruit
                        makeFruit();
                    }
                }

                //calls load every x milliseconds = to the value of speed
                if (gameOver == false) {
                    var refresh = setTimeout(function(){ load() }, speed);
                } else { 
                    var initials = setTimeout(function(){ 
                        document.getElementById("gameStatus").innerHTML = "You lose."
                        if (score > highScore) {
                            var HSInitials = prompt("New High Score! Please input your initials.")
                            highScore = score;
                            document.getElementById("highScore").innerHTML = "High Score: " + "<br>"
                            + HSInitials + " --- " + highScore
                        } 
                    }, 300);
                }
                
                //listen for key presses; inside load function so it only happens once per frame
                document.addEventListener("keydown", keyDownHandler, false);
            }

            

            function keyDownHandler(e) {
                if ((e.key === "Right" || e.key === "ArrowRight") && direction.toString() !== [-1,0].toString()) {
                    direction = [1, 0]
                    //makes sure you cant change directions more than once a frame
                    document.removeEventListener("keydown", keyDownHandler, false);
                }
                if ((e.key === "Left" || e.key === "ArrowLeft") && direction.toString() !== [1,0].toString()) {
                    direction = [-1, 0]
                    document.removeEventListener("keydown", keyDownHandler, false);
                }
                if ((e.key === "Down" || e.key === "ArrowDown") && direction.toString() !== [0,-1].toString()) {
                    direction = [0, 1]
                    document.removeEventListener("keydown", keyDownHandler, false);
                }
                if ((e.key === "Up" || e.key === "ArrowUp") && direction.toString() !== [0, 1].toString()) {
                    direction = [0, -1]
                    document.removeEventListener("keydown", keyDownHandler, false);
                }
            }

            //checks if click button has been pressed
            document.getElementById("quitBtn").addEventListener("click", function() {
                gameOver = true;
                clearInterval(refresh);
                document.getElementById("gameStatus").innerHTML = "You concede."
            });
        }