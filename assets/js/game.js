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

//Title Screen
var title = new PIXI.Container();
var background = PIXI.Sprite.fromImage("./assets/img/titleBackground.jpg");
stage.addChild(background);



var instructions = new PIXI.Container();

var credits = new PIXI.Container();





//Populate title screen
function loadTitle(){
  var titleText = new PIXI.Text("Hoegarth's Fall!", {font: '24px Arial', fill: 'red'});
  titleText.anchor.x = .5;
  titleText.anchor.y = 0;
  titleText.position.x = 200;
  titleText.position.y = 50;
  title.addChild(titleText);
  var playText = new PIXI.Text("Play", {font: '24px Arial', fill: 'yellow'});
  playText.anchor.x = .5;
  playText.anchor.y = 0;
  playText.position.x = 200;
  playText.position.y = 100;
  playText.interactive = true;
  playText.on("mousedown", startGame);
  title.addChild(playText);
  var instructionText = new PIXI.Text("Instructions", {font: '24px Arial', fill: 'red'});
  instructionText.anchor.x = .5;
  instructionText.anchor.y = 0;
  instructionText.position.x = 200;
  instructionText.position.y = 150;
  instructionText.interactive = true;
  instructionText.on('mousedown', startStruct);
  title.addChild(instructionText);
  var creditText = new PIXI.Text("Credits", {font: '24px Arial', fill: 'yellow'});
  creditText.anchor.x = .5;
  creditText.anchor.y = 0;
  creditText.position.x = 200;
  creditText.position.y = 200;
  creditText.interactive = true;
  creditText.on('mousedown', startCredits);
  title.addChild(creditText);
  stage.addChild(title);
}

//Populate instructions screen
function startStruct(){
  stage.removeChild(title);
  var struct = new PIXI.Text("Hoegarth has been trapped in a dungeon!\nUsing the clues provided, find Hoegarth\na safe way out! WASD keys to move.", {font: '16px Arial', fill: 'yellow', align: 'center'});
  struct.anchor.x = .5;
  struct.anchor.y = 1;
  struct.position.x = 200;
  struct.position.y = 200;
  instructions.addChild(struct);
  var goBack = new PIXI.Text("Back to Menu", {font: '24px Arial', fill: 'red'});
  goBack.anchor.x = .5;
  goBack.anchor.y = 1;
  goBack.position.x = 200;
  goBack.position.y = 350;
  goBack.interactive = true;
  goBack.on('mousedown', goback);
  instructions.addChild(goBack);
  stage.addChild(instructions);
}

//Load Credits screen
function startCredits(){
  stage.removeChild(title);
  var credit = new PIXI.Text("Maker: Matt Nielsen\nGuy who brought me pizza: Mark McCrorie\nCS 314\nProject 3 - Tiles", {font: '16px Arial', fill: 'yellow', align: 'center'});
  credit.anchor.x = .5;
  credit.anchor.y = 1;
  credit.position.x = 200;
  credit.position.y = 200;
  credits.addChild(credit);
  var goBack = new PIXI.Text("Back to Menu", {font: '24px Arial', fill: 'red'});
  goBack.anchor.x = .5;
  goBack.anchor.y = 1;
  goBack.position.x = 200;
  goBack.position.y = 350;
  goBack.interactive = true;
  goBack.on('mousedown', goback);
  credits.addChild(goBack)
  stage.addChild(credits);
  animate();
}

winScreen = new PIXI.Container()

//Load Win Screen
function winScreenLoader(){
  stage.removeChildren();
  stage.addChild(background);
  isWin = true;
  var winText = new PIXI.Text("Hoegarth is safe and sound!\nAll thanks to you!\nYou truly are a hero", {font: '16px Arial', fill: 'yellow', align: 'center'});
  winText.anchor.x = .5;
  winText.anchor.y = 1;
  winText.position.x = 200;
  winText.position.y = 200;
  winScreen.addChild(winText);
  hoegarth = new PIXI.Sprite.fromImage("./assets/img/hoegarth.png");
  hoegarth.scale.x = .5;
  hoegarth.scale.y = .5;
  hoegarth.anchor.x = .5;
  hoegarth.anchor.y = .5;
  hoegarth.position.x = 50;
  hoegarth.position.y = 375;
  winScreen.addChild(hoegarth);
  createjs.Tween.get(hoegarth).to({x: 350}, 5000).wait(5000).call(stopCartwheels);
  stage.addChild(winScreen);
  stage.x = 0;
  stage.y = 0;
}
function stopCartwheels(){
  isWin = false;
  hoegarth.rotate = 0;
}
function goback(){
  stage.removeChildren();
  stage.addChild(background);
  stage.addChild(title);
}

//Start Game stuff
var game = new PIXI.Container();

//Variables
var currentRoomx;
var currentRoomy;
//Directions:
//1=North, 2= East, 3= South, 4= West
//2, 3, 4, 1, 3, 4, 1, 2, 1, 2, 4, 4,
var pathCorrect = [2, 3, 4, 1, 3, 4, 1, 2, 1, 2, 4, 4, 3, 2, 3];
var pathLeft = pathCorrect.slice(0, 16);
var clueBag = [];
var currentClue;
var canMove = false;

var dungeon;
var player;
var isWin = false;
var hoegarth;

var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

//Load the clues
PIXI.loader
  .add('./assets/img/clues.json')
  .load(clueLoader);

