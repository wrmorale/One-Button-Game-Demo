title = "On Rails ";

description = `
[Hold to Speedup]
[Press to Jump]
[Press again to Double Jump]
`;

characters = [
` 
 llll
ll  ll
 llll
  ll
 llll
llllll
`, 
`
 llll
ll  ll
 llll
  ll
 llll
ll  ll
`
];
options = {
  viewSize: { x: 200, y: 100 }
};

/** @type {{pos:Vector, width: number}[]}*/
let rails;
let nextRailDist;
/** 
 * @type {{
 *  y: number, 
 * my: number, 
 * vy: number, 
 * speed: number,
 * state: "run" | "jump"}}
*/
let myDude;
const myDudeX = 9;
let jumps = 2;
let jumped = 0;
            // 1        2       3     
let colors = ["cyan", "red", "green"];


function update() {
  if (!ticks) {
    rails = [{
      pos: vec(10, 50), 
      width: 80 
    }];
    nextRailDist = 0;
    myDude = {
      y: 10, my: 0, vy: 0, speed: 1, side: 1, state: "jump"};
  }
  const scr = difficulty * 0.5 * myDude.speed;
  if(myDude.state === "run") {
     if(input.isJustPressed){
      myDude.vy = -1.5 * sqrt(difficulty) * 1;
      myDude.state = "jump";
     }

  }
  if(myDude.state === "jump") { 
    myDude.vy += 0.07 * difficulty * 1;
    myDude.y += myDude.vy;
    if(input.isJustPressed && (jumped < jumps)){
      myDude.vy = -1.5 * sqrt(difficulty) * 1;
      jumped++;
     }
  } 
  if(input.isPressed){
    myDude.speed += (2 - myDude.speed) * 2.01;
  }else{
    myDude.speed += (1 - myDude.speed) * 0.2;
  }
  if(myDude.y > 99){
    end();
  }
  color("black");
  char(addWithCharCode("a", floor(ticks/15) % 2), myDudeX, myDude.y);
  nextRailDist -= scr;
  if(nextRailDist < 0){
    const r = {pos: vec(100, rnd(30,60)), width: rnd(45, 75) };
    rails.push(r);
    //let cx = rnd(20, 25);
    /* In case I want to add some sort of collectible to spawn on the rail 
    while( cx < r.width - 20){

    }*/
    nextRailDist += r.width + rnd(10,20);
  }
  let isONRail = false;
  
  remove(rails, (r) => {
    r.pos.x -= scr;
    //colour = rnd(1, 3);
    color(colors[rndi(0, 3)]);
    const c1 = rect(r.pos, r.width, 1).isColliding.char;
    if((c1.a || c1.b) && myDude.vy * 1 > 0 ){
      myDude.state = "run";
      myDude.y = r.pos.y + -3;
      jumped = 0;
    }
    if(r.pos.x - 3 < myDudeX && myDudeX < r.pos.x + r.width + 3 ){
      myDude.my = r.pos.y - (myDude.y - r.pos.y) + 2;
      isONRail = true;
    }
    return r.pos.x < -r.width;
  });
  if(!isONRail){
    myDude.state = "jump";
  }

}

addEventListener("load", onLoad);