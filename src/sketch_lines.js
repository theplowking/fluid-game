function setup() {
  createCanvas(600, 600);
  noLoop();
}

function draw() {
  render();
}

function render() {
  
  let y = 300;
  let yn = 300;
  let rate = 1;
  let seed = Math.floor(Math.random() * 15) + 4;
  console.log(seed);
  //background(220);
  
  let r=50 + (Math.random() * 100);
  let g=50 + (Math.random() * 100);
  let b=50 + (Math.random() * 100);
  
  let rCreep = Math.random() > 0.8 ? 1.01 : 1;
  let gCreep = Math.random() > 0.8 ? 0.99 : 1;
  let bCreep = Math.random() > 0.8 ? 1.01 : 1;
  
  backdraw(r/2,g/2,b/1.3);
  
  strokeWeight(70);
  strokeCap(PROJECT);
  //blendMode(LIGHTEST);
  blendMode(SCREEN);

  for (let i = 0; i < 10; i++) {
    
    r *= rCreep;
    g *= gCreep;
    b *= bCreep;
    //console.log(r);
    stroke('rgba('+Math.round(r)+','+Math.round(g)+','+Math.round(b)+',0.3)');
    
    beginShape();
    for (let j = -1; j < 11; j++) {
      strokeCap(j % seed === 0 ? ROUND : PROJECT);

      rate = 1 + (Math.random() - 0.5) / 20;
      yn = y * rate;
      curveVertex(j * 60, y);
      //line(, j * 60 + 50, yn);
      y = yn;
    }
    curveVertex(600, y);
    endShape();
    y=300 + ((Math.random()-0.5)*200);
  }
}

function backdraw(r,b,g){
  let c1 = color(b,r,g);
  let c2 = color(g, b, r);
  
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    let newc = lerpColor(c1,c2,n);
    stroke(newc);
    line(0,y,width, y);
  }
}
