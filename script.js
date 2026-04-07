// ===== State =====
const state = {
  font: 'Mario64',
  color: '#FFFFFF',
  fontSize: 72,
  letterSpacing: 0,
  lineHeight: 1.2,
  maxWidth: 800,
  align: 'center',
  strokeEnabled: false,
  strokeColor: '#000000',
  strokeWidth: 3,
  bgTransparent: true,
  bgColor: '#0000AA'
};

// ===== DOM Elements =====
const textInput = document.getElementById('textInput');
const previewText = document.getElementById('previewText');
const previewArea = document.getElementById('previewArea');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const colorPicker = document.getElementById('colorPicker');
const colorHex = document.getElementById('colorHex');
const strokeEnabled = document.getElementById('strokeEnabled');
const strokeOptions = document.getElementById('strokeOptions');
const strokeColor = document.getElementById('strokeColor');
const strokeWidth = document.getElementById('strokeWidth');
const strokeWidthVal = document.getElementById('strokeWidthVal');
const fontSize = document.getElementById('fontSize');
const letterSpacing = document.getElementById('letterSpacing');
const lineHeight = document.getElementById('lineHeight');
const maxWidth = document.getElementById('maxWidth');
const bgTransparent = document.getElementById('bgTransparent');
const bgColor = document.getElementById('bgColor');
const bgColorRow = document.getElementById('bgColorRow');
const exportCanvas = document.getElementById('exportCanvas');

// ===== Update Preview =====
function updatePreview() {
  const text = textInput.value || 'Type something!';
  previewText.textContent = text;
  previewText.style.fontFamily = `'${state.font}', sans-serif`;
  previewText.style.fontSize = state.fontSize + 'px';
  previewText.style.color = state.color;
  previewText.style.letterSpacing = state.letterSpacing + 'px';
  previewText.style.lineHeight = state.lineHeight;
  previewText.style.textAlign = state.align;
  previewText.style.maxWidth = state.maxWidth + 'px';
  previewText.style.width = '100%';

  if (state.strokeEnabled) {
    const sw = state.strokeWidth;
    previewText.style.webkitTextStroke = `${sw}px ${state.strokeColor}`;
    previewText.style.paintOrder = 'stroke fill';
  } else {
    previewText.style.webkitTextStroke = 'unset';
    previewText.style.paintOrder = 'unset';
  }
}

// ===== Tabs =====
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ===== Font Selection =====
document.querySelectorAll('.font-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.font = btn.dataset.font;
    document.getElementById('currentFontName').textContent = btn.textContent;
    updatePreview();
  });
});

// ===== Text Input =====
textInput.addEventListener('input', updatePreview);

// ===== Color =====
colorPicker.addEventListener('input', (e) => {
  state.color = e.target.value;
  colorHex.value = e.target.value.substring(1).toUpperCase();
  updateColorSwatchActive();
  updatePreview();
});

colorHex.addEventListener('input', (e) => {
  let hex = e.target.value.replace(/[^0-9A-Fa-f]/g, '').substring(0, 6);
  e.target.value = hex.toUpperCase();
  if (hex.length === 6) {
    state.color = '#' + hex;
    colorPicker.value = '#' + hex;
    updateColorSwatchActive();
    updatePreview();
  }
});

document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    state.color = swatch.dataset.color;
    colorPicker.value = swatch.dataset.color;
    colorHex.value = swatch.dataset.color.substring(1).toUpperCase();
    updateColorSwatchActive();
    updatePreview();
  });
});

function updateColorSwatchActive() {
  document.querySelectorAll('.color-swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.color.toUpperCase() === state.color.toUpperCase());
  });
}

// ===== Stroke =====
strokeEnabled.addEventListener('change', () => {
  state.strokeEnabled = strokeEnabled.checked;
  strokeOptions.classList.toggle('visible', strokeEnabled.checked);
  updatePreview();
});

strokeColor.addEventListener('input', (e) => {
  state.strokeColor = e.target.value;
  updatePreview();
});

strokeWidth.addEventListener('input', (e) => {
  state.strokeWidth = parseInt(e.target.value);
  strokeWidthVal.textContent = e.target.value + 'px';
  updatePreview();
});

// ===== Settings =====
fontSize.addEventListener('input', (e) => {
  state.fontSize = parseInt(e.target.value) || 72;
  updatePreview();
});

