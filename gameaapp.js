var stage;
var paddle;
var ball;
var bricks=[];
var score=0;
var lives =3;
var scoreText;

const PADDLE_WIDTH=100;
const PADDLE_HEIGHT=20;
const BRICKS_WIDTH=60;
const BRICKS_HEIGHT=30;
const BALL_RADIUS=8;
const BALL_MAX_SPEED=12;
var paddleimg =document.getElementById("img");
var gameStarted=false;
//keyboard
const KEYCODE_LEFT=37;
const KEYCODE_RIGHT=39;
const SPACEBAR=32;

var canvasla=document.getElementById("testCanvas");
//var ctx = canvasla.getContext("2d");

var keyboardMoveLeft=false;
var keyboardMoveRight=false;



function init(){
    stage= new createjs.Stage("testCanvas");
    
    createjs.Touch.enable(stage);//to enable touch
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick",update);

    createScoreText();
    addToScore(0);
    createBrickGrid();
    
    createPaddle();
    
    createBall();
    
    window.onkeydown=keyDownHandler;
    window.onkeyup=keyUpHandler;
    
    stage.on("stagemousemove",function(event){
        paddle.x=stage.mouseX-PADDLE_WIDTH/2;
    });
    
    stage.on("stagemousedown",function(event){//the starting position of the ball on the paddle
        startLevel();
    })
    stage.canvas.height=window.innerHeight;

    // stage.canvas.addEventListener('mousemove',function(evt){ //............Using the calculated mouse position
    //     var mousePos = calculateMousePos(evt);
    //     paddle.x=mousePos.x -PADDLE_WIDTH/2;

    // });
}

// function calculateMousePos(evt){//............................Calculating mouse position.................................
//     var rect = stage.canvas.getBoundingClientRect();
//     var root = document.documentElement;
//     var mouseX=evt.clientX - rect.left - root.scrollLeft;
//     var mouseY= evt.clientY - rect.top - root.scrollTop;
//      return{
//      x:mouseX,
//      y:mouseY
//     };
// }
function update(){
    stage.update();
    //keyboard control
    if(keyboardMoveRight){
        paddle.x+=10;
    }
    if(keyboardMoveLeft){
        paddle.x-=10;
    }
    //paddle hitting canvas wall
    if(paddle.x+PADDLE_WIDTH>stage.canvas.width){
        paddle.x=stage.canvas.width-PADDLE_WIDTH;
    }
    if(paddle.x<0){
            paddle.x=0;
    }
    if(!gameStarted){//..........defining the starting postion of the ball;
        ball.x=paddle.x+PADDLE_WIDTH/2;
        ball.y=paddle.y-PADDLE_HEIGHT/2;
        stage.update();
        return;
    }
   
    

    if(ball.up){
        ball.y-=ball.ySpeed;
    }
    else{
        ball.y+=ball.ySpeed;
    }
    if(ball.right){
        ball.x+=ball.xSpeed;
    }
    else{
        ball.x-=ball.xSpeed;
    }
    //to check if the ball hits the wall;

    if(ball.x+BALL_RADIUS>=stage.canvas.width){
        ball.x=stage.canvas.width-BALL_RADIUS;
        ball.right=false;
    }
    if(ball.x-BALL_RADIUS<=0){
        ball.x=BALL_RADIUS;
        ball.right=true;
    }
  
    if(ball.y+BALL_RADIUS>=stage.canvas.height){
        loselife();
        console.log("hitbottom");

    }
    if(ball.y+BALL_RADIUS<=0){
        ball.y=BALL_RADIUS;
        ball.up=false;
    }

    ball.lastX=ball.x;
    ball.lastY=ball.y;
    
    if(ball.y+BALL_RADIUS>paddle.y&&ball.y+BALL_RADIUS<paddle.y+PADDLE_HEIGHT){
        if(ball.x+BALL_RADIUS>paddle.x&&ball.x-BALL_RADIUS<paddle.x+PADDLE_WIDTH){
            let midPoint = paddle.x+PADDLE_WIDTH/2;
            let startPoint = paddle.x;
            let endPoint = paddle.x+PADDLE_WIDTH;
           
                    if(ball.x<midPoint){
                        ball.up=true;
                        ball.right=false;
                        
                       console.log(ball.xSpeed)
                        ball.xSpeed =BALL_MAX_SPEED - ((ball.x - startPoint)/(midPoint-startPoint)) * BALL_MAX_SPEED;
                       
                    }
                    if(ball.x>midPoint){
                        ball.up=true;
                        ball.right=true;
                        
                       console.log(ball.xSpeed)
                        ball.xSpeed = BALL_MAX_SPEED - ((endPoint - ball.x)/(endPoint-midPoint)) * BALL_MAX_SPEED;
  
                    }
                    
            console.log('paddleHIT');
        }
       
    }

    for(var i=0;i<bricks.length;i++){
        if(checkCollision(ball,bricks[i])){
            destroyBrick(bricks[i]);
            console.log("hit");
            bricks.splice(i,1);
            i--;//because the deleted position will have a new element with same value of i
            if(ball.up)
            {ball.up=false;}
            else{
                ball.up=true;
            }
    }

}
}

function checkCollision(ballElement,brickElement){
    
    if(ballElement.x+BALL_RADIUS<=brickElement.x-BRICKS_WIDTH/2 || ballElement.x-BALL_RADIUS>=brickElement.x+BRICKS_WIDTH/2 || ballElement.y-BALL_RADIUS>=brickElement.y+BRICKS_HEIGHT/2 || ballElement.y+BALL_RADIUS<=brickElement.y-BRICKS_HEIGHT/2 ){
        return false;
       }
      else{
          return true;
      }
}

function createBrickGrid(){
    for(var i=0;i<14;i++){
        for(var j=0;j<6;j++){
            if(i==j){
                createBrick(i*(BRICKS_WIDTH+10)+40,j*(BRICKS_HEIGHT+5)+20);
            }
            if(i==j+1){
                createBrick(i*(BRICKS_WIDTH+10)+40,j*(BRICKS_HEIGHT+5)+20);
            }
            if(i>6){
                if(j<3)
               { createBrick(i*(BRICKS_WIDTH+10)+40,j*(BRICKS_HEIGHT+5)+20);}
            }
            
        }
    
    }
}

function createBrick(x,y){
    var brick = new createjs.Shape();
    brick.graphics.beginFill('blue');
    brick.graphics.drawRect(0,0,BRICKS_WIDTH,BRICKS_HEIGHT);
    brick.graphics.endFill();
    stage.addChild(brick);

    brick.regX =BRICKS_WIDTH/2;
    brick.regY =BRICKS_HEIGHT/2;

    brick.x=x;
    brick.y=y;

    bricks.push(brick);
}

function createBall(){
    ball=new createjs.Shape();
    ball.graphics.beginFill('red').drawCircle(0,0,BALL_RADIUS);
    ball.x=paddle.x;
    ball.y=paddle.y-(PADDLE_HEIGHT/2)-BALL_RADIUS;
    stage.addChild(ball);

    ball.up=true;
    ball.right=true;
    ball.xSpeed=0;
    ball.ySpeed=0;
    ball.lastX=0;
    ball.lastY=0;
}

function createPaddle(){
     paddle=new createjs.Shape();
    paddle.graphics.beginFill('tomato').drawRect(0,0,PADDLE_WIDTH,PADDLE_HEIGHT);
    // paddle.x=stage.canvas.width/2-PADDLE_WIDTH/2;
   
    paddle.y=stage.canvas.height*0.93;
    stage.addChild(paddle);
}

function destroyBrick(brick){
    addToScore(100);
    createjs.Tween.get(brick,{}).to({scaleX:0,scaleY:0},500);
    setTimeout(removeBrickFromScreen,500,brick);
}

function removeBrickFromScreen(brick){
    stage.removeChild(brick);
}
function addToScore(points){
    score+=points;
    scoreText.text= "scores: "+score+"/Lives: "+lives;
}
function createScoreText(){
    scoreText= new createjs.Text("","16px Arial","#000000");
    scoreText.y=stage.canvas.height-16;
    stage.addChild(scoreText);
}
function loselife(){
    gameStarted=false;
    lives--;
    scoreText.text="score:" +score+"/Lives: "+lives;
    ball.xSpeed=0;
    ball.ySpeed=0;
    ball.x=paddle.x;
    ball.y=paddle.y-PADDLE_HEIGHT/2;
}

//keyboard setup




function keyDownHandler(e){
     switch (e.keyCode){
         case KEYCODE_LEFT: keyboardMoveLeft=true;break;
         case KEYCODE_RIGHT: keyboardMoveRight=true;break;
         case SPACEBAR:startLevel();break;
     }
}

function keyUpHandler(e){
    switch(e.keyCode){//capital c is must camel case
        case KEYCODE_LEFT: keyboardMoveLeft=false;break;
        case KEYCODE_RIGHT: keyboardMoveRight=false;break;

    }
}
function startLevel(){
    if(!gameStarted){
        gameStarted=true;
        ball.xSpeed=5;
        ball.ySpeed=5;
        ball.up=true;
        ball.right=true;
    }
}
function component(x,y,width,height,color){
       this.x=x;
       this.y=y;
       this.width=width;
       this.height=height;
       this.image = new Image();
        this.image.src = color;
        this.draw=function(){
            ctx=canvasla.getContext("2d");
            ctx.drawImage(paddleimg,this.x, this.y, this.width, this.height);
        }
}