// RESPONSIVE SIZING --------------------------------------------------------------------------------------------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  document.body.style.position = "fixed";
  document.body.style.padding = 0;
  document.body.style.margin = 0;
  document.body.style.overflow = "hidden";

  gridSize = gridSizePreset;
  resizeImages();
}

// MOBILE DEVICE METHODS FOR GESTURES ------------------------------------------------------------------

// prevent zoom-to-tabs gesture in safari
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
  document.body.style.zoom = 0.99999;
}
);

// prevent zoom-to-tabs gesture in safari
document.addEventListener('gesturechange', function(e) {
  e.preventDefault();
  document.body.style.zoom = 0.99999;
}
);

// prevent zoom-to-tabs gesture in safari
document.addEventListener('gestureend', function(e) {
  e.preventDefault();
  document.body.style.zoom = 1.0;
}
);

// CHECK CHECK ------------------------------------------------------------------

function checkDevice() {
  var details = navigator.userAgent;
  var regexp = /android|iphone|kindle|ipad/i;
  var isMobileDevice = regexp.test(details);
  return isMobileDevice;
}
