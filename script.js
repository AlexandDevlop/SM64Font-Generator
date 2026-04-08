// SM64 Font Generator - Main Script

(function () {
  "use strict";

  // ── Font Definitions ──
  // Each font defines where its character images are located.
  // The user can add new fonts by placing images in assets/<fontId>/
  // and adding a new entry here.
  // Symbol file name mapping for the original SM64 sprites (legacy names)
  var SM64_SYMBOL_FILENAMES = {
    ",": "comma.png",
    "!": "exclamation.png",
    "\u00a1": "exclamation\u00a1.png",
    "(": "left parenthesis.png",
    "%": "percent.png",
    ".": "point.png",
    "#": "pound sign.png",
    "?": "question.png",
    "\u00bf": "question\u00bf.png",
    '"': "quotation marks.png",
    ")": "right perenthesis.png",
    "=": "same.png",
  };

  // Symbol file name mapping for generated fonts (new naming convention)
  var GEN_SYMBOL_FILENAMES = {
    ",": "comma.png",
    "!": "exclamation.png",
    "\u00a1": "exclamation_inv.png",
    "(": "left_parenthesis.png",
    ")": "right_parenthesis.png",
    "%": "percent.png",
    ".": "point.png",
    "#": "pound_sign.png",
    "?": "question.png",
    "\u00bf": "question_inv.png",
    '"': "quotation_marks.png",
    "=": "same.png",
    "@": "at.png",
    "&": "ampersand.png",
    "+": "plus.png",
    "*": "asterisk.png",
    "-": "hyphen.png",
    "_": "underscore.png",
    "/": "slash.png",
    "\\": "backslash.png",
    ":": "colon.png",
    ";": "semicolon.png",
    "'": "apostrophe.png",
    "<": "less_than.png",
    ">": "greater_than.png",
    "[": "left_bracket.png",
    "]": "right_bracket.png",
    "{": "left_brace.png",
    "}": "right_brace.png",
    "~": "tilde.png",
    "^": "caret.png",
    "`": "backtick.png",
    "|": "pipe.png",
    "$": "dollar.png",
  };

  // Accented character filename mappings (ASCII-safe for static hosting)
  var UPPER_ACCENT_FILENAMES = {
    "\u00c1": "A_acute.png", "\u00c9": "E_acute.png", "\u00cd": "I_acute.png", "\u00d3": "O_acute.png", "\u00da": "U_acute.png",
    "\u00c0": "A_grave.png", "\u00c8": "E_grave.png", "\u00cc": "I_grave.png", "\u00d2": "O_grave.png", "\u00d9": "U_grave.png",
    "\u00c4": "A_umlaut.png", "\u00cb": "E_umlaut.png", "\u00cf": "I_umlaut.png", "\u00d6": "O_umlaut.png", "\u00dc": "U_umlaut.png",
    "\u00c2": "A_circumflex.png", "\u00ca": "E_circumflex.png", "\u00ce": "I_circumflex.png", "\u00d4": "O_circumflex.png", "\u00db": "U_circumflex.png",
    "\u00d1": "N_tilde.png",
  };
  var LOWER_ACCENT_FILENAMES = {
    "\u00e1": "a_acute.png", "\u00e9": "e_acute.png", "\u00ed": "i_acute.png", "\u00f3": "o_acute.png", "\u00fa": "u_acute.png",
    "\u00e0": "a_grave.png", "\u00e8": "e_grave.png", "\u00ec": "i_grave.png", "\u00f2": "o_grave.png", "\u00f9": "u_grave.png",
    "\u00e4": "a_umlaut.png", "\u00eb": "e_umlaut.png", "\u00ef": "i_umlaut.png", "\u00f6": "o_umlaut.png", "\u00fc": "u_umlaut.png",
    "\u00e2": "a_circumflex.png", "\u00ea": "e_circumflex.png", "\u00ee": "i_circumflex.png", "\u00f4": "o_circumflex.png", "\u00fb": "u_circumflex.png",
    "\u00f1": "n_tilde.png",
  };

  // Character sets
  var UPPER_BASIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  var UPPER_NTILDE = ["\u00d1"];
  var UPPER_ACCENTED = "\u00c1\u00c9\u00cd\u00d3\u00da\u00c0\u00c8\u00cc\u00d2\u00d9\u00c4\u00cb\u00cf\u00d6\u00dc\u00c2\u00ca\u00ce\u00d4\u00db".split("");
  var LOWER_BASIC = "abcdefghijklmnopqrstuvwxyz".split("");
  var LOWER_NTILDE = ["\u00f1"];
  var LOWER_ACCENTED = "\u00e1\u00e9\u00ed\u00f3\u00fa\u00e0\u00e8\u00ec\u00f2\u00f9\u00e4\u00eb\u00ef\u00f6\u00fc\u00e2\u00ea\u00ee\u00f4\u00fb".split("");
  var NUMBER_CHARS = "0123456789".split("");

  var SM64_SYMBOL_CHARS = [",", "!", "\u00a1", "(", "%", ".", "#", "?", "\u00bf", '"', ")", "="];
  var GEN_SYMBOL_CHARS = [",", "!", "\u00a1", "(", ")", "%", ".", "#", "?", "\u00bf", '"', "=",
    "@", "&", "+", "*", "-", "_", "/", "\\", ":", ";", "'", "<", ">", "[", "]", "{", "}", "~", "^", "`", "|", "$"];

  // SM64 original sprites - basic charset + Ñ/ñ only
  var SM64_FONT = {
    id: "sm64",
    name: "Super Mario 64 (Sprites)",
    basePath: "assets",
    categories: {
      mayus: { path: "mayus", chars: UPPER_BASIC.concat(UPPER_NTILDE), fileNames: UPPER_ACCENT_FILENAMES },
      minus: { path: "minus", chars: LOWER_BASIC.concat(LOWER_NTILDE), fileNames: LOWER_ACCENT_FILENAMES },
      numbers: { path: "numbers", chars: NUMBER_CHARS, fileNames: null },
      symbols: { path: "symbols", chars: SM64_SYMBOL_CHARS, fileNames: SM64_SYMBOL_FILENAMES },
    },
  };

  // Helper to create generated font definitions with extended charset
  function makeFontDef(id, name, basePath) {
    return {
      id: id,
      name: name,
      basePath: basePath,
      categories: {
        mayus: { path: "mayus", chars: UPPER_BASIC.concat(UPPER_NTILDE).concat(UPPER_ACCENTED), fileNames: UPPER_ACCENT_FILENAMES },
        minus: { path: "minus", chars: LOWER_BASIC.concat(LOWER_NTILDE).concat(LOWER_ACCENTED), fileNames: LOWER_ACCENT_FILENAMES },
        numbers: { path: "numbers", chars: NUMBER_CHARS, fileNames: null },
        symbols: { path: "symbols", chars: GEN_SYMBOL_CHARS, fileNames: GEN_SYMBOL_FILENAMES },
      },
    };
  }

  const FONTS = [
    SM64_FONT,
    makeFontDef("mario64", "Mario 64", "assets/mario64"),
    makeFontDef("sm64hud", "SM64 HUD", "assets/sm64hud"),
    makeFontDef("sm64text", "SM64 Text", "assets/sm64text"),
    makeFontDef("supermario256", "Super Mario 256", "assets/supermario256"),
    makeFontDef("typeface64", "Typeface Mario 64", "assets/typeface64"),
  ];

  // ── State ──
  let currentFont = FONTS[0];
  let charImages = {};
  let charBounds = {};
  let fontSize = 64;
  let spacing = 2;
  let lineHeightMultiplier = 1.5;
  let bgColor = "transparent";
  let textAlign = "left";
  let imagesLoaded = false;

  // ── DOM Elements ──
  const textInput = document.getElementById("text-input");
  const fontSelector = document.getElementById("font-selector");
  const sizeSlider = document.getElementById("size-slider");
  const sizeValue = document.getElementById("size-value");
  const spacingSlider = document.getElementById("spacing-slider");
  const spacingValue = document.getElementById("spacing-value");
  const lineHeightSlider = document.getElementById("line-height-slider");
  const lineHeightValue = document.getElementById("line-height-value");
  const canvas = document.getElementById("preview-canvas");
  const ctx = canvas.getContext("2d");
  const downloadBtn = document.getElementById("download-btn");
  const charmapContainer = document.getElementById("charmap");
  const charCountEl = document.getElementById("char-count");
  const previewContainer = document.getElementById("preview-container");
  const customBgColor = document.getElementById("custom-bg-color");

  // ── Initialize ──
  function init() {
    buildFontSelector();
    bindEvents();
    loadFontImages(currentFont).then(function () {
      imagesLoaded = true;
      renderPreview();
      buildCharmap();
    });
  }

  // ── Build Font Selector (Dropdown) ──
  function buildFontSelector() {
    fontSelector.innerHTML = "";
    FONTS.forEach(function (font) {
      var option = document.createElement("option");
      option.value = font.id;
      option.textContent = font.name;
      if (font.id === currentFont.id) {
        option.selected = true;
      }
      fontSelector.appendChild(option);
    });
  }

  // ── Select Font ──
  function selectFont(fontId) {
    var font = FONTS.find(function (f) { return f.id === fontId; });
    if (!font) return;
    currentFont = font;
    imagesLoaded = false;
    loadFontImages(font).then(function () {
      imagesLoaded = true;
      renderPreview();
      buildCharmap();
    });
  }

  // ── Compute Tight Bounding Box ──
  // Scans the image pixels to find the actual content bounds,
  // trimming transparent padding around character sprites.
  function computeTightBounds(img) {
    var tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = img.naturalWidth;
    tmpCanvas.height = img.naturalHeight;
    var tmpCtx = tmpCanvas.getContext("2d");
    tmpCtx.drawImage(img, 0, 0);
    var data = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height).data;
    var w = tmpCanvas.width;
    var h = tmpCanvas.height;
    var minX = w, maxX = 0, minY = h, maxY = 0;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var alpha = data[(y * w + x) * 4 + 3];
        if (alpha > 10) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (minX > maxX || minY > maxY) {
      return { x: 0, y: 0, w: w, h: h };
    }
    return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  }

  // ── Load Font Images ──
  function loadFontImages(font) {
    charImages = {};
    charBounds = {};
    var promises = [];

    Object.keys(font.categories).forEach(function (catKey) {
      var cat = font.categories[catKey];
      cat.chars.forEach(function (char) {
        var fileName;
        if (cat.fileNames && cat.fileNames[char]) {
          fileName = cat.fileNames[char];
        } else {
          fileName = char + ".png";
        }
        var path = font.basePath + "/" + cat.path + "/" + fileName;

        var p = new Promise(function (resolve) {
          var img = new Image();
          img.onload = function () {
            charImages[char] = img;
            charBounds[char] = computeTightBounds(img);
            resolve();
          };
          img.onerror = function () {
            // Skip characters that fail to load
            resolve();
          };
          img.src = path;
        });
        promises.push(p);
      });
    });

    return Promise.all(promises);
  }

  // ── Render Preview ──
  function renderPreview() {
    if (!imagesLoaded) return;

    var text = textInput.value;
    if (!text) {
      canvas.width = 1;
      canvas.height = 1;
      ctx.clearRect(0, 0, 1, 1);
      return;
    }

    var lines = text.split("\n");
    var lineHeight = Math.round(fontSize * lineHeightMultiplier);

    // Calculate dimensions for each line
    var lineWidths = [];
    var maxWidth = 0;

    lines.forEach(function (line) {
      var width = 0;
      for (var i = 0; i < line.length; i++) {
        var char = line[i];
        if (char === " ") {
          width += fontSize * 0.5;
        } else if (charImages[char] && charBounds[char]) {
          var bounds = charBounds[char];
          var scale = fontSize / charImages[char].naturalHeight;
          width += bounds.w * scale + spacing;
        }
      }
      if (width > 0) width -= spacing; // Remove trailing spacing
      lineWidths.push(width);
      if (width > maxWidth) maxWidth = width;
    });

    var totalHeight = lines.length * lineHeight;
    var padding = 20;

    canvas.width = Math.max(maxWidth + padding * 2, 1);
    canvas.height = Math.max(totalHeight + padding * 2, 1);

    // Draw background
    if (bgColor === "transparent") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw each line
    lines.forEach(function (line, lineIndex) {
      var lineWidth = lineWidths[lineIndex];
      var x;

      if (textAlign === "center") {
        x = padding + (maxWidth - lineWidth) / 2;
      } else if (textAlign === "right") {
        x = padding + (maxWidth - lineWidth);
      } else {
        x = padding;
      }

      var y = padding + lineIndex * lineHeight;

      for (var i = 0; i < line.length; i++) {
        var char = line[i];
        if (char === " ") {
          x += fontSize * 0.5;
        } else if (charImages[char] && charBounds[char]) {
          var img = charImages[char];
          var bounds = charBounds[char];
          var scale = fontSize / img.naturalHeight;
          var drawWidth = bounds.w * scale;
          var drawHeight = bounds.h * scale;
          var drawY = y + bounds.y * scale;
          // Draw only the trimmed portion of the image
          ctx.drawImage(
            img,
            bounds.x, bounds.y, bounds.w, bounds.h,
            x, drawY, drawWidth, drawHeight
          );
          x += drawWidth + spacing;
        }
      }
    });

    // Update checkerboard bg for preview container
    updatePreviewBg();
  }

  // ── Update Preview Background ──
  function updatePreviewBg() {
    if (bgColor === "transparent") {
      previewContainer.style.backgroundColor = "#484848";
      previewContainer.style.backgroundImage = [
        "linear-gradient(45deg, #505050 25%, transparent 25%)",
        "linear-gradient(-45deg, #505050 25%, transparent 25%)",
        "linear-gradient(45deg, transparent 75%, #505050 75%)",
        "linear-gradient(-45deg, transparent 75%, #505050 75%)",
      ].join(",");
    } else {
      previewContainer.style.backgroundColor = bgColor;
      previewContainer.style.backgroundImage = "none";
    }
  }

  // ── Build Character Map ──
  function buildCharmap() {
    charmapContainer.innerHTML = "";
    var count = 0;

    Object.keys(charImages).forEach(function (char) {
      var img = charImages[char];
      var item = document.createElement("div");
      item.className = "charmap-item";
      item.title = char;

      var imgEl = document.createElement("img");
      imgEl.src = img.src;
      imgEl.alt = char;
      item.appendChild(imgEl);

      var label = document.createElement("span");
      label.className = "char-label";
      label.textContent = char;
      item.appendChild(label);

      item.addEventListener("click", function () {
        // Insert character into text input
        var start = textInput.selectionStart;
        var end = textInput.selectionEnd;
        var text = textInput.value;
        textInput.value = text.substring(0, start) + char + text.substring(end);
        textInput.focus();
        textInput.selectionStart = textInput.selectionEnd = start + char.length;
        renderPreview();
      });

      charmapContainer.appendChild(item);
      count++;
    });

    charCountEl.textContent = count + " caracteres";
  }

  // ── Download as PNG ──
  function downloadPNG() {
    if (canvas.width <= 1 || canvas.height <= 1) return;

    var link = document.createElement("a");
    link.download = "sm64-text.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  // ── Bind Events ──
  function bindEvents() {
    textInput.addEventListener("input", function () {
      renderPreview();
    });

    // Font dropdown change
    fontSelector.addEventListener("change", function () {
      selectFont(this.value);
    });

    sizeSlider.addEventListener("input", function () {
      fontSize = parseInt(this.value);
      sizeValue.textContent = fontSize;
      renderPreview();
    });

    spacingSlider.addEventListener("input", function () {
      spacing = parseInt(this.value);
      spacingValue.textContent = spacing;
      renderPreview();
    });

    lineHeightSlider.addEventListener("input", function () {
      lineHeightMultiplier = parseInt(this.value) / 10;
      lineHeightValue.textContent = lineHeightMultiplier.toFixed(1);
      renderPreview();
    });

    downloadBtn.addEventListener("click", downloadPNG);

    // Background color buttons
    document.querySelectorAll(".bg-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var bg = btn.getAttribute("data-bg");
        if (bg === "custom") {
          bgColor = customBgColor.value;
        } else {
          bgColor = bg;
        }
        document
          .querySelectorAll(".bg-btn")
          .forEach(function (b) {
            b.classList.remove("active");
          });
        btn.classList.add("active");
        renderPreview();
      });
    });

    customBgColor.addEventListener("input", function () {
      var customBtn = document.querySelector('[data-bg="custom"]');
      document
        .querySelectorAll(".bg-btn")
        .forEach(function (b) {
          b.classList.remove("active");
        });
      customBtn.classList.add("active");
      bgColor = this.value;
      renderPreview();
    });

    // Alignment buttons
    document.querySelectorAll(".align-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        textAlign = btn.getAttribute("data-align");
        document
          .querySelectorAll(".align-btn")
          .forEach(function (b) {
            b.classList.remove("active");
          });
        btn.classList.add("active");
        renderPreview();
      });
    });
  }

  // Start
  init();
})();
