import * as d3 from "https://cdn.skypack.dev/d3@5?dts";
import {stemmer} from "https://cdn.skypack.dev/stemmer?dts";

type Verse = {
  ref: String,
  text: String,
};

type Word = {
  book: number,
  chapter: number,
  verse: number,
  word: number,
  text: string,
};

// const normalizeWord = (d: string) => stemmer(d.toLowerCase());
const normalizeWord = (d: string) => d.toLowerCase();


const wordMap = new Map<string, number>();
const bookMap = new Map<string, number>();
const bookMapInv = new Map<number, string>();
let words = [] as Word[];

const versesToWords = (verses: Verse[]) => {
  let wordIndex = 0;
  let bookIndex = 0;
  return verses.map(v => {
    const [book, chapter, verse] = v.ref.split(".");
    return (v.text.match(/\w+(?:\u2019\w+)*/g) || []).map((word) : Word => {
      const stem = normalizeWord(word);
      if (!wordMap.has(stem)) {
        wordMap.set(stem, wordIndex);
        wordIndex += 1;
      }
      if (!bookMap.has(book)) {
        bookMap.set(book, bookIndex);
        bookMapInv.set(bookIndex, book);
        bookIndex += 1;
      }
      return {book: bookMap.get(book) as number, chapter: +chapter, verse: +verse, word: wordMap.get(stem) as number, text: word};
    });
  }).flat();
};

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const backCanvas = document.getElementById("background") as HTMLCanvasElement;
const backContext = backCanvas.getContext("2d") as CanvasRenderingContext2D;
const hoverCanvas = document.getElementById("hover") as HTMLCanvasElement;
const hoverContext = hoverCanvas.getContext("2d") as CanvasRenderingContext2D;

let padding = 50;
let sectionWidth = 10;
let hoverSize = {x: 50, y: 25};
let minSize = 0.5;
let wordOpacity = 1.0;
let hoverOpacity = 0.8;

let size = 1;
let columns = 1;
let height = 1;
let hoverSection = 0;
let hoverRow = 0;
let hoverIndex = 0;
let hoverRows = 1;

const initializeView = () => {
  // Set actual size in memory (scaled to account for extra pixel density).
  var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
  canvas.width = Math.floor(canvas.clientWidth * scale);
  canvas.height = Math.floor(canvas.clientHeight * scale);
  backCanvas.width = Math.floor(canvas.clientWidth * scale);
  backCanvas.height = Math.floor(canvas.clientHeight * scale);
  hoverCanvas.width = Math.floor(canvas.clientWidth * scale);
  hoverCanvas.height = Math.floor(canvas.clientHeight * scale);
  // Normalize coordinate system to use css pixels.
  ctx.scale(scale, scale);
  backContext.scale(scale, scale);
  hoverContext.scale(scale, scale);

  // To fit entire Bible on screen, we need this to hold:
  // canvas.width * canvas.height = size^2 * words.length
  size = Math.sqrt((canvas.clientWidth - 2 * padding) * (canvas.clientHeight - 2 * padding) / words.length);
  columns = Math.floor((canvas.clientWidth - 2 * padding) / size);
  height = Math.ceil(words.length / columns);
  hoverRows = Math.ceil((canvas.clientHeight - 2 * padding) / hoverSize.y);

  drawBackground();
  draw();
}

const wordLocation = {
  forward: (i: number, sizeX: number, sizeY?: number) => {
    const section = Math.floor(i / (sectionWidth * height));
    const x = sizeX * (section * sectionWidth + i % sectionWidth) + padding;
    const y = (sizeY || sizeX) * Math.floor((i % (sectionWidth * height)) / sectionWidth) + padding;
    return [x, y];
  },
  backwardCoords: ([x, y]: [number, number], size: number): {section: number, row: number, col: number} => {
    const row = Math.floor((y - padding) / size);
    if (row < 0 || row >= height) {
      return {section: -1, row: -1, col: -1};
    }
    const globalCol = Math.floor((x - padding) / size);
    if (globalCol < 0) {
      return {section: -1, row: -1, col: -1};
    }
    const section = Math.floor(globalCol / sectionWidth);
    const col = globalCol % sectionWidth;
    return {section, row, col};
  },
  backward: ([x, y]: [number, number], size: number) => {
    const {section, row, col} = wordLocation.backwardCoords([x, y], size);
    return section * (sectionWidth * height) + row * sectionWidth + col;
  },
};

