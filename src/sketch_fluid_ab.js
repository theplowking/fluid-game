//AB VERSION

// new Q5("global");

let fluid;

let pursuer;
let target;

let levels = []; //level map
let fish; //fish ani

let modeErase = false;

let vehicles = [];

let timer, buildCount, destoryCount;

var scene = 
	{
		gravity : -9.81,
		dt : 1.0 / 120,
		numIters : 150,
		frameNr : 0,
		overRelaxation : 1.9,
        cScale: 1,
        sqWidth: 0,
		obstacleX : 0.0,
		obstacleY : 0.0,
		obstacleRadius: 0.05,
		// paused: false,
		// sceneNr: 0,
		// showObstacle: false,
		// showStreamlines: false,
		// showVelocities: false,	
		// showPressure: false,
		// showSmoke: true,
		fluid: null
	};

function preload() {
    levels[1] = loadImage('src/assets/level1.png');
    levels[2] = loadImage('src/assets/level2.png');
    levels[3] = loadImage('src/assets/level3.png');
    fish = loadImage('src/assets/fish_slow.gif');
}

function setup() {
    createCanvas(1200, 600);

    colorMode(HSB);

    imageMode(CENTER);
    //frameRate(22);
    startGame();

}

    function startGame(){
    
    var res = 50;

    var simHeight = 1.1;	
    scene.cScale = height / simHeight;
    var simWidth = width / scene.cScale;
    

    var domainHeight = 1.0;
    var domainWidth = domainHeight / simHeight * simWidth;
    var h = domainHeight / res;
    
    var numX = Math.floor(domainWidth / h);
    var numY = Math.floor(domainHeight / h);
    scene.sqWidth = width/numX/ simHeight;
    //scene.sqWidth = scene.cScale * simHeight;
    var density = 1000.0;

    f = scene.fluid = new Fluid(density, numX, numY, h);

    var n = f.numY;


    console.log("inited new sim x", numX, "y", numY);

    //get level
    const urlParams = new URLSearchParams(window.location.search);
    let levelChoice = 1;
    if(urlParams.has('level')){
        levelChoice = urlParams.get('level');
     }

    //load level
    f.level = loadLevel(levelChoice);

    //start with level
    //f.s = f.level;

    //set up tank scene
    // for (var i = 0; i < f.numX; i++) {
    //     for (var j = 0; j < f.numY; j++) {
    //         var s = 1.0;	// fluid
    //         if (i == 0 || i == f.numX-1 || j == 0 )
    //             s = 0.0;	// solid
    //         f.s[i*n + j] = s
    //     }
    // }

    //set up wind tunnel
    for (var i = 0; i < f.numX; i++) {
        for (var j = 0; j < f.numY; j++) {
            var s = f.level[i*n + j].solid;// 1.0;	// fluid
            //console.log(s);
            if (i == 0 || j == 0 || j == f.numY-1)
                s = 0.0;	// solid
            f.s[i*n + j] = s
            //also include wall on level
            //f.level[i*n + j] = s
        }
    }

    resetSim(f);
        

    scene.gravity = 0.0;

    //setObstacle(0.4, 0.5, true);

    setupVehicles();

    console.log("tank set up");
    console.log(Math.floor(scene.fluid.numX * scene.fluid.numY / 2));

    timer = millis();
    buildCount = 0;
    destoryCount = 0;
    
}

function resetSim(f){

    var inVel = 1.4;

    f.u.fill(0);
    f.v.fill(0);
    f.p.fill(0);

    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < f.numY; j++) {

            if (i == 1) {
                f.u[i*f.numY + j] = inVel;
            }
        }
    }

    var pipeH = 0.8 * f.numY; //0.1
    var minJ = Math.floor(0.5 * f.numY - 0.5*pipeH);
    var maxJ = Math.floor(0.5 * f.numY + 0.5*pipeH);

    for (var j = minJ; j < maxJ; j+=10){
        //if(j % 5 == 0) f.m[j] = 0.0;
        //f.m[j-1] = 0.0;
        f.m[j] = 0.0;
        f.m[j+1] = 0.0;
    }
}

