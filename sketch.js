var database;
var dog, dogHappy, dogSad;
var db, foodS, foodStock;
var fedTime, lastFed, feed, addFood, foodObj;
var bedroom, garden, washroom;
var gameState, readState;

function preload(){
    dogImg = loadImage("images/Dog.png");
    dogImg2 = loadImage("images/happydog.png");
    bedroomn = loadImage("images/Bed Room.png");
    garden = loadImage("images/Garden.png");
    washroom = loadImage("images/Wash Room.png");
}


function setup() {
  createCanvas(1000, 500);
  foodObj = new Food();

  db = firebase.database();
  dog = createSprite(800, 200, 10, 10);
  dog.addImage(dogImg);
  dog.scale = 0.2

  feed = createButton("FEED");
  feed.position(600, 30);
  feed.mousePressed(feedDog);

  addFood = createButton("ADD FOOD");
  addFood.position(700, 30);
  addFood.mousePressed(addFood);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });


  readState=database.ref("gameState");
  readState.on('value',function(data){
    gameState=data.val();
  });

foodStock = db.ref('Food');
foodStock.on("value", readStock);
}


function draw() {  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime==(lastFed+2)){
      update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry")
    foodObj.display();
    }

    if(gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }

    else{
      feed.show();
      addFood.show();
      dog.addImage(dogSad);
    }

  drawSprites();
  
} 
function update(state){
  database.ref("/").update({
   gameState:state
  })
}
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}
function feedDog(){
  dog.addImage(dogImg2);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  db.ref('/').update({
    Food:foodObj.getFoodStock(), fedTime:hour(), gameState:"Hungry"
  })
}
function addFood(){
  foodS++
  db.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}