const drawBackground = () => {
  backContext.clearRect(0, 0, backCanvas.width, backCanvas.height);
  words.forEach((w, i) => {
    const [x, y] = wordLocation.forward(i, size);
    // let color = chapterColor(w.book);
    let color = d3.interpolateGreys(0.1 + 0.5*(((w.book * 37) % 61) / 60));
    // if (w.book < 39) {
    //   color = (d3.color(color) as d3.RGBColor).darker(1.5).toString();
    // }
    backContext.fillStyle = color;
    // backContext.fillRect(x, y, size, size);
  });

  let curBook = -1;
  const lineColor = "rgb(220,220,220)";
  backContext.fillStyle = lineColor;
  const [lastX, lastY] = wordLocation.forward(words.length - (words.length % sectionWidth), size);
  backContext.fillRect(padding, padding, lastX + size * sectionWidth - padding, 1);
  backContext.fillRect(padding, size * height + padding, lastX - padding, 1);
  backContext.fillRect(padding, padding, 1, size * height);
  backContext.fillRect(lastX + size * sectionWidth, padding, 1, lastY - padding);
  backContext.fillRect(lastX, lastY, size * sectionWidth, 1);
  backContext.fillRect(lastX, lastY, 1, size * height - (lastY - padding));
  words.forEach((w, i) => {
    if (w.book !== curBook) {
      const [x, y] = wordLocation.forward(i - (i % sectionWidth), size);
      backContext.fillRect(x, y, size * sectionWidth, 1);
      backContext.fillRect(x + size * sectionWidth, padding, 1, y - padding);
      backContext.fillRect(x, y, 1, (canvas.clientHeight - padding) - y);
      curBook = w.book;
    }
  });

  curBook = -1;
  backContext.fillStyle = "rgb(50,50,50)";
  words.forEach((w, i) => {
    if (w.book !== curBook) {
      const [x, y] = wordLocation.forward(i - (i % sectionWidth), size);
      backContext.fillText(bookMapInv.get(w.book) || "", x + 2, y + 10);
      curBook = w.book;
    }
  });

};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const stems = searches.map(d => d.value).map(normalizeWord);
  words.forEach((w, i) => {
    const [x, y] = wordLocation.forward(i, size);
    for (let s = 0; s < stems.length; s += 1) {
      if (w.word === wordMap.get(stems[s])) {
        let color = d3.color(searchColors[s].value) as d3.RGBColor;
        color.opacity = wordOpacity;
        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.ellipse(x + size / 2, y + size / 2, size + minSize, size + minSize, 0, 0, Math.PI * 2);
        ctx.fill();
        // ctx.fillRect(x - minSize / 2, y - minSize / 2, size + minSize, size + minSize);
      }
    }
  });
};

const drawHover = () => {
  hoverContext.clearRect(0, 0, canvas.width, canvas.height);
  info.innerText = "";
  if (hoverIndex < 0) {
    return;
  }
  hoverContext.font = "15px sans-serif";
  const stems = searches.map(d => d.value).map(normalizeWord);
  const startIndex = Math.max(0, hoverSection * (sectionWidth * height) + hoverRow * sectionWidth);

  let xShift = 0;
  if (hoverIndex < words.length / 2) {
    xShift = (canvas.clientWidth - 2 * padding) - (hoverSize.x * sectionWidth);
  }

  const start = words[startIndex];
  const ref = `${bookMapInv.get(start.book)} ${start.chapter}:${start.verse}`;
  hoverContext.fillText(ref, padding + xShift, padding - 3);

  words.slice(startIndex, startIndex + hoverRows * sectionWidth).forEach((w, i) => {
    let [x, y] = wordLocation.forward(startIndex + i, size);
    hoverContext.fillStyle = "rgb(150,150,150)";
    hoverContext.fillRect(x, y, size, size);

    [x, y] = wordLocation.forward(i, hoverSize.x, hoverSize.y);
    x += xShift;

    let backgroundColor = `rgba(255,255,255,${hoverOpacity})`;
    let textColor = [0, 0, 0];
    for (let s = 0; s < stems.length; s += 1) {
      if (w.word === wordMap.get(stems[s])) {
        let color = d3.color(searchColors[s].value) as d3.RGBColor;
        color.opacity = hoverOpacity;
        backgroundColor = color.toString();
        textColor = [255, 255, 255];
      }
    }
    hoverContext.fillStyle = backgroundColor;
    hoverContext.fillRect(x, y, hoverSize.x, hoverSize.y);
    hoverContext.fillStyle = `rgb(${textColor.join(",")})`;
    hoverContext.fillText(w.text, x + 1, y + hoverSize.y - 2, hoverSize.x - 2);
  });
};