function draw() {

    //background(255);
    
    var f = scene.fluid;
    // scene.fluid.u[Math.floor(scene.fluid.numX * scene.fluid.numY / 2)] = 20;
    //scene.fluid.s[Math.floor(scene.fluid.numX * scene.fluid.numY / 2)] = 0;

    //update scene
    f.simulate(scene.dt, scene.gravity, scene.numIters);

    forceVehicles();

    // var inVel = 2;
    // for (var i = Math.floor(f.numX/3); i < Math.floor(2*f.numX/3); i++) {
    //     for (var j = Math.floor(f.numY/3); j < Math.floor(2*f.numY/3); j++) {
    //         f.u[i*f.numY + j] = inVel;
    //     }
    // }


    //render density
    renderDensity();

    renderText();

    noFill();
    stroke('black');
    strokeWeight(2);
    circle(x_to_canvas(scene.obstacleX), y_to_canvas(scene.obstacleY), (scene.obstacleRadius + + f.h) * scene.cScale * 2);

    showVehicles();

    checkVehicles();

}

function renderText(){
    let time = millis() - timer;
    let score = getScore();
    let t = `${modeErase ? "🄱" : "🅱"}uild ${!modeErase ? "🄴" : "🅴"}rase`;// "🄱🄵🄴 🅱🅵🅴";
    t += "      Time:" + (time /  1000).toFixed(1) + "s Builds:" + buildCount + " Erases:" + destoryCount + "      Score:"+ score.toFixed(1);
    fill('white');
    rect(0,0,width,30);
    fill('black');
    textSize(24);
    text(t, 5, 24);
}

function mouseClicked() {
    var x = canvas_to_x(mouseX);
    var y = canvas_to_y(mouseY);
    var u = scene.fluid.sampleField(x, y, U_FIELD);
    var v = scene.fluid.sampleField(x, y, V_FIELD);
    var s = scene.fluid.sampleField(x, y, S_FIELD);
    var p = scene.fluid.sampleField(x, y, P_FIELD);
    var b = scene.fluid.sampleField(x, y, B_FIELD);
    //console.log('U', u, 'V', v, "S", s, "P", p, "B", b);

    console.log(timer, buildCount, destoryCount);
    // prevent default
    //return false;
  }

function mouseDragged() {
    setObstacle(canvas_to_x(mouseX), canvas_to_y(mouseY), false);
    resetSim(f);
    // prevent default
    return false;
}

function keyPressed() {
    if (keyCode === 79) {
      loop();
    } else if (keyCode === 80) {
      noLoop();
    }
    if (keyCode === 69) {  //E
        modeErase = true;
      } else if (keyCode === 66) { //B
        modeErase = false;
      }
  }

// function to render density
function renderDensity() {

    f = scene.fluid;

    var n = f.numY;

    minP = f.p[0];
	maxP = f.p[0];

    for (var i = 0; i < f.numCells; i++) {
        minP = Math.min(minP, f.p[i]);
        maxP = Math.max(maxP, f.p[i]);
    }
    //console.log('minmax', minP, maxP);

    
    for (var i = 0; i < f.numX; i++) {
        for (var j = 0; j < f.numY; j++) {
        let x = i * scene.sqWidth;
        let y = j * scene.sqWidth;
        let d = f.s[i*n + j];

        var p = f.p[i*n + j];
		var s = f.m[i*n + j];
		//colorSet = getSciColor(p, minP, maxP);
        //console.log(map(p, minP, maxP, 200, 255), minP,maxP,p);
        //fill(d*255, d*255, d*255);
        
        if(d == 1){
            //not solid
            //fill(33 + map(s, 0, 1, 0, 150), map(p, minP, maxP, 200, 50), map(s, 0, 1, 160, 200));
            // from 33 to 183, from 200 to 50, from 160 to 200
            //fill(33 + map(s, 0, 1, 0, 0), map(p, minP, maxP, 200, 50), map(s, 0, 1, 160, 250));
            //H 150-220
            //S 70-100
            //L 30-80
            fill(map(p, minP, maxP, 220, 180), 100,map(s, 0, 1, 50, 95)) //map(s, 0, 1, 100, 200)
        }
        else
        {
            fill('brown');
        }

        //fill(33, map(p, minP, maxP, 50, 0) + map(s, 0, 1, 40, 150), 180);

        //fill(map(p, minP, maxP, 20, 70), map(s, 0, 1, 50, 190), 180);
        //fill(33, map(p, minP, maxP, 200, 50), 200);
        //fill(colorSet);
        //fill('red');
        noStroke();
        square(x, height - y - scene.sqWidth, scene.sqWidth);

        //check finish area
        if(f.level[i*n + j].finish == 1){
            //fill(0,220,0,100); //light green half
            fill(116,100,63,0.7);
            square(x, height - y - scene.sqWidth, scene.sqWidth);
        }

        //check death area
        if(f.level[i*n + j].death == 1){
            //fill(220,0,0,100); //light red half
            fill(360,100,63,0.7);
            square(x, height - y - scene.sqWidth, scene.sqWidth);
        }
        //console.log(d);
      }
    }

   }

