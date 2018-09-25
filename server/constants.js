const WIDTH = 500;
const HEIGHT = 500;

const IDEOGRAPHICS = {
  "⿰": {
    description: "left-to-right",
    components: ["left-to-right-1", "left-to-right-2"],
    width: WIDTH * 1,
    height: HEIGHT * 0.5
  },
  "⿱": {
    description: "above-to-below",
    components: ["above-to-below-1", "above-to-below-2"],
    width: WIDTH * 0.5,
    height: HEIGHT * 1
  },
  "⿲": {
    description: "left-to-middle-and-right",
    components: [
      "left-to-middle-and-right-1",
      "left-to-middle-and-right-2",
      "left-to-middle-and-right-3"
    ],
    width: WIDTH * 1,
    height: HEIGHT * 0.33
  },
  "⿳": {
    description: "above-to-middle-and-below",
    components: [
      "above-to-middle-and-below-1",
      "above-to-middle-and-below-2",
      "above-to-middle-and-below-3"
    ],
    width: WIDTH * 0.33,
    height: HEIGHT * 1
  },
  "⿴": {
    description: "full-surround",
    components: ["full-surround-1", "full-surround-2"],
    width: WIDTH * 1,
    height: HEIGHT * 1
  },
  "⿵": {
    description: "surround-from-above",
    components: ["surround-from-above-1", "surround-from-above-2"],
    width: WIDTH * 1,
    height: HEIGHT * 1
  },
  "⿶": {
    description: "surround-from-below",
    components: ["surround-from-below-1", "surround-from-below-2"],
    width: WIDTH * 1,
    height: HEIGHT * 1
  },
  "⿷": {
    description: "surround-from-left",
    components: ["surround-from-left-1", "surround-from-left-2"],
    width: WIDTH * 1,
    height: HEIGHT * 1
  },
  "⿸": {
    description: "surround-from-upper-left",
    components: ["surround-from-upper-left-1", "surround-from-upper-left-2"],
    width: WIDTH * 1,
    height: HEIGHT * 1
  },
  "⿹": {
    description: "surround-from-upper-right",
    components: ["surround-from-upper-right-1", "surround-from-upper-right-2"],
    width: WIDTH * 1,
    height: HEIGHT * 1
  },
  "⿺": {
    description: "surround-from-lower-left",
    components: ["surround-from-lower-left-1", "surround-from-lower-left-2"],
    width: WIDTH * 1,
    height: HEIGHT * 1
  },
  "⿻": {
    description: "overlaid",
    components: ["overlaid-1", "overlaid-2"],
    width: WIDTH * 1,
    height: HEIGHT * 1
  },
  船: {
    description: "chuan",
    components: ["chuan-1", "chuan-2", "chuan-3"],
    width: WIDTH * 1,
    height: HEIGHT * 1
  },
  新: {
    description: "xin",
    components: ["xin-1", "xin-2", "xin-3"],
    width: WIDTH * 1,
    height: HEIGHT * 1
  },
  帮: {
    description: "bang",
    components: ["bang-1", "bang-2", "bang-3"],
    width: WIDTH * 1,
    height: HEIGHT * 1
  },
  舞: {
    description: "wu",
    components: ["wu-1", "wu-2", "wu-3"],
    width: WIDTH * 1,
    height: HEIGHT * 1
  }
};

const COLORS = {
  1: "#1aa3ff",
  2: "#c9bc28",
  3: "#3bbf31",
  4: "#ff0000"
};

module.exports = {
  COLORS: COLORS,
  IDEOGRAPHICS: IDEOGRAPHICS
};
