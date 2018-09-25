// Run this from the commandline:
// phantomjs render.js | ffmpeg -y -c:v png -f image2pipe -r 24 -t 10  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart output.mp4

var page = require("webpage").create(),
  address = "/app/server/build/tmp/tmp.html",
  duration = 3, // duration of the video, in seconds
  framerate = 12, // number of frames per second. 24 is a good value.
  counter = 0,
  width = 500,
  height = 500;

page.viewportSize = { width: width, height: height };

page.open(address, function(status) {
  if (status !== "success") {
    console.log("Unable to load the address!");
    phantom.exit(1);
  } else {
    window.setTimeout(function() {
      page.clipRect = { top: 0, left: 0, width: width, height: height };

      window.setInterval(function() {
        counter++;
        page.render("/dev/stdout", { format: "png" });
        if (counter > duration * framerate) {
          phantom.exit();
        }
      }, 1 / framerate);
    }, 200);
  }
});
