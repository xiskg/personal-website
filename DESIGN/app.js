// Initialize Lucide Icons
lucide.createIcons();

// Elements
const body = document.body;
const themeButtons = document.querySelectorAll('.btn-theme');
const layoutButtons = document.querySelectorAll('.btn-layout');
const fontButtons = document.querySelectorAll('.btn-font');

const sketchToggle = document.getElementById('sketch-mode-toggle');
const drawingToolsContainer = document.querySelector('.drawing-tools');
const colorPickerContainer = document.querySelector('.color-picker-wrapper');
const toolButtons = document.querySelectorAll('.btn-tool:not(.btn-clear)');
const clearButton = document.getElementById('tool-clear');
const colorDots = document.querySelectorAll('.color-dot');

const canvas = document.getElementById('sketch-canvas');
const ctx = canvas.getContext('2d');

// Canvas Drawing State
let isDrawing = false;
let currentTool = 'pencil'; // pencil, highlighter, eraser
let currentRawColor = 'pencil'; // 'pencil' (theme color) or specific hex color
let drawingColor = 'var(--canvas-pen-color)';
let drawingWidth = 2.5;
let drawingOpacity = 0.85;

// Stroke History for Redrawing on Resize
let strokeHistory = [];
let currentStrokePoints = [];

// Initialize Canvas Size
function resizeCanvas() {
  // Store canvas dimensions before resizing to scale drawings if needed
  const oldWidth = canvas.width;
  const oldHeight = canvas.height;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Redraw strokes
  redrawCanvas();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial call

// ==========================================================================
// THEME SWITCHER
// ==========================================================================
themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    themeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Remove current themes
    body.classList.remove('theme-graph', 'theme-notepad', 'theme-blueprint', 'theme-dark');
    // Add selected theme
    const selectedTheme = btn.getAttribute('data-theme');
    body.classList.add(selectedTheme);
    
    // Update active pen color matching the theme
    updatePenProperties();
    // Redraw the strokes (since the theme color variable changed, they will redraw in the correct color)
    redrawCanvas();
  });
});

// ==========================================================================
// LAYOUT SWITCHER
// ==========================================================================
layoutButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    layoutButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    body.classList.remove('layout-left', 'layout-right', 'layout-center');
    const selectedLayout = btn.getAttribute('data-layout');
    body.classList.add(selectedLayout);
  });
});

// ==========================================================================
// TYPOGRAPHY SWITCHER
// ==========================================================================
fontButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    fontButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    body.classList.remove('font-architects', 'font-patrick', 'font-gochi');
    const selectedFont = btn.getAttribute('data-font');
    body.classList.add(selectedFont);
  });
});

// ==========================================================================
// DRAWING ENGINE
// ==========================================================================

// Toggle sketch mode
sketchToggle.addEventListener('change', (e) => {
  const isEnabled = e.target.checked;
  if (isEnabled) {
    body.classList.add('sketching-active');
    drawingToolsContainer.style.display = 'flex';
    colorPickerContainer.style.display = 'flex';
    updatePenProperties();
  } else {
    body.classList.remove('sketching-active');
    drawingToolsContainer.style.display = 'none';
    colorPickerContainer.style.display = 'none';
    isDrawing = false;
  }
});

// Tool selector (Pencil, Highlighter, Eraser)
toolButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    toolButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const selectedTool = btn.id.replace('tool-', '');
    currentTool = selectedTool;
    updatePenProperties();
  });
});

// Color picker dots
colorDots.forEach(dot => {
  dot.addEventListener('click', () => {
    colorDots.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    
    currentRawColor = dot.getAttribute('data-color');
    updatePenProperties();
  });
});

// Clear canvas
clearButton.addEventListener('click', () => {
  if (confirm("Clear your sketches and notes?")) {
    strokeHistory = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

// Compute values for pen width/color based on tool settings
function updatePenProperties() {
  // Resolve theme pencil color dynamically
  const resolvedThemeColor = getComputedStyle(body).getPropertyValue('--canvas-pen-color').trim() || '#000000';
  
  if (currentTool === 'pencil') {
    drawingColor = (currentRawColor === 'pencil') ? resolvedThemeColor : currentRawColor;
    drawingWidth = 2.5;
    drawingOpacity = 0.85;
  } else if (currentTool === 'highlighter') {
    // Highlighter colors are semi-transparent and thick
    drawingColor = (currentRawColor === 'pencil') ? 'rgba(255, 235, 59, 0.4)' : hexToRGBA(currentRawColor, 0.35);
    drawingWidth = 16;
    drawingOpacity = 1.0; // Handled by rgba
  } else if (currentTool === 'eraser') {
    drawingColor = 'rgba(0,0,0,1)'; // Eraser uses destination-out
    drawingWidth = 24;
    drawingOpacity = 1.0;
  }
}

// Convert Hex to RGBA utility for highlighter
function hexToRGBA(hex, alpha = 1) {
  if (hex.startsWith('var')) return hex; // Pass css variables directly
  let r = 0, g = 0, b = 0;
  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Drawing Event Listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// Touch support for mobiles/tablets
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  startDrawing(touch);
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  draw(touch);
});
canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  stopDrawing();
});

function startDrawing(e) {
  if (!sketchToggle.checked) return;
  isDrawing = true;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  currentStrokePoints = [{ x, y }];
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  
  // Apply composite operation
  if (currentTool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
  } else {
    ctx.globalCompositeOperation = 'source-over';
  }
  
  ctx.strokeStyle = drawingColor;
  ctx.lineWidth = drawingWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = drawingOpacity;
}

function draw(e) {
  if (!isDrawing) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  currentStrokePoints.push({ x, y });
  
  ctx.lineTo(x, y);
  ctx.stroke();
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  
  if (currentStrokePoints.length > 1) {
    // Record stroke details
    strokeHistory.push({
      tool: currentTool,
      color: drawingColor,
      width: drawingWidth,
      opacity: drawingOpacity,
      points: [...currentStrokePoints]
    });
  }
  
  currentStrokePoints = [];
}

// Redraw all stored strokes
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Resolve theme pencil color dynamically again
  const resolvedThemeColor = getComputedStyle(body).getPropertyValue('--canvas-pen-color').trim() || '#000000';
  
  strokeHistory.forEach(stroke => {
    if (stroke.points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    
    // Setup drawing styles
    if (stroke.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }
    
    // If the color was originally the theme pencil color, update it to current theme's resolve color
    let strokeColor = stroke.color;
    if (strokeColor.startsWith('var') || strokeColor.startsWith('rgba(46, 53, 79') || strokeColor.startsWith('rgba(27, 38, 59') || strokeColor.startsWith('rgba(255, 255, 255') || strokeColor.startsWith('rgba(226, 232, 240')) {
      if (stroke.tool === 'pencil') {
        strokeColor = resolvedThemeColor;
      } else if (stroke.tool === 'highlighter' && stroke.color.includes('rgba(255, 235, 59')) {
        // keep highlighter default yellow
        strokeColor = stroke.color;
      }
    }
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = stroke.opacity;
    
    ctx.stroke();
  });
  
  // Reset composite state
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
}
