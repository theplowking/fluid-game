var inc = 0.05;
var scl = 40;
var cols, rows;

var zoff = 0;

var fr;

var particles = [];

var flowfield;

function setup() {
    let w = 297 * 300 / 25.4;
    let h = 210 * 300 / 25.4;
    createCanvas(h, w, SVG); // Create SVG Canvas
    strokeWeight(1); // do 0.1 for laser
    stroke(255, 0, 0); // red is good for laser
    noFill(); // better not to have a fill for laser

    cols = floor(width / scl) + 1;
    rows = floor(height / scl) + 1;
    let rn = floor(random(1000));
    //214,272,372,243,107,887,989,883
    //887, 876
    noiseSeed(345);
    console.log(rn);
    flowfield = new Array(cols * rows);

  }
  
  function draw() {
    background(255);
    let slicesH = 30;
    let slicesW = 500;
    let maxH = height/ slicesH;
    let xoff = 0;
    let toff = 0;
    let noiseScale=0.01;
    
    noFill();
    strokeWeight(1);
    stroke(0);
    
    noiseDetail(1, 0.2);
    
    let printing = true;
    let onOff = 0;
    let flip = 0;
    let offsetY = 0;
    
    for (let step=0; step < slicesH-5; step++){

      // if(printing && onOff>3){printing = false; onOff = 0; flip++; continue;}
        
      // if(!printing && onOff>3){printing = true; onOff = 0; offsetY = step/slicesH*600;}

      // onOff++;
      // if(!printing){continue;}

      beginShape();
      for (let slice=-1; slice <= slicesW + 1; slice++){
        //let angle = xoff;
        //noise height
        let subyMax = noise(slice * (width/slicesW) * noiseScale/10 - zoff, step * (height/slicesH) *noiseScale/10) * maxH * 30;
        let yMax = noise(slice * (width/slicesW) * noiseScale/1.75 - zoff, step * (height/slicesH) *noiseScale/2) * subyMax;
        //scaled sine hight
        //let yMax = map(sin(toff), -1, 1, 0, maxH);
        //let y = map(sin(angle), -1, 1, 0, yMax);
        //if(flip%2!==0){yMax = -(300-yMax)};
        
        //yMax = -(offsetY-yMax)
        curveVertex(slice * (width/slicesW),(step*maxH) + offsetY + (slice%2==0 ? yMax : 0));
        // xoff++;
        // toff+=noise(xoff * noiseScale);
      }
      endShape();

    }
    //zoff+=0.02;
    noLoop();
  }