function x_to_canvas(x) {
    return x * scene.cScale;
}

function y_to_canvas(y) {
    return height - (y * scene.cScale);
}

function canvas_to_x(x) {
    return x / scene.cScale;
}

function canvas_to_y(y) {
    //return y / scene.cScale;
    return (-y / scene.cScale) + (height/scene.cScale);
}

function getSciColor(val, minVal, maxVal) {
    val = Math.min(Math.max(val, minVal), maxVal- 0.0001);
    var d = maxVal - minVal;
    val = d == 0.0 ? 0.5 : (val - minVal) / d;
    var m = 0.25;
    var num = Math.floor(val / m);
    var s = (val - num * m) / m;
    var r, g, b;

    switch (num) {
        case 0 : r = 0.0; g = s; b = 1.0; break;
        case 1 : r = 0.0; g = 1.0; b = 1.0-s; break;
        case 2 : r = s; g = 1.0; b = 0.0; break;
        case 3 : r = 1.0; g = 1.0 - s; b = 0.0; break;
    }

    return[255*r,255*g,255*b, 255]
}

function setupVehicles(){
    var v = new Vehicle(1000,550);
    vehicles.push(v);
}

function forceVehicles(){
    // let steering = pursuer.pursue(target);
  // pursuer.applyForce(steering);

  // pursuer.update();
  // pursuer.show();
  
  
  vehicles.forEach(function(vehicle) {  
    //find force from fuild
    var x = canvas_to_x(vehicle.pos.x);
    var y = canvas_to_y(vehicle.pos.y);
    var u = scene.fluid.sampleField(x, y, U_FIELD);
    var v = scene.fluid.sampleField(x, y, V_FIELD);

    let fluidForce = createVector(u, -v);
    fluidForce.mult(0.5);
    vehicle.applyFuild(fluidForce);

    let target = createVector(mouseX, mouseY);

    
  //let steering = vehicle.it ? vehicle.evade(closest) : vehicle.pursue(target);
    let steering = vehicle.pursue(target);
    //steering.mult(5);
    //fluidForce.add(steering);
                  //let steering = vehicle.evade(vehicles[0]);
    vehicle.applyForce(steering);
                    //vehicle.edges();
     vehicle.update(checkWall, getForce);
     //console.log("fluid", fluidForce, "steer", steering);
  });

}

function checkWall(pos){
    var x = canvas_to_x(pos.x);
    var y = canvas_to_y(pos.y);
    var s = scene.fluid.sampleField(x, y, B_FIELD);
    //console.log('check',pos.x, s, s==0);
    return s == 0;
}

function checkWin(pos){
    var xNorm = canvas_to_x(pos.x);
    var yNorm = canvas_to_y(pos.y);

    var n = scene.fluid.numY;
    //scale both by numY as this is the basis of the scene
    var x = Math.floor(xNorm * (n-2));
    var y = Math.floor(yNorm * (n-1));

    x = Math.max(Math.min(x, scene.fluid.numX), 0);
    y = Math.max(Math.min(y, scene.fluid.numY), 0);
    
    var win = scene.fluid.level[x*n + y].finish;
    //debugger;
    //console.log("mouse", mouseX, mouseY,"canvas_x", xNorm, yNorm, "xy", x,y,win);
    return win == 1; //if level is 1 then they are in winning zone
}

function getScore(){
    let time = millis() - timer;
    let score = (time /  1000) + buildCount + destoryCount;
    return score;
}

