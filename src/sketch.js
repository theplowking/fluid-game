function setup() {
  createCanvas(600, 600);
  colorMode(HSL);
  noLoop();
}

function draw() {
  render();
}

function render() {
  //background(225);

  backdraw(170+r(60),50,80);
  let step = r(20);
  let start = -300 + Math.random()*150;

  sea(150-(0*30),30)

  for (let i = 1; i <= 4; i++) {
    //let w = (width+200) - (i*100);
    let w = 100 + r(300);
    let x = -200 + r(800);
    //let x = Math.random()*(width - w); //use available space
    let h = w * (0.2 + (Math.random()*0.2));
    let y = 100 + (i*100);
    let hue = 10+(i*step);
    mountain(x, y, w, h, hue, i);
    

    //sea

    let color = 200;
    let alpha = 0.9;
    //fill('rgba('+color+','+color+','+color+','+alpha+')');
    sea(150-(i*30),30)
    //rect(0,height,width,-100+(i*20));
  }

  //mountain(10, 300, 580, 300);
}

function mountain(x,y,widthX,heightY, hue, mount){
  noFill();

  let x1 = x,
   x2 = x + (widthX*0.33) + (Math.random()*(widthX*0.2)),
   x3 = x + (widthX*0.66) + (Math.random()*(widthX*0.2)),
   x4 = x + widthX;
  let y1 = y,
   y2 = y1 - (heightY*0.2) - (Math.random()*(heightY*0.66)),
   y3 = y2 + (heightY*0.5) - (Math.random()*heightY),
   y4 = y3 + (heightY*0.2) + (Math.random()*(heightY*0.66));
  
  //strokeCap(PROJECT);
  blendMode(BLEND);
  //stroke(255);
  let a = [];
  for (let i = 0; i <= 100; i++) {
    a.push(Math.random()*(heightY*0.33))
  }
  
  let lines = 50;
  let colorStep = 100 + r(100);
  let alpha = 0;
  let toplid = r(2);
  let grow = r(0.8);
  let lean = r(0.4);
  console.log(lean, grow+0.6);
  
  for (let n = 0; n <= lines; n++) {
    //stroke('rgba(10,10,10,'+(0.9-((n/lines)/1.5))+')');
    let dark = 10 + ((n/lines)*50);
    let color = (n/lines)*colorStep;
    alpha = 1-(((n*n)/(lines*lines))*0.5);
    //stroke('rgba('+color+','+color+','+color+','+alpha+')');
    if(n<toplid){
      stroke(hue+20, 30 + (mount*10), 50-dark, 1);
    }
    else
    {
      stroke(hue, 30 + (mount*10), 50-dark, 1);
    }
    
    strokeCap(Math.random() > 0.1 ? ROUND : PROJECT);
    //stroke('rgba(225,225,225,0.2)');
    let offset = 25 + (n*5);
    let thinkness = (offset/2) + (Math.random()*10);
    //console.log((lean*(n/lines))-0.2, (grow*(n/lines))+0.6);
    
    strokeWeight(thinkness);
    let steps = 10;
    beginShape();
    for (let i = 0; i <= steps; i++) {
      let t = i / steps;
      let x = bezierPoint(x1, x2, x3, x4, t) + (10 - (Math.random()*20))*(n/lines);
      x=x-(x*0.6*(n/lines)) + x*(((0.6+grow)*(n/lines))); //grow or shrink
      
      let y = bezierPoint(y1, y2, y3, y4, t) + (2*offset) - (a[i]*(1-(n/lines))) + (10 - (Math.random()*20))*(n/lines);
      //circle(x, y, 5);
      curveVertex(x, y);
    }
    endShape();
  }
}

function r(size){
  return Math.random()*size;
}

function sea(y, h){
  noFill;
  //console.log(y);
  blendMode(HARD_LIGHT);
  for (let i = 0; i < h; i++) {
    //console.log(y+i);
    stroke(200+((y-i)/3),50,50,0.3);
    strokeWeight(3+r(3));
    beginShape();
    for (let j = -1; j < 12; j++) {
      curveVertex(j * 60, height -y + i + r(4));
    }
    endShape();
  }
}

function backdraw(h,s,b){
  let c1 = color(h,s,b);
  let c2 = color(h,s-20,b-20-r(50));
  
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    let newc = lerpColor(c1,c2,n);
    stroke(newc);
    line(0,y,width, y);
  }

  // noStroke();
  
  // for (let i = 0; i < 360; i++) {
  //   for (let j = 0; j < 100; j++) {
  //     stroke(i, 50 + (j/2), 50);
  //     point(i, j);
  //   }
  // }
}