let seaHeight = 0.66;

var a = 600;
var b = 0.02;
function setup() {
  angleMode(DEGREES);
  createCanvas(1600, 1200);
  background(0);
  //scale(0.5);
}

function draw() {
    background(255);
    stroke(0);
    translate(800,-100);
    fill(255);
    let waveCount=200;
    //console.log("start");
    
    for(let wave=0;wave<waveCount;wave++){
    
    translate(3,(height+100)/waveCount);
    let b=map(sin( map(wave,0,waveCount,0,180) ),0,1, 0.2,0.01);
    //b=map(wave,0,waveCount,0.02,0.1)
    console.log(wave,b);
    beginShape();
    
    //corner
    vertex(width/2,height);
    
    //wave1 
    a=300;
    
    for(let om=0;om>-360*1.5;om--){
      
      let r1 = a*Math.exp(b*om);
      let x1 = r1*cos(om)*1.5;
      let y1 = r1*sin(om)/1.5;
      if(r1<0.001){break;}
      vertex(x1,y1);//console.log(r1,x1,y1);
    }
    //console.log("2nd ##################");
    for(let om=-360*1.5;om<-180;om++){
      
      let r1 = a*Math.exp(b*(om+180));
      let x1 = r1*cos(om)*1.5;
      let y1 = r1*sin(om)/1.5;
      
      if(r1>0.001 && r1<1200){vertex(x1,y1);}//console.log(r1,x1,y1);
      
    }
      
      //wave2
    for(let om=0;om>-360*1.5;om--){
      
      let r1 = a*Math.exp(b*om);
      let x1 = r1*cos(om)*1.5;
      let y1 = r1*sin(om)/1.5;
      if(r1<0.001){break;}
      vertex(x1-900,y1);//console.log(r1,x1,y1);
    }
    //console.log("2nd ##################");
    for(let om=-360*1.5;om<-180;om++){
      
      let r1 = a*Math.exp(b*(om+180));
      let x1 = r1*cos(om)*1.5;
      let y1 = r1*sin(om)/1.5;
      
      if(r1>0.001 && r1<400){vertex(x1-900,y1);}//console.log(r1,x1,y1);
      
    }
      
    vertex(-width/2,height);
    
    endShape();
    
    //curve wave
    //b+=0.008;
    }
    
    noLoop();
  }
    