function winGame() {
    let time = millis() - timer;
    let score = getScore();
    alert("Level complete! Time taken " +  (time /  1000).toFixed(1) + "s build count " + buildCount + " erase count " + destoryCount
            + "\nTotal Score " + score.toFixed(1));
    //console.log('is it asnyc');
    noLoop();
}

function loseGame() {
    alert("You died, try again");
    noLoop();
}

function checkDeath(pos){
    var xNorm = canvas_to_x(pos.x);
    var yNorm = canvas_to_y(pos.y);

    var n = scene.fluid.numY;
    //scale both by numY as this is the basis of the scene
    var x = Math.floor(xNorm * (n-2));
    var y = Math.floor(yNorm * (n-1));

    x = Math.max(Math.min(x, scene.fluid.numX), 0);
    y = Math.max(Math.min(y, scene.fluid.numY), 0);

    var death = scene.fluid.level[x*n + y].death;
    return death == 1; //if level is 1 then they are in winning zone
}

function getForce(pos){
    var x = canvas_to_x(pos.x);
    var y = canvas_to_y(pos.y);
    
    var u = scene.fluid.sampleField(x, y, U_FIELD);
    var v = scene.fluid.sampleField(x, y, V_FIELD);

    return createVector(u,v);
}

function showVehicles(){
 vehicles.forEach(function(vehicle) {  
    vehicle.show(fish);
  });
}

function checkVehicles(){
    vehicles.forEach(function(vehicle) {  
        if(checkWin(vehicle.pos)) {winGame();}
        if(checkDeath(vehicle.pos)) {loseGame();}
     });
   
   }

function setObstacle(x, y, reset) {

    var vx = 0.0;
    var vy = 0.0;

    if (!reset) {
        vx = (x - scene.obstacleX) / scene.dt;
        vy = (y - scene.obstacleY) / scene.dt;
    }
    //console.log('set obs', vx,vy);

    scene.obstacleX = x;
    scene.obstacleY = y;
    var r = scene.obstacleRadius;
    var f = scene.fluid;
    var n = f.numY;
    //var cd = Math.sqrt(2) * f.h;

    //reset with level
    //f.s = f.level;

    for (var i = 1; i < f.numX-2; i++) {
        for (var j = 1; j < f.numY-2; j++) {

            //f.s[i*n + j] = 1.0;//f.level[i*n + j];//1.0;
            //console.log(f.s[i*n + j], f.level[i*n + j]);

            dx = (i + 0.5) * f.h - x;
            dy = (j + 0.5) * f.h - y;

            if (dx * dx + dy * dy < r * r) {

                //add score if changing
                if(f.s[i*n + j] == 0.0 && modeErase)
                {
                    destoryCount++;
                }
                if(f.s[i*n + j] == 1.0 && !modeErase)
                {
                    buildCount++;
                }

                f.s[i*n + j] = modeErase ? 1.0 : 0.0;
                // if (scene.sceneNr == 2) 
                //     f.m[i*n + j] = 0.5 + 0.5 * Math.sin(0.1 * scene.frameNr)
                // else 
                f.m[i*n + j] = 1.0;
                f.u[i*n + j] = vx;
                f.u[(i+1)*n + j] = vx;
                f.v[i*n + j] = vy;
                f.v[i*n + j+1] = vy;
            }
        }
    }
    
    scene.showObstacle = true;
}

function loadLevel(level) {
    
    //image(img, 0, 0);
    let img = levels[level];

    let numY = img.height; //edges

    let result = [];//new Float32Array(numY * (img.width));
    //console.log('w vs h', nWidth, img.height, scene.fluid.numX, scene.fluid.numY);
    console.log(result.length, "vs", scene.fluid.s.length);


    for (var i = 0; i <= img.width; i++) {
        for (var j = 0; j <= numY; j++) {
            result[i*numY + j] = {
                solid: parseFloat(1 - (img.get(i,numY - j)[2] / 255).toFixed(1)), //from 0 to 1, have to flip
                finish: parseFloat((img.get(i,numY - j)[1] / 255).toFixed(1)), //green is finish area
                death: parseFloat((img.get(i,numY - j)[0] / 255).toFixed(0)) //red is death area
            }
            //result[i*numY + j].solid = 
            //console.log(img.get(i,j)[2], 1 - (img.get(i,j)[2] / 255));
        }
    } 

    //console.log('result', result);

    return result;
}