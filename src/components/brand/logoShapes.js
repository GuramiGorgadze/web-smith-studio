// Vector redraw of the Web Smith Studio mark, fitted to the supplied logo artwork.
// Coordinates live in the original 1254 x 1254 artboard; LOGO_VIEWBOX crops it to the mark.

export const LOGO_VIEWBOX = "319 146 617 928";
export const LOGO_ASPECT = 0.6649;

export const logoGradients = [
  { id: "gTL", type: "linear", x1: 638, y1: 163.3, x2: 412.6, y2: 442.6, stops: [[0.000, "#5163fc"], [0.167, "#4152fc"], [0.333, "#3749fc"], [0.500, "#313cfc"], [0.667, "#2b30fd"], [0.833, "#2724fc"], [1.000, "#4631fc"]] },
  { id: "gTR", type: "radial", cx: 811, cy: 214, r: 201, stops: [[0.419, "#cac2fc"], [0.516, "#b6b0fb"], [0.613, "#a29dfb"], [0.710, "#8f8dfb"], [0.806, "#7c7bfc"], [0.903, "#6564fc"], [1.000, "#8b82fc"]] },
  { id: "gS", type: "radial", cx: 404, cy: 476, r: 171, stops: [[0.000, "#4a7efd"], [0.167, "#4678fc"], [0.333, "#4270fc"], [0.500, "#3e5ffc"], [0.667, "#3849fc"], [0.833, "#3532fa"], [1.000, "#3f2efb"]] },
  { id: "gURt", type: "linear", x1: 617.9, y1: 464.3, x2: 735.8, y2: 623.1, stops: [[0.000, "#cac1fa"], [0.167, "#b1aafb"], [0.333, "#8e8afb"], [0.500, "#6b6cfc"], [0.667, "#5153fb"], [0.833, "#3839fc"], [1.000, "#2f2cfd"]] },
  { id: "gURb", type: "radial", cx: 787, cy: 707, r: 106, stops: [[0.000, "#2728fb"], [0.167, "#2a2cfc"], [0.333, "#2f30fc"], [0.500, "#3839fc"], [0.667, "#4040fc"], [0.833, "#4c48fd"], [1.000, "#5b54fc"]] },
  { id: "gUL", type: "radial", cx: 557, cy: 431, r: 212, stops: [[0.264, "#dbd3fc"], [0.387, "#c4bdfb"], [0.509, "#a8a2fb"], [0.632, "#8a87fb"], [0.755, "#706dfb"], [0.877, "#4e4bfc"], [1.000, "#3e3bfd"]] },
  { id: "gL", type: "linear", x1: 405, y1: 660.6, x2: 532.3, y2: 705.6, stops: [[0.000, "#fcecfd"], [0.167, "#f6e5fd"], [0.333, "#ebd8fc"], [0.500, "#d7c3fc"], [0.667, "#c3affc"], [0.833, "#a493fc"], [1.000, "#8077fc"]] },
  { id: "gBL", type: "linear", x1: 421, y1: 935.7, x2: 581.6, y2: 861.8, stops: [[0.000, "#fbeffc"], [0.167, "#ecd5fc"], [0.333, "#cdb2fb"], [0.500, "#a68ffb"], [0.667, "#8577fb"], [0.833, "#6865fc"], [1.000, "#5d60fa"]] },
  { id: "gBR", type: "linear", x1: 696.1, y1: 836.9, x2: 750.6, y2: 1029.6, stops: [[0.000, "#6663fb"], [0.167, "#5353fc"], [0.333, "#4445fc"], [0.500, "#3231f9"], [0.667, "#2d22f1"], [0.833, "#2917e5"], [1.000, "#3117e3"]] },
];

// Drawn back to front. `fill` is a gradient id from the list above, or a plain color.
export const logoShapes = [
  { points: "351,404 629,150 690,208 477,404", fill: "gTL" },
  { points: "690,208 893,404 780,404 630,262", fill: "gTR" },
  { points: "323,487 392,445 502,582 449,648", fill: "gS" },
  { points: "626,453 658,453 765,588 711,658 630,558 626,558", fill: "gURt" },
  { points: "804,645 891,754 784,754 751,715", fill: "gURb" },
  { points: "606,453 634,453 634,560 630,558 557,650 502,582", fill: "gUL" },
  { points: "502,582 557,650 474,754 365,754", fill: "gL" },
  { points: "866,445 932,489 731,754 627,754", fill: "#ffffff" },
  { points: "355,809 475,809 630,954 569,1012", fill: "gBL" },
  { points: "781,809 900,809 629,1070 569,1012", fill: "gBR" },
];
