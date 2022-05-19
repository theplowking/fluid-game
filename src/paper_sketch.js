document.addEventListener("DOMContentLoaded", function(event) { 
    document.getElementById("download-to-svg").onclick = function(){
      
     var fileName = "custom.svg"
     var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
     var link = document.createElement("a");
     link.download = fileName;
     link.href = url;
     debugger
     link.click();
    }
   });

function map(n, start1, stop1, start2, stop2, withinBounds) {
	const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
	if (!withinBounds) {
	  return newval;
	}
	
	if (start2 < stop2) {
		return(Math.max( Math.min(newval,stop2), start2 ));
	} else {
		return(Math.max( Math.min(newval,start2), stop2 ));
	}
  };

