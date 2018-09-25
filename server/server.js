import bodyParser from "body-parser";
import express from "express";
import path from "path";
const Maker = require("html-maker");
const app = express();
const moment = require("moment");
const mongoist = require("mongoist");
const mongodb = mongoist(process.env.MONGODB_URL);

const { COLORS, IDEOGRAPHICS } = require("./constants");

const child_process = require("child_process");

let tmp_dir = "/app/server/build/tmp";

const fs = require("fs");
const db = fs
  .readFileSync("hanzi.json")
  .toString()
  .split("\n")
  .filter(line => line)
  .map(line => {
    return JSON.parse(line);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const extendTimeoutMiddleware = (req, res, next) => {
  const space = " ";
  let isFinished = false;
  let isDataSent = false;

  // Only extend the timeout for API requests
  if (!req.url.includes("/api")) {
    next();
    return;
  }

  res.once("finish", () => {
    isFinished = true;
  });

  res.once("end", () => {
    isFinished = true;
  });

  res.once("close", () => {
    isFinished = true;
  });

  res.on("data", data => {
    // Look for something other than our blank space to indicate that real
    // data is now being sent back to the client.
    if (data !== space) {
      isDataSent = true;
    }
  });

  const waitAndSend = () => {
    setTimeout(() => {
      // If the response hasn't finished and hasn't sent any data back....
      if (!isFinished && !isDataSent) {
        // Need to write the status code/headers if they haven't been sent yet.
        if (!res.headersSent) {
          res.writeHead(202);
        }

        res.write(space);

        // Wait another 15 seconds
        waitAndSend();
      }
    }, 15000);
  };

  waitAndSend();
  next();
};

app.use(extendTimeoutMiddleware);

const router = express.Router();

const staticFiles = express.static(path.join(__dirname, "../../client/build"));
app.use(staticFiles);

router.get("/hanzilist", (req, res) => {
  let hanzilist = db.map(hanzi => hanzi.character);
  res.json(hanzilist);
});

router.get("/count", async (req, res) => {
  let count = await mongodb.hanzimemes_log.count();
  res.json(count);
});

router.post("/generate", (req, res) => {
  let payload = req.body;

  mongodb.hanzimemes_log.insert({
    ...payload,
    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    headers: req.headers
  });

  var view = async html => {
    Promise.all(
      payload.components.map(component => {
        html.div({ class: component.class }, () => {
          html.img({
            src: component.img.images.downsized.gif_url
          });
        });
      })
    );
  };
  var body = Maker.render_external(view);

  let html = fs
    .readFileSync("template.html")
    .toString()
    .replace("{{ body }}", body)
    .replace("{{ width }}", payload.width)
    .replace("{{ height }}", payload.height);

  try {
    fs.existsSync(tmp_dir) || fs.mkdirSync(tmp_dir);
    fs.readdirSync(tmp_dir).forEach(file => fs.rmdirSync(`${tmp_dir}/${file}`));
  } catch (err) {
    console.log("Error", err);
  }

  fs.writeFileSync(`${tmp_dir}/tmp.html`, html);

  child_process.execSync(
    `phantomjs render.js | ffmpeg -y -c:v png -f image2pipe -r 24 -t 10  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart ${tmp_dir}/tmp.mp4`
  );

  let random =
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 5) + ".gif";

  child_process.execSync(
    `ffmpeg -y -i ${tmp_dir}/tmp.mp4 -filter:v "setpts=2*PTS,fps=fps=50" -vf scale=iw*0.5:ih*0.5 ${tmp_dir}/${random}`
  );

  res.json(random);
});

router.get("/gif/:gif", (req, res) => {
  let gif = req.params.gif;
  res.sendFile(tmp_dir + "/" + gif);
});

router.get("/hanzi-api/:hanzi", (req, res) => {
  let hanzi = req.params.hanzi;
  let result = db.find(entry => entry.character === hanzi);
  res.json(result || {});
});

app.use(router);

// any routes not picked up by the server api will be handled by the react router
app.use("/*", staticFiles);

app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"), () => {
  console.log(`Listening on ${app.get("port")}`);
});
