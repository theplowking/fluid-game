let seaHeight = 0.66;

function setup() {
    let w = 600;//297 * 300 / 25.4 / 4;
    let h = 1000;//210 * 300 / 25.4 / 4;
    createCanvas(1000, h, SVG); // Create SVG Canvas
    
  }
  
  function draw() {
    background(220);
    
    fill(255);
    strokeWeight(1);
    stroke(0);

    //draw mountains
    //drawMounts(0);
    

    
    //draw sea
    for (let i=0;i<15;i++){

      
      if(i%7==0){
        drawMounts(i*10);
      }
      

      noiseDetail(1,0.2);
      let lineH = map(i*i*i,0,Math.pow(15,3),height*seaHeight, height);
      strokeWeight(1);
      stroke(0);
      //line(0,lineH, width, lineH);
      let lineH2 = map(i*i*i,0,Math.pow(15,3),0, 120);

      for (let i2=0;i2<10;i2++){
        let lineH3 = map(i2*i2*i2,0,Math.pow(10,3),0, lineH2);
        //line(0,lineH + lineH3, width, lineH + lineH3);

        fill(255);

        beginShape();

        
        curveVertex(-50,lineH + 100);
        curveVertex(-50,lineH + 100);

        for (let x=-1;x<=101;x++){
          
          let lineH4 = noise(x/50,i/100) * lineH3;
          //strokeWeight(lineH2);
          //stroke(255,0,0,50);
          curveVertex(width/100*x, lineH + lineH3 + lineH4);
          //curveVertex(x, lineH);
          
        }

        curveVertex(width+50,lineH + 100);
        curveVertex(width+50,lineH + 100);


        endShape();
      }

      
    }

    noLoop();
  }

  function drawMounts(offset){
    noiseDetail(5,0.45);
    let onOff = false;

    for (let y=0;y<random(20);y++){
      
      beginShape();
      //vertex(-50,height*seaHeight + offset);
      //vertex(-50,height*seaHeight);
      for (let x=-1;x<=201;x++){
            
        let mountH = (height*seaHeight*1.2) + (2*offset) - (noise(x/50, y/20 + offset/5) * (height*seaHeight-offset) * (20-y)/20);
        

        if(mountH < height*seaHeight + offset){
          if(!onOff){
            vertex(width/200*x, height*seaHeight + offset);
            onOff = true;
          }
          vertex(width/200*x, mountH);
        }
        else{
          if(onOff){
            vertex(width/200*x, height*seaHeight + offset);
            onOff = false;
          }
        }

        
        
      }
      if(onOff){
        vertex(width+20, height*seaHeight + offset);
        onOff = false;
      }
      //vertex(width+50,height*seaHeight + offset);
      //curveVertex(width+50,height*seaHeight);
      endShape();
    }
  }