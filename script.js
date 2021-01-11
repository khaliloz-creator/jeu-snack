$(function(){

  var canvas = $('#canvas')[0];
  var ctx = canvas.getContext('2d');

  var snake = [
      {x: 50, y: 100, oldX: 0, oldY: 0},
      {x: 50, y: 90, oldX: 0, oldY: 0},
      {x: 50, y: 80,oldX: 0, oldY: 0},
  ];

    var food = {x: 200, y: 200, eaten: false};

    var snakewidth = snakeheight = 10;
    var blockSize = 10;

    const LEFT = 37 ;
    const UP = 38;
    const RIGHT = 39 ;
    const DOWN = 40 ;
     
    var keyPressed = DOWN;
    var score = 0;
    var game;

    game = setInterval(gameloop,200);

    function gameloop(){
        console.log('loop running')
        clearCanvas();
        drawFood();
        moveSnake();
        drowsnake();

    }

    function moveSnake(){
        $.each(snake, function(index , value){
            snake[index].oldX = value.x;
            snake[index].oldY = value.y;
            if(index == 0){
                if(keyPressed == DOWN){
                    snake[index].y = value.y + blockSize;

                }else if(keyPressed == UP){
                    snake[index].y = value.y - blockSize;
                    
                }else if(keyPressed == RIGHT){
                    snake[index].x = value.x + blockSize;
                    
                }else if(keyPressed == LEFT){
                    snake[index].x = value.x - blockSize;
                }

            }else{
                snake[index].x = snake[index - 1].oldX;
                snake[index].y= snake[index - 1].oldY;

            }

        });
         
    }
    

    function drowsnake() {
        $.each(snake, function(index , value){
            ctx.fillStyle = 'yellow';
            ctx.fillRect(value.x, value.y, snakewidth, snakeheight);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(value.x, value.y, snakewidth, snakeheight);
            if(index == 0){
                if(collided(value.x, value.y)){
                  gameOver();

                }
                if(didEatFood(value.x, value.y)) {
                   score++;
                   $('#score').text(score);
                   makeSnakeBigger();
                   food.eaten = true;
            }
        }
        });
    }
            function makeSnakeBigger(){
                snake.push({
                    x: snake[snake.length - 1].oldX,
                    y: snake[snake.length - 1].oldY,


                });

            }


     function collided(x,y) {
         return snake.filter(function(value, index) {
             return index != 0 && value.x == x && value.y == y;
         }).length > 0 || x < 0 || x > canvas.width || y < 0 || y > canvas.height;
     }

     function drawFood(){
        ctx.fillStyle = 'red'; 
        if(food.eaten == true ){
            food = getNewPositionForFood();
        }
        ctx.fillRect(food.x, food.y, snakewidth, snakeheight);
          
     }
        function didEatFood(x,y) {
            return food.x == x && food.y == y;

        }


    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width , canvas.height);
    }

    $(document).keydown(function(e){
                 if ($.inArray(e.which, [DOWN, UP, LEFT, RIGHT]) != -1) { 
                     keyPressed = checkKeyIsAllowed(e.which);
                 }
            });

            function checkKeyIsAllowed(tempKey){
                let key ;
                if(tempKey == DOWN){
                    key = (keyPressed != UP) ? tempKey : keyPressed;
                }else if (tempKey == UP){
                    key = (keyPressed != DOWN) ? tempKey : keyPressed;
                }else if (tempKey == LEFT){
                    key = (keyPressed != RIGHT) ? tempKey : keyPressed;
                }else if (tempKey == RIGHT){
                    key = (keyPressed != LEFT) ? tempKey : keyPressed;
                }
                return key;
           }

           function gameOver() {
               clearInterval(game);
               alert('Game over');

           }

           function getNewPositionForFood() {
               let xArr = yArr = [], xy;
               $.each(snake, function(index, value) {
                   if($.inArray(value.x, xArr) != -1 ) {
                       xArr.push(value.x);
                   }
                   if($.inArray(value.y, yArr) == -1 ) {
                    yArr.push(value.y);
                }
               });
               xy = getEmptyXY(xArr, yArr);
               return xy;
           }

           function getEmptyXY(xArr, yArr) {
               let newX, newY;
               newX = getRandomNumber(canvas.width - 10, 10);
               newY = getRandomNumber(canvas.height - 10, 10);
               if($.inArray(newX, xArr) == -1 && $.inArray(newY, yArr) != -1) {
                   return {
                       x: newX,
                       y: newY,
                       eaten: false
                   };

               } else {
                   return getEmptyXY(xArr, yArr);

               };
           }

           function getRandomNumber(max, multipleOF) {
               let result = Math.floor(Math.random() * max);
               result = (result % 10 == 0) ? result : result + (multipleOF - result % 10);
               return result;
           }
          

});