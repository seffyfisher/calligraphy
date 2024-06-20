
var bgColor;
var imgDrawing;
var gridSizePreset = 20;
var gridSizeSteps = 5;
var gridSize;
var brushColor;
var gridElementColor;
var mobile;
var threshold = 50;
var interfaceColor;
var interfaceSW = 4.0;
var ptouches = [];
var touchSize = 80;

//--------------------------------------------------

function preload() {
  bgColor = color(255);
  interfaceColor = color(0);
  brushColor = color(255);
  gridElementColor = color(0);
  interfaceColor = color(0);
}

function setup() {
  ptouches = [];
  createCanvas(windowWidth, windowHeight);
  pixelDensity(2);
  document.body.style.backgroundColor = bgColor;
  mobile = checkDevice();
  gridSize = gridSizePreset;
  reset();
  imageMode(CENTER);
}

function draw() {
  //image(imgDrawing, width/2, height/2);
  display();
  displayTouch();
}

function display() {
    background(bgColor);
  rasterize();
}

//--------------------------------------------------


function mousePressed() {
  if (ptouches.length != touches.length) {
    updatePTouch();
  }

  if ((mouseX > width-205 && mouseY < 70) || (mouseX > width-70 && mouseY > height - 260)) {
  } else {
    if (touches.length > 0) {
      drawOnImg();
      updatePTouch();
    } else {
      drawOnImgDesktop();
    }
  }
}

function mouseDragged() {
  if (ptouches.length != touches.length) {
    updatePTouch();
  }
  if ((mouseX > width-205 && mouseY < 70) || (mouseX > width-70 && mouseY > height - 260)) {
  } else {
    if (touches.length > 0) {
      drawOnImg();
      updatePTouch();
    } else {
      drawOnImgDesktop();
    }
  }
}

function mouseReleased() {
  ptouches = [];
}

