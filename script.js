// SM64 Font Generator - Main Script

(function () {
  "use strict";

  // ── Font Definitions ──
  // Each font defines where its character images are located.
  // The user can add new fonts by placing images in assets/<fontId>/
  // and adding a new entry here.
  const FONTS = [
    {
      id: "sm64",
      name: "Super Mario 64",
      basePath: "assets",
      categories: {
        mayus: {
          path: "mayus",
          chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ\u00d1".split(""),
          fileNames: null, // uses char + ".png"
        },
        minus: {
          path: "minus",
          chars: "abcdefghijklmnopqrstuvwxyz\u00f1".split(""),
          fileNames: null,
        },
        numbers: {
          path: "numbers",
          chars: "0123456789".split(""),
          fileNames: null,
        },
        symbols: {
          path: "symbols",
          chars: [",", "!", "\u00a1", "(", "%", ".", "#", "?", "\u00bf", '"', ")", "="],
          fileNames: {
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
          },
        },
      },
    },
  ];

  // ── State ──
  let currentFont = FONTS[0];
  let charImages = {};
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

  // ── Build Font Selector Buttons ──
  function buildFontSelector() {
    fontSelector.innerHTML = "";
    FONTS.forEach(function (font) {
      var btn = document.createElement("button");
      btn.className = "font-btn" + (font.id === currentFont.id ? " active" : "");
      btn.textContent = font.name;
      btn.setAttribute("data-font-id", font.id);
      btn.addEventListener("click", function () {
        selectFont(font);
      });
      fontSelector.appendChild(btn);
    });
  }

  // ── Select Font ──
  function selectFont(font) {
    currentFont = font;
    document.querySelectorAll(".font-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    document
      .querySelector('[data-font-id="' + font.id + '"]')
      .classList.add("active");
    imagesLoaded = false;
    loadFontImages(font).then(function () {
      imagesLoaded = true;
      renderPreview();
      buildCharmap();
    });
  }

  // ── Load Font Images ──
  function loadFontImages(font) {
    charImages = {};
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
        } else if (charImages[char]) {
          var img = charImages[char];
          var scale = fontSize / img.naturalHeight;
          width += img.naturalWidth * scale + spacing;
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
        } else if (charImages[char]) {
          var img = charImages[char];
          var scale = fontSize / img.naturalHeight;
          var drawWidth = img.naturalWidth * scale;
          var drawHeight = fontSize;
          ctx.drawImage(img, x, y, drawWidth, drawHeight);
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
      previewContainer.style.backgroundColor = "#111125";
      previewContainer.style.backgroundImage = [
        "linear-gradient(45deg, #1a1a30 25%, transparent 25%)",
        "linear-gradient(-45deg, #1a1a30 25%, transparent 25%)",
        "linear-gradient(45deg, transparent 75%, #1a1a30 75%)",
        "linear-gradient(-45deg, transparent 75%, #1a1a30 75%)",
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