const searches = [
  document.getElementById("search0") as HTMLInputElement,
  document.getElementById("search1") as HTMLInputElement,
  document.getElementById("search2") as HTMLInputElement,
  document.getElementById("search3") as HTMLInputElement,
];
const searchColors = [
  document.getElementById("color0") as HTMLInputElement,
  document.getElementById("color1") as HTMLInputElement,
  document.getElementById("color2") as HTMLInputElement,
  document.getElementById("color3") as HTMLInputElement,
];

const sizeInput = document.getElementById("size") as HTMLInputElement;
const fadeInput = document.getElementById("fade") as HTMLInputElement;
const copyLink = document.getElementById("copy-link") as HTMLInputElement;
const copyLinkButton = document.getElementById("copy-link-button") as HTMLButtonElement;
const shareButton = document.getElementById("share-button") as HTMLButtonElement;
const info = document.getElementById("info") as HTMLDivElement;

fetch("kjv.json").then(d => d.json().then(d => {
  words = versesToWords(d);

  sizeInput.addEventListener("input", () => {
    minSize = +sizeInput.value;
    draw();
    drawHover();
  });

  fadeInput.addEventListener("input", () => {
    wordOpacity = +fadeInput.value;
    draw();
    drawHover();
  });

  shareButton.addEventListener("click", () => {
    let params = "?";
    searches.forEach((s, i) => {
      params += `&search${i}=` + encodeURIComponent(s.value);
    });
    searchColors.forEach((c, i) => {
      params += `&color${i}=` + encodeURIComponent(c.value);
    });
    params += `&size=${minSize}`;
    params += `&fade=${wordOpacity}`;
    copyLink.value = window.location.origin + params;
  });

  copyLinkButton.addEventListener("click", () => {
    copyLink.select();
    copyLink.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyLink.value);
  });

  searchColors.forEach((s, i) => {
    s.value = d3.schemeTableau10[i];
  });

  // Load params from url

  function getQueryVariable(variable: string) {
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return undefined;
  }

  searches.forEach((s, i) => {
    let val = getQueryVariable(`search${i}`);
    if (val !== undefined) {
      s.value = val;
    }
  });

  searchColors.forEach((c, i) => {
    let val = getQueryVariable(`color${i}`);
    if (val !== undefined) {
      c.value = val;
    }
  });

  let sizeVal = getQueryVariable("size");
  if (sizeVal !== undefined) {
    minSize = +sizeVal;
    sizeInput.value = sizeVal;
  }

  let fadeVal = getQueryVariable("fade");
  if (fadeVal !== undefined) {
    wordOpacity = +fadeVal;
    fadeInput.value = fadeVal;
  }

  searches.forEach(s => s.addEventListener("input", () => {
    draw();
    drawHover();
  }));

  searchColors.forEach(s => s.addEventListener("input", () => {
    draw();
    drawHover();
  }));

  function brush(event: MouseEvent) {
    const {section, row, col} = wordLocation.backwardCoords([event.offsetX, event.offsetY], size);
    hoverIndex = wordLocation.backward([event.offsetX, event.offsetY], size);
    hoverSection = section;
    hoverRow = Math.floor(row - Math.min(hoverRows / 2));
    drawHover();
  }

  hoverCanvas.addEventListener("mousemove", event => {
    brush(event);
  });

  window.addEventListener("resize", initializeView);
  initializeView();
}));


