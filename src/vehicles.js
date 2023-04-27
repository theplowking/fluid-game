//added paths

class Vehicle {
    constructor(x, y) {
      this.pos = createVector(x, y);
      //this.vel = createVector(0, 0);
      this.vel = createVector(0, 0);//p5.Vector.random2D();
      //this.vel.mult(4);
      this.acc = createVector(0, 0);
      this.fluid = createVector(0, 0);
      this.maxSpeed = 1;
      this.maxForce = 0.5;
      this.r = 8;
      this.it = false;
      
      this.lastPath = 0;
      this.currentPath = [];
      this.paths = [this.currentPath];
    }
  
    evade(vehicle) {
      let pursuit = this.pursue(vehicle);
      pursuit.mult(-1);
      return pursuit;
    }
  
    pursue(target) {
      //let target = vehicle.pos.copy();
      //let prediction = vehicle.vel.copy();
      //prediction.mult(10);
      //target.add(prediction);

      // fill(0, 255, 0);
      // strokeWeight(0.5);
      // line(vehicle.pos.x, vehicle.pos.y, target.x, target.y);
      //line(this.pos.x,this.pos.y,target.x, target.y);
      //line(this.pos.x,this.pos.y,vehicle.pos.x,vehicle.pos.y);
      //circle(target.x, target.y, 8);
      return this.seek(target);
    }
  
    flee(target) {
      return this.seek(target).mult(-1);
    }
  
    seek(target) {
      let force = p5.Vector.sub(target, this.pos);
      force.setMag(this.maxSpeed);
      force.sub(this.vel);
      force.limit(this.it ? this.maxForce / 1.5 : this.maxForce);
      return force;
    }
  
    applyForce(force) {
      this.acc.add(force);
    }

    applyFuild(force) {
        this.fluid = force;
    }
  
    update(checkWall, getForce) {

        //add the fluid flow movement
      this.pos.add(this.fluid);

      this.vel.add(this.acc);
      this.vel.limit(this.it ? this.maxSpeed * 2 : this.maxSpeed);

      let checkPos = this.pos.copy();
      let checkVel = this.vel.copy();
      checkVel.mult(10);
      checkPos.add(checkVel);
        
      //only add velocity if there is nothing blocking
        if (!checkWall(checkPos)) {
            this.pos.add(this.vel);
        }
        // else{
        //     this.pos.sub(this.vel);
        // };
      //console.log('checkwall', );

      
      this.acc.set(0, 0);
    
      
      //add a path if 0.1 secs elasped
      if(millis() - this.lastPath > 250){
        this.currentPath.push(this.pos.copy());
        this.lastPath = millis();
      }
      
  
      // Count positions
      let total = 0;
      
      for (let path of this.paths) {
        
        total += path.length;
        //make path move with fluid
        let count = 0
        for (let v of path) {
            count++;
            if(count == 1) continue;
            v.add(getForce(v));
          }
      }
  
      if (total > 15) {
        this.paths[0].shift();
        if (this.paths[0].length === 0) {
          this.paths.shift();
        }
      }
    }
  
    show(fish) {
      
      
      for (let path of this.paths) {
        beginShape();
        noFill();
        //noStroke();
        let i = 0;
        for (let v of path) {
          //fill(map(i,0,path.length, 0, 255));
          //fill(255,255,255,30);
          i++;
          //vertex(v.x, v.y);
          if(i>13) continue;
          //fill(255,255,255,i*2);
          fill(0,0,100,i/15 * 0.3);
          //stroke(255,255,255,(i*10));
          stroke(0,0,100,i*(1/15));
          circle(v.x, v.y, i/2);
        }
        endShape();
      }

      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.vel.heading() + (PI/2)); //rotate 90
      //triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
      image(fish, 0, 0, 32, 32); 

      pop();


    }
  
    edges() {
      let hitEdge = false;
      if (this.pos.x > width + this.r) {
        this.pos.x = -this.r;
        hitEdge = true;
      } else if (this.pos.x < -this.r) {
        this.pos.x = width + this.r;
        hitEdge = true;
      }
      if (this.pos.y > height + this.r) {
        this.pos.y = -this.r;
        hitEdge = true;
      } else if (this.pos.y < -this.r) {
        this.pos.y = height + this.r;
        hitEdge = true;
      }
  
      if (hitEdge) {
        this.currentPath = [];
        this.paths.push(this.currentPath);
      }
    }
  }
  
  class Target extends Vehicle {
    constructor(x, y) {
      super(x, y);
      //this.vel = p5.Vector.random2D();
      //this.vel.mult(4);
    }
  
    // show() {
    //   stroke(255);
    //   strokeWeight(2);
    //   fill('#F063A4');
    //   push();
    //   translate(this.pos.x, this.pos.y);
    //   circle(0, 0, this.r * 3);
    //   pop();
    // }
  }
  