function clueLoader(){
  for(var i=1; i<15; i++){
    var clue = new PIXI.Sprite(PIXI.Texture.fromFrame('clue'+i+'.png'));
    clue.anchor.x = .5;
    clue.anchor.y = .5;
    clue = randQuadrant(clue);
    clueBag.push(clue);
  }
  var clue = new PIXI.Sprite(PIXI.Texture.fromFrame('clue14a.png'));
  clue.anchor.x = .5;
  clue.anchor.y = .5;
  clueBag.push(clue);
  var clue = new PIXI.Sprite(PIXI.Texture.fromFrame('clue14b.png'));
  clue.anchor.x = .5;
  clue.anchor.y = .5;
  clueBag.push(clue);
}

//Helper function to randomize the position of the clues
function randQuadrant(clue){
  var quadrant = Math.floor((Math.random() * 4)+1);
  switch(quadrant){
    case 1:
      clue.position.x = 1024;
      clue.position.y = 896;
      break;
    case 2:
      clue.position.x = 1024;
      clue.position.y = 1056;
      break;
    case 3:
      clue.position.x = 864;
      clue.position.y = 1056;
      break;
    case 4:
      clue.position.x = 864;
      clue.position.y = 896;
      break;
  }
  return clue;
}

// The move function starts or continues movement
function move() {
  if (player.direction == MOVE_NONE || !canMove) {
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
    canMove = false;
    changeRoomUp();
  }
  if (player.direction == MOVE_LEFT && player.position.x == (currentRoomx - 160) && player.position.y == currentRoomy){
    console.log("moveLeft");
    player.direction == MOVE_NONE;
    canMove = false;
    changeRoomLeft();
  }
  if (player.direction == MOVE_RIGHT && player.position.x == (currentRoomx + 160) && player.position.y == currentRoomy){
    console.log("moveRight");
    player.direction == MOVE_NONE;
    canMove = false;
    changeRoomRight();
  }
  if (player.direction == MOVE_DOWN && Math.abs(player.position.x - (currentRoomx - 16)) < 30 && player.position.y == currentRoomy + 160){
    console.log("moveDown");
    player.direction = MOVE_NONE;
    canMove=false;
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

//Change Room Functions
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

//Check the room to see if it is correct
function checkPos(dir){
  console.log("checkpos");
  console.log("dir:"+dir);
  console.log("gm:"+pathLeft[0]);
  if(dir == pathLeft[0]){
    console.log("Good Move!");
    pathLeft.shift();
    changeClue();
    if(pathLeft.length == 0){
      console.log("WIN!");
    }
  }
  else{
    console.log("Not a good move");
    reset(dir);
  }
  player.direction = MOVE_NONE;
  canMove = true;
  move();
}

//Reset after a wrong move back to the first room
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
  changeClue();
}

//Update the clue depending on how many right rooms the player has made.
function changeClue(){
  game.removeChild(currentClue);
  var count = 15 - pathLeft.length;
  if(count == 15){
    console.log("Win!");
    canMove = false;
    winScreenLoader();
  }else if(count == 10){
    game.removeChild(currentClue);
    console.log("No Clue");
  }else if(count == 14){
    clue14();
    return;
  }else if(count < 10){
    currentClue = clueBag[count];
  }else if(count > 10){
    currentClue = clueBag[(count-1)];
  }
  game.addChild(currentClue);
}
//Special function for the 14th clue.
function clue14(){
  game.removeChild(currentClue);
  var text14 = new PIXI.Text("3 are lies. 1 is truth\nDoor N: It's behind W or E\nDoor W: It's behind N or S\nDoor E: It's in here\nDoor S: It's not in here\nClick to remove and solve the clue!",{font : '24px Arial', fill : 'yellow', align : 'center'});
  text14.anchor.x = .5;
  text14.anchor.y = .5;
  text14.position.x = 960;
  text14.position.y = 960;
  text14.interactive = true;
  text14.on('mousedown', clear14);
  currentClue = text14;
  game.addChild(currentClue);
  canMove = false;
}
function clear14(){
  game.removeChild(currentClue);
  canMove = true;
}
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

//Load map
function startGame(){
  stage.removeChildren();
  PIXI.loader
    .add('room_json', './assets/img/dungeon.json')
    .add('maptiles', './assets/img/maptiles.png')
    .load(ready);
}

//Populate map with hoegarth and get ready to play!
function ready(){
  var tu = new TileUtilities(PIXI);
  dungeon = tu.makeTiledWorld("room_json", "./assets/img/maptiles.png");
  game.addChild(dungeon);
  stage.addChild(game);

  player = new PIXI.Sprite.fromImage("./assets/img/hoegarth.png");
  player.scale.x = .2;
  player.scale.y = .2;
  player.anchor.x = 0.0;
  player.anchor.y = 1;
  player.position.x = 960;
  currentRoomx = 960;
  player.position.y = 960;
  currentRoomy = 960;
  game.addChild(player);
  canMove = true;
  update_camera();
  animate();
  changeClue();
}

function animate() {
  requestAnimationFrame(animate);
  if(isWin){
    hoegarth.rotation += .1;
  }
  renderer.render(stage);
}

//Update camera used only in console for checks
function update_camera() {
  stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(dungeon.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(dungeon.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}
loadTitle();
animate();