letterSpacing.addEventListener('input', (e) => {
  state.letterSpacing = parseInt(e.target.value) || 0;
  updatePreview();
});

lineHeight.addEventListener('input', (e) => {
  state.lineHeight = parseFloat(e.target.value) || 1.2;
  updatePreview();
});

maxWidth.addEventListener('input', (e) => {
  state.maxWidth = parseInt(e.target.value) || 800;
  updatePreview();
});

// ===== Align =====
document.querySelectorAll('.align-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.align = btn.dataset.align;
    updatePreview();
  });
});

// ===== Background =====
bgTransparent.addEventListener('change', () => {
  state.bgTransparent = bgTransparent.checked;
  bgColorRow.style.display = bgTransparent.checked ? 'none' : 'flex';
  updatePreview();
});

bgColor.addEventListener('input', (e) => {
  state.bgColor = e.target.value;
});

// ===== Toast =====
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== Render to Canvas =====
function renderToCanvas() {
  const canvas = exportCanvas;
  const ctx = canvas.getContext('2d');
  const text = textInput.value || 'Type something!';
  const lines = text.split('\n');

  // Set up font
  const fontStr = `${state.fontSize}px '${state.font}'`;
  ctx.font = fontStr;

  // Measure text
  let maxLineWidth = 0;
  const lineMetrics = [];
  for (const line of lines) {
    const metrics = ctx.measureText(line || ' ');
    const w = metrics.width + (line.length - 1) * state.letterSpacing;
    lineMetrics.push({ text: line, width: w });
    if (w > maxLineWidth) maxLineWidth = w;
  }

  const lineHeightPx = state.fontSize * state.lineHeight;
  const totalHeight = lineHeightPx * lines.length;
  const padding = 20;

  const canvasWidth = Math.min(maxLineWidth + padding * 2, state.maxWidth + padding * 2);
  const canvasHeight = totalHeight + padding * 2;

  canvas.width = canvasWidth * 2; // 2x for retina
  canvas.height = canvasHeight * 2;
  ctx.scale(2, 2);

  // Background
  if (!state.bgTransparent) {
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // Text
  ctx.font = fontStr;
  ctx.textBaseline = 'top';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineW = lineMetrics[i].width;
    let x = padding;

    if (state.align === 'center') {
      x = (canvasWidth - lineW) / 2;
    } else if (state.align === 'right') {
      x = canvasWidth - lineW - padding;
    }

    const y = padding + i * lineHeightPx;

    if (state.letterSpacing === 0) {
      if (state.strokeEnabled) {
        ctx.strokeStyle = state.strokeColor;
        ctx.lineWidth = state.strokeWidth;
        ctx.lineJoin = 'round';
        ctx.strokeText(line, x, y);
      }
      ctx.fillStyle = state.color;
      ctx.fillText(line, x, y);
    } else {
      // Render char by char for letter spacing
      let charX = x;
      for (let j = 0; j < line.length; j++) {
        if (state.strokeEnabled) {
          ctx.strokeStyle = state.strokeColor;
          ctx.lineWidth = state.strokeWidth;
          ctx.lineJoin = 'round';
          ctx.strokeText(line[j], charX, y);
        }
        ctx.fillStyle = state.color;
        ctx.fillText(line[j], charX, y);
        charX += ctx.measureText(line[j]).width + state.letterSpacing;
      }
    }
  }

  return canvas;
}

// ===== Download =====
downloadBtn.addEventListener('click', () => {
  const canvas = renderToCanvas();
  const link = document.createElement('a');
  link.download = 'sm64-text.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Image downloaded!');
});

// ===== Copy to Clipboard =====
copyBtn.addEventListener('click', async () => {
  try {
    const canvas = renderToCanvas();
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('Copied to clipboard!');
      } catch {
        showToast('Could not copy - try downloading instead');
      }
    }, 'image/png');
  } catch {
    showToast('Could not copy - try downloading instead');
  }
});

// ===== Init =====
updatePreview();
updateColorSwatchActive();

// Preload fonts by rendering hidden text
const fontPreloader = document.createElement('div');
fontPreloader.style.cssText = 'position:absolute;top:-9999px;left:-9999px;font-size:1px;';
fontPreloader.innerHTML = [
  'Mario64', 'SuperMario64Font', 'SM64Text', 'SuperMario286', 'TypefaceMario64'
].map(f => `<span style="font-family:'${f}'">preload</span>`).join('');
document.body.appendChild(fontPreloader);