function drawOnImg() {
  imgDrawing.stroke(brushColor);
  imgDrawing.strokeWeight(gridSizePreset);
  imgDrawing.noFill();
  for (var i = 0; i<touches.length; i++) {
    imgDrawing.line(touches[i].x, touches[i].y, ptouches[i].x, ptouches[i].y);
    if (i==1) {
      break;
    }
  }
  if (touches.length > 1) {

    var tempT1 = createVector(touches[0].x, touches[0].y);
    var tempPT1 = createVector(ptouches[0].x, ptouches[0].y);
    var tempT2 = createVector(touches[1].x, touches[1].y);
    var tempPT2 = createVector(ptouches[0o1].x, ptouches[1].y);
    var dist1 = tempT1.dist(tempPT1);
    var dist2 = tempT2.dist(tempPT2);

    if (dist1 < gridSize && dist2 < gridSize) {
      imgDrawing.line(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    } else {
      var steps = ceil(max(dist1, dist2) / gridSize)*1.5;
      for (var j = 0; j<steps; j++) {
        var lerp1 = p5.Vector.lerp(tempT1, tempPT1, steps/(j+1));
        var lerp2 = p5.Vector.lerp(tempT2, tempPT2, steps/(j+1));
        imgDrawing.line(lerp1.x, lerp1.y, lerp2.x, lerp2.y);
      }
    }
  }
}

function drawOnImgDesktop() {
  imgDrawing.stroke(brushColor);
  imgDrawing.strokeWeight(gridSizePreset);
  imgDrawing.noFill();
  imgDrawing.line(mouseX, mouseY, pmouseX, pmouseY);
}

function updatePTouch() {
  ptouches = [];
  for (var i = 0; i < touches.length; i++) {
    ptouches.push(touches[i]);
  }
}

function displayTouch() {

  noFill();
  stroke(interfaceColor);
  strokeWeight(interfaceSW);

  if (touches.length == 1) {
    if ((touches[0].x > width-205 && touches[0].y < 70) || (touches[0].x > width-70 && touches[0].y > height - 260)) {
    } else {
      ellipse(gridify(touches[0].x), gridify(touches[0].y), this.touchSize, this.touchSize);

    }
  } else if (touches.length > 1) {

    var tempT1 = createVector(touches[0].x, touches[0].y);
    var tempT2 = createVector(touches[1].x, touches[1].y);
    var touchDist = tempT1.dist(tempT2);

    if (touchDist > this.touchSize) {
      ellipse(tempT1.x, tempT1.y, this.touchSize, this.touchSize);
      ellipse(tempT2.x, tempT2.y, this.touchSize, this.touchSize);
    } else {
      let factor = (1.0-(this.touchSize/touchDist))/2;
      let t1 = p5.Vector.lerp(tempT1, tempT2, factor);
      let t2 = p5.Vector.lerp(tempT1, tempT2, 1.0-factor);
      ellipse(t1.x, t1.y, this.touchSize, this.touchSize);
      ellipse(t2.x, t2.y, this.touchSize, this.touchSize);
    }

    strokeWeight(interfaceSW);
    let lineLength = max(touchDist-this.touchSize, 0);
    let factor = (1.0-(lineLength/touchDist))/2;
    let t1 = p5.Vector.lerp(tempT1, tempT2, factor);
    let t2 = p5.Vector.lerp(tempT1, tempT2, 1.0-factor);
    line(t1.x, t1.y, t2.x, t2.y);
  }
}

//--------------------------------------------------

function setColor() {
  var b = color(0);
  var w = color(255);
  if (brightness(brushColor) > 0) {
    brushColor = color(0);
    document.getElementById("colorToggleBlack").style.visibility = "hidden";
    document.getElementById("colorToggleWhite").style.visibility = "visible";
  } else {
    brushColor = color(255);
    document.getElementById("colorToggleBlack").style.visibility = "visible";
    document.getElementById("colorToggleWhite").style.visibility = "hidden";
  }
}

function setGridSize(val) {
  var gridSizeMin =  gridSizeSteps*3;
  var gridSizeMax =  gridSizeSteps*8;

  if (val == "+") {
    gridSize += gridSizeSteps;
  } else if (val == "-") {
    gridSize -= gridSizeSteps;
  } else {
    gridSize *= val;
    gridSize = round(gridSize/gridSizeSteps)*gridSizeSteps;
  }
  gridSize = constrain(gridSize, gridSizeMin, gridSizeMax);

  if (gridSize == gridSizeMin) {
    document.getElementById("gridMinus").style.opacity = "0.3";
  } else if (gridSize == gridSizeMax) {
    document.getElementById("gridPlus").style.opacity = "0.3";
  } else {
    document.getElementById("gridMinus").style.opacity = "1.0";
    document.getElementById("gridPlus").style.opacity = "1.0";
  }
}

//--------------------------------------------------

function gridify (IN) {
  var OUT = int(round(float(IN)/gridSize)*gridSize);
  return OUT;
}

function rasterize() {
  ellipseMode(CENTER);
  noStroke();
  fill(gridElementColor);
  for (let x = gridSize/2; x<=imgDrawing.width; x+= gridSize) {
    for (let y = gridSize/2; y<=imgDrawing.height; y+= gridSize) {
      if (brightness(imgDrawing.get(x, y)) >= threshold) {
        stroke(0);
        rect(x, y, gridSize-2, gridSize-2);    
      //  line(mouseX, mouseY, pmouseX, pmouseY);  
      }
    }
  }
}

//--------------------------------------------------

function reset() {

  imgDrawing = null;
  resizeImages();

  brushColor = color(255);
  document.getElementById("colorToggleBlack").style.visibility = "visible";
  document.getElementById("colorToggleWhite").style.visibility = "hidden";

  imgDrawing.background(0);
}

function resizeImages() {
  if (imgDrawing) {
    var imgDrawingTemp = createGraphics(windowWidth, windowHeight);
    var factor;
    if (windowWidth > imgDrawing.width || windowHeight > imgDrawing.height) factor = max([(windowWidth/imgDrawing.width), (windowHeight/imgDrawing.height)]);
    else factor = min([(windowWidth/imgDrawing.width), (windowHeight/imgDrawing.height)]);
    imgDrawingTemp.background(0);
    imgDrawingTemp.imageMode(CENTER);
    imgDrawingTemp.image(imgDrawing, imgDrawingTemp.width/2, imgDrawingTemp.height/2, imgDrawing.width*factor, imgDrawing.height*factor);
    imgDrawingTemp.imageMode(CORNER);
    imgDrawing = imgDrawingTemp;
    setGridSize(factor);
  } else {
    imgDrawing = createGraphics(width, height);
  }
}

//--------------------------------------------------

function saveIMG() {
  let filename = "IMG_" + year() + '-' + month() + '-' + day() + '_' + hour() + '-' + minute() + '-' + second() + '_' + round(millis()) + ".png";
  display();
  save("" + filename);
  saveCanvasToServer(filename);
}

function saveCanvasToServer(filename) {
  var canvasData = document.getElementById('defaultCanvas0').toDataURL('image/png');
  var formData = new FormData();
  var blob = dataURLtoBlob(canvasData);
  formData.append('imageData', blob, filename);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log('Image saved.');
    }
  };
  xhttp.open("POST", "saveImage.php", true);
  xhttp.send(formData);
}

function dataURLtoBlob(dataURL) {
  var arr = dataURL.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
