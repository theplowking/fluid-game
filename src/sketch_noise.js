var inc = 0.05;
var scl = 40;
var cols, rows;

var zoff = 0;

var fr;

var particles = [];

var flowfield;

function setup() {
    createCanvas(500, 500, SVG); // Create SVG Canvas
    strokeWeight(1); // do 0.1 for laser
    stroke(255, 0, 0); // red is good for laser
    noFill(); // better not to have a fill for laser

    cols = floor(width / scl) + 1;
    rows = floor(height / scl) + 1;
    
    noiseSeed(99);
    flowfield = new Array(cols * rows);

  }
  
  function draw() {
    
    //background(251,251,251,10);
    var yoff = 0;
    for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
        var index = x + y * cols;
        var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(1);
        flowfield[index] = v;
        xoff += inc;
        //stroke(230,230,230);
        //drawVec(x,y,v, scl)
        }
        yoff += inc;

        zoff += 0.0001;
    }
    
    
    for (var i = 0; i < 500; i++) {
    addCurve(random(width), random(height), 100, 20, 0);
    //addCurve(random(width), random(height), 100, -20, 0);
    }

    //save("mySVG.svg"); // give file name
    print("saved svg");
    noLoop(); // we just want to export once
  }

  function addCurve(x, y, steps, dist, angle){
  
    var v = createVector(x,y);
    noFill();
    stroke(0,0,0, 255);
    curveVertex(v.x, v.y);
    beginShape();
    for (var i = 0; i < steps; i++) {
      curveVertex(v.x, v.y);
      var a = getVector(v.x, v.y);
      if(!a){break}
      a.mult(dist);
      a.rotate(angle);
      v.add(a);
      if(v.x < 0 || v.x > width || v.y < 0 || v.y > height){break}
    }
    endShape();
  }
  
  function getVector(x, y){
    
    let alphax = (x % scl) / scl;
    let alphay = (y % scl) / scl;
    
    x = floor(x / scl);
    y = floor(y / scl);
  
    var i1 = x + y * cols;
    var i2 = (x+1) + y * cols;
    var i3 = x + (y+1) * cols;
    var i4 = (x+1) + (y+1) * cols;
    var v1 = flowfield[i1];
    var v2 = flowfield[i2];
    var v3 = flowfield[i3];
    var v4 = flowfield[i4];
    
    if(!v1 || !v2 || !v3 || !v4){return null;}
    
    var res = p5.Vector.lerp(
      p5.Vector.lerp(v1, v2, alphax),
      p5.Vector.lerp(v3, v4, alphax),
      alphay
      );
    
    return res;
    
  }
    
  function drawVec(x,y,v, scale){
        push();
        translate(x*scale,y*scale);
        rotate(v.heading());
        strokeWeight(1);
        line(0, 0, scl, 0);
        pop();
  }