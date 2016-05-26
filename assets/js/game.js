var GAME_WIDTH = 400;
var GAME_HEIGHT = 400;
var GAME_SCALE = 1;
var gameport = document.getElementById("gameport");

//Whole map is 1920

var renderer = PIXI.autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, {backgroundColor: 0x000000});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;


var game = new PIXI.Container();

var currentRoomx;
var currentRoomy;
//Directions:
//1=North, 2= East, 3= South, 4= West
var pathCorrect = [2, 3, 4, 1, 3, 4, 1, 2, 1, 2, 4, 4, 3, 2, 3];
var pathLeft = pathCorrect.slice(0, 16);


var dungeon;
var player;

var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

// The move function starts or continues movement
function move() {
  if (player.direction == MOVE_NONE) {
    player.moving = false;
    console.log("x:"+player.x);
    console.log("y:"+player.y);
    return;
  }
  player.moving = true;
  console.log("move");

  if (player.direction == MOVE_UP && Math.abs(player.position.x - (currentRoomx - 16)) < 30 && player.position.y == currentRoomy - 160){
    console.log("moveUp");
    player.direction == MOVE_NONE;
    changeRoomUp();
  }
  if (player.direction == MOVE_LEFT && player.position.x == (currentRoomx - 160) && player.position.y == currentRoomy){
    console.log("moveLeft");
    player.direction == MOVE_NONE;
    changeRoomLeft();
  }
  if (player.direction == MOVE_RIGHT && player.position.x == (currentRoomx + 160) && player.position.y == currentRoomy){
    console.log("moveRight");
    player.direction == MOVE_NONE;
    changeRoomRight();
  }
  if (player.direction == MOVE_DOWN && Math.abs(player.position.x - (currentRoomx - 16)) < 30 && player.position.y == currentRoomy + 160){
    console.log("moveDown");
    player.direction = MOVE_NONE;
    changeRoomDown();
  }

  if(player.direction == MOVE_UP && player.position.y == currentRoomy - 160){
    console.log("Up wall");
    player.direction = MOVE_NONE;
    move();
  }
  if(player.direction == MOVE_LEFT && player.position.x == (currentRoomx - 160)){
    console.log("Left wall");
    player.direction = MOVE_NONE;
    move();
  }
  if(player.direction == MOVE_RIGHT && player.position.x == (currentRoomx + 160)){
    console.log("Right wall");
    player.direction = MOVE_NONE;
    move();
  }
  if(player.direction == MOVE_DOWN && player.position.y == currentRoomy + 160){
    console.log("Down wall");
    player.direction = MOVE_NONE;
    move();
  }

  if (player.direction == MOVE_LEFT) {
    createjs.Tween.get(player).to({x: player.x - 32}, 500).call(move);
  }
  if (player.direction == MOVE_RIGHT){
    createjs.Tween.get(player).to({x: player.x + 32}, 500).call(move);
  }
  if (player.direction == MOVE_UP){
    createjs.Tween.get(player).to({y: player.y - 32}, 500).call(move);
  }
  if (player.direction == MOVE_DOWN){
    createjs.Tween.get(player).to({y: player.y + 32}, 500).call(move);
  }
}

// Keydown events start movement
window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (!player) return;
  if (player.moving) return;
  if (e.repeat == true) return;

  player.direction = MOVE_NONE;

  if (e.keyCode == 87)
    player.direction = MOVE_UP;
  else if (e.keyCode == 83)
    player.direction = MOVE_DOWN;
  else if (e.keyCode == 65)
    player.direction = MOVE_LEFT;
  else if (e.keyCode == 68)
    player.direction = MOVE_RIGHT;

  console.log(e.keyCode);
  move();
});

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
  e.preventDefault();
  if (!player) return;
  player.direction = MOVE_NONE;
});

function changeRoomUp(){
  createjs.Tween.get(dungeon).to({y: dungeon.y + 384}, 500);
  createjs.Tween.get(player).to({y: player.y + 320}, 500).wait(700).call(function() {checkPos(1)});
  //createjs.Tween.get(player).to({y: player.y - 32}, 500).wait(700).call(function() {checkPos(1)});
  //currentRoomy += 384;
  //player.position.y = player.position.y + 320;
}
function changeRoomDown(){
  createjs.Tween.get(dungeon).to({y: dungeon.y - 384}, 500);
  createjs.Tween.get(player).to({y: player.y - 320}, 500).wait(700).call(function() {checkPos(3)});
  //createjs.Tween.get(player).to({y: player.y + 32}, 500).wait(700).call(function() {checkPos(3)});
  //currentRoomy -= 384;
  //player.position.y = player.position.y + 320;
}
function changeRoomRight(){
  createjs.Tween.get(dungeon).to({x: dungeon.x - 384}, 500);
  createjs.Tween.get(player).to({x: player.x - 320}, 500).wait(700).call(function() {checkPos(2)});
  //createjs.Tween.get(player).to({x: player.x + 32}, 500).wait(700).call(function() {checkPos(2)});
  //currentRoomx += 384;
  //player.position.y = player.position.y + 320;
}
function changeRoomLeft(){
  createjs.Tween.get(dungeon).to({x: dungeon.x + 384}, 500);
  createjs.Tween.get(player).to({x: player.x + 320}, 500).wait(700).call(function() {checkPos(4)});
  //createjs.Tween.get(player).to({x: player.x - 32}, 500).wait(700).call(function() {checkPos(4)});
  //currentRoomx += 384;
  //player.position.y = player.position.y + 320;
}

function checkPos(dir){
  console.log("checkpos");
  console.log("dir:"+dir);
  console.log("gm:"+pathLeft[0]);
  if(dir == pathLeft[0]){
    console.log("Good Move!");
    pathLeft.shift();
    if(pathLeft.length == 0){
      console.log("WIN!");
    }
  }
  else{
    console.log("Not a good move");
    reset(dir);
  }
  player.direction = MOVE_NONE;
  move();
}

function reset(dir){
  console.log("reset");
  pathLeft = pathCorrect.slice(0, 16);
  dungeon.x = 0;
  dungeon.y = 0;
  if(dir == 1){
    player.y = player.y;
    player.x = player.x;
  }else if(dir == 2){
    player.y = player.y;
    player.x = player.x;
  }else if(dir == 3){
    player.y = player.y;
    player.x = player.x;
  }else if(dir == 4){
    player.y = player.y;
    player.x = player.x;
  }
}

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add('room_json', './assets/img/dungeon.json')
  .add('maptiles', './assets/img/maptiles.png')
  .load(ready);

function ready(){
  var tu = new TileUtilities(PIXI);
  dungeon = tu.makeTiledWorld("room_json", "./assets/img/maptiles.png");
  game.addChild(dungeon);
  stage.addChild(game);

  player = new PIXI.Sprite.fromImage("./assets/img/cs413.png");
  player.anchor.x = 0.0;
  player.anchor.y = 1;
  player.position.x = 960;
  currentRoomx = 960;
  player.position.y = 960;
  currentRoomy = 960;
  game.addChild(player);
  update_camera();
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(stage);
}


function update_camera() {
  stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(dungeon.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(dungeon.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}
