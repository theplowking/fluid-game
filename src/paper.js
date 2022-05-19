paper.install(window);
// Create a circle shaped path with its center at the center
// of the view and a radius of 30:
// var path = new Path.Circle({
// 	center: view.center,
// 	radius: 30,
// 	strokeColor: 'black'
// });

var openGroup = new Group(); // Don't insert in DOM.
var closedGroup = new Group();

// Make a ring using subtraction of two circles:
// var inner = new Path.Circle({
//     center: view.center,
//     radius: 100,
//     //parent: originals,
//     fillColor: 'blue'
// });

// var outer = new Path.Circle({
//     center: view.center,
//     radius: 140,
//     //parent: originals,
//     fillColor: 'green',
// 	hidden: true
// });

// var ring = outer.subtract(inner);
// var offset = new Point(140, 80);
// ring.position = view.center + offset;
// ring.fillColor = 'orange';

// var path = new Path();
// path.strokeColor = 'black';
// path.add(new Point(30, 30));
// path.add(new Point(100, 100));
// path.add(new Point(30, 100));

// path.closed = true;

/////////////////////////////////

let waveCount=500;
let pathArray = [];
let lastOpenPath;
//let pathGroup = new Group({ insert: false }); // Don't insert in DOM.
//let pathGroupOpen = new Group({ insert: false }); // Don't insert in DOM.
  //console.log("start");
  
  for(let wave=0;wave<waveCount;wave++){
  
  //translate(3,(height+100)/waveCount);
  
  
  var path = new Path({
	strokeColor: 'black',
	insert: true
    //fillColor: 'white'
});
  
  var offset1 = new Point(map(wave,0,waveCount, 0, 700), map(wave,0,waveCount, 0, view.size.height));
  //var offset2 = new Point(view.size.width, view.size.height/2);
  var offset2 = new Point(view.size.width-200, 0);
  
  //wave1   
  let size = 200;
  for(let set=0;set<6;set++){
    let curlF = map(set,0,4,1,0.3);
	if(set==5){curlF=2;}
    //b = wave curl
    let b=map(Math.sin( map(wave,0,waveCount,0,Math.PI) ),0,1, 10,curlF);
    waveDraw(size,size*set*2, b, path, offset1, offset2);
	
  }

  //clone and add to the main array
  //path.strokeColor.alpha = 0;
  path.smooth();
  let openPath = path.clone({insert:true});
  
  openPath.parent = openGroup;
  //openPath.fillColor = 'red';
  //pathArray.push(openPath);

  //path.parent = pathGroup;

  path.lineBy(0, 100);
  path.lineBy(size*6*2, 0);
  path.fillColor = 'green';
  path.fillColor.alpha = 0;
  path.parent = closedGroup;
  path.closed = true;

  
  }

  // Save a reference to the children array in a variable, so we don't end up with very long lines of code:
	var childrenClosed = closedGroup.children;
	var childrenOpen = openGroup.children;
  
	// Iterate through closed groups:
	for (var i = childrenClosed.length - 1; i > -1; i--) {
		var childClosed = childrenClosed[i];
		//childClosed.fillColor.hue = (i/childrenClosed.length) * 360;
		//childClosed.fillColor.alpha = 0.2;
		// Iterate through closed groups:
		for (var j = i - 1; j > -1; j--) {
			
			var childOpen = childrenOpen[j];
			//childOpen.strokeColor = 'green';
			//childOpen.strokeColor.hue = (j/childrenOpen.length) * 360;
			//console.log(i,j, childOpen.children);

			if(childOpen.children){
				// has compoundPath
				console.log('has children ', childOpen.children.length);
			
				for (var k = 0; k < childOpen.children.length; k++) {
					subtractPath(childClosed, childOpen.children[k]);
				}
			}
			else{
				subtractPath(childClosed, childOpen);
			}


			//if(j>24){childOpen.visible=false;}
			
			//children[i].remove();
		}

		
		childClosed.remove();
	}

//   pathArray.forEach((element) => {
// 	element.strokeColor = 'red';
// 	console.log(pathArray.length, '2');
//   });
function subtractPath(mask, target){
	if(mask.intersects(target)){
		//target.strokeColor = 'red';
		//target.strokeColor.alpha = 1;
		//debugger
		
		let newPathClone = target.subtract(mask, {insert: true, trace: false});
		//newPathClone.strokeColor = 'blue';
		target.replaceWith(newPathClone);
		
	}
}

function waveDraw(size, offset, state, path, offset1, offset2){
  
	for(let om=0;om>-2*Math.PI*0.9;om-=(2*Math.PI/50)){
	  
	  let r1 = size*Math.exp(state*om);
	  let x1 = r1*Math.cos(om);
	  let y1 = r1*Math.sin(om)/2;
	  //console.log(om,r1,x1,y1);
	  if(r1<0.001){break;}
	  
	  let p = new Point(x1 - offset,y1);
	  path.add(p + offset1 + offset2);
	}
	
	for(let om=-2*Math.PI*0.6;om<-Math.PI;om+=(2*Math.PI/50)){
	  
	  let r1 = size*Math.exp(state*(om+Math.PI));
	  let x1 = r1*Math.cos(om);
	  let y1 = r1*Math.sin(om)/2;
	  
	  if(r1>0.001 && r1<1200){
			let p = new Point(x1 - offset,y1);
			path.add(p + offset1 + offset2);
		}
	  
	}
  }

function onResize(event) {
	// Whenever the window is resized, recenter the path:
	//path.position = view.center;
}

