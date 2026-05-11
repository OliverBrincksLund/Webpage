(function () {
  const sharpCanvas = document.getElementById("bgContourCanvas");
  const glowCanvas = document.getElementById("bgContourGlow");

  if (!sharpCanvas || !glowCanvas) return;

  const sharpCtx = sharpCanvas.getContext("2d", { alpha: true });
  const glowCtx = glowCanvas.getContext("2d", { alpha: true });

  if (!sharpCtx || !glowCtx) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const noise = new PerlinNoise();
  const MARKER_CONFIG = {
    step: 6,
    maxCount: 5,
    prominence: 9
  };
  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    cols: 0,
    rows: 0,
    field: [],
    zOffset: Math.random() * 100,
    lastFrameTime: 0,
    frameInterval: 1000 / 18,
    staticRendered: false,
    theme: getTheme()
  };

  function PerlinNoise() {
    this.p = [];
    const perm = [];
    for (let i = 0; i < 256; i += 1) perm[i] = Math.floor(Math.random() * 256);
    for (let i = 0; i < 512; i += 1) this.p[i] = perm[i & 255];
  }

  PerlinNoise.prototype.fade = function (t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  PerlinNoise.prototype.lerp = function (t, a, b) {
    return a + t * (b - a);
  };

  PerlinNoise.prototype.grad = function (hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  PerlinNoise.prototype.sample = function (x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    const fx = x - Math.floor(x);
    const fy = y - Math.floor(y);
    const fz = z - Math.floor(z);
    const u = this.fade(fx);
    const v = this.fade(fy);
    const w = this.fade(fz);
    const A = this.p[X] + Y;
    const AA = this.p[A] + Z;
    const AB = this.p[A + 1] + Z;
    const B = this.p[X + 1] + Y;
    const BA = this.p[B] + Z;
    const BB = this.p[B + 1] + Z;

    return this.lerp(
      w,
      this.lerp(
        v,
        this.lerp(u, this.grad(this.p[AA], fx, fy, fz), this.grad(this.p[BA], fx - 1, fy, fz)),
        this.lerp(u, this.grad(this.p[AB], fx, fy - 1, fz), this.grad(this.p[BB], fx - 1, fy - 1, fz))
      ),
      this.lerp(
        v,
        this.lerp(u, this.grad(this.p[AA + 1], fx, fy, fz - 1), this.grad(this.p[BA + 1], fx - 1, fy, fz - 1)),
        this.lerp(u, this.grad(this.p[AB + 1], fx, fy - 1, fz - 1), this.grad(this.p[BB + 1], fx - 1, fy - 1, fz - 1))
      )
    );
  };

  function getTheme() {
    return document.body.classList.contains("light")
      ? {
          minorColor: "rgba(109, 124, 115, 0.074)",
          majorColor: "rgba(86, 103, 95, 0.146)",
          glowColor: "rgba(167, 184, 174, 0.18)",
          markerFill: "rgba(108, 122, 111, 0.26)",
          markerRing: "rgba(122, 137, 126, 0.14)"
        }
      : {
          minorColor: "rgba(121, 141, 176, 0.072)",
          majorColor: "rgba(160, 184, 218, 0.132)",
          glowColor: "rgba(122, 157, 204, 0.17)",
          markerFill: "rgba(150, 178, 214, 0.25)",
          markerRing: "rgba(118, 150, 192, 0.13)"
        };
  }

  function getCellSize(width) {
    if (width < 700) return 14;
    if (width < 1180) return 11;
    return 9;
  }

  function setCanvasSize(canvas, ctx, width, height, dpr) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.imageSmoothingEnabled = true;
  }

  function resize() {
    const rect = sharpCanvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width || window.innerWidth));
    const height = Math.max(1, Math.round(rect.height || window.innerHeight));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    if (width === state.width && height === state.height && dpr === state.dpr) return;

    state.width = width;
    state.height = height;
    state.dpr = dpr;
    state.cols = Math.floor(width / getCellSize(width)) + 2;
    state.rows = Math.floor(height / getCellSize(width)) + 2;
    state.field = new Array(state.rows);

    setCanvasSize(sharpCanvas, sharpCtx, width, height, dpr);
    setCanvasSize(glowCanvas, glowCtx, width, height, dpr);
    state.staticRendered = false;
  }

  function fillField() {
    let min = Infinity;
    let max = -Infinity;
    const z = state.zOffset;

    for (let y = 0; y < state.rows; y += 1) {
      const row = new Array(state.cols);
      const ny = y * 0.058;
      for (let x = 0; x < state.cols; x += 1) {
        const nx = x * 0.058;
        const warpX = noise.sample(nx * 0.25 + 31, ny * 0.25 + 77, z * 0.36);
        const warpY = noise.sample(nx * 0.25 + 113, ny * 0.25 + 19, z * 0.34);
        const sx = nx + warpX * 0.58;
        const sy = ny + warpY * 0.58;
        const broad = (noise.sample(sx, sy, z) + 1) * 0.5;
        const detail = (noise.sample(sx * 1.14 + 20, sy * 1.14 + 20, z * 1.08 + 40) + 1) * 0.5;
        const ridge = (noise.sample(sx * 0.38 + 60, sy * 0.38 + 60, z * 0.7 + 10) + 1) * 0.5;
        const value = (broad * 100) + (detail * 9) + (ridge * 4);
        row[x] = value;
        if (value < min) min = value;
        if (value > max) max = value;
      }
      state.field[y] = row;
    }

    return { min, max };
  }

  function interpolate(a, b, threshold) {
    return a === b ? 0 : (threshold - a) / (b - a);
  }

  function binaryToType(nw, ne, se, sw) {
    return (nw << 3) | (ne << 2) | (se << 1) | sw;
  }

  function applyAlpha(rgba, factor) {
    return rgba.replace(/[\d.]+\)\s*$/, function (match) {
      const base = parseFloat(match.slice(0, -1));
      return String((base * factor).toFixed(3)) + ")";
    });
  }

  function traceSegment(ctx, from, to) {
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
  }

  function marchCell(ctx, x, y, threshold, size) {
    const nw = state.field[y][x];
    const ne = state.field[y][x + 1];
    const se = state.field[y + 1][x + 1];
    const sw = state.field[y + 1][x];
    const type = binaryToType(
      nw > threshold ? 1 : 0,
      ne > threshold ? 1 : 0,
      se > threshold ? 1 : 0,
      sw > threshold ? 1 : 0
    );

    if (type === 0 || type === 15) return;

    const px = x * size;
    const py = y * size;
    const a = [px + size * interpolate(nw, ne, threshold), py];
    const b = [px + size, py + size * interpolate(ne, se, threshold)];
    const c = [px + size * interpolate(sw, se, threshold), py + size];
    const d = [px, py + size * interpolate(nw, sw, threshold)];

    switch (type) {
      case 1:
      case 14:
        traceSegment(ctx, d, c);
        break;
      case 2:
      case 13:
        traceSegment(ctx, b, c);
        break;
      case 3:
      case 12:
        traceSegment(ctx, d, b);
        break;
      case 4:
      case 11:
        traceSegment(ctx, a, b);
        break;
      case 5:
        traceSegment(ctx, d, a);
        traceSegment(ctx, c, b);
        break;
      case 6:
      case 9:
        traceSegment(ctx, c, a);
        break;
      case 7:
      case 8:
        traceSegment(ctx, d, a);
        break;
      case 10:
        traceSegment(ctx, a, b);
        traceSegment(ctx, c, d);
        break;
      default:
        break;
    }
  }

  function clearCanvases() {
    sharpCtx.clearRect(0, 0, state.width, state.height);
    glowCtx.clearRect(0, 0, state.width, state.height);
  }

  function collectPeakMarkers(range, size) {
    const markers = [];
    const edgePad = 2;

    for (let y = edgePad; y < state.rows - edgePad; y += MARKER_CONFIG.step) {
      for (let x = edgePad; x < state.cols - edgePad; x += MARKER_CONFIG.step) {
        const center = state.field[y][x];
        let isPeak = true;
        let localMax = -Infinity;

        for (let oy = -1; oy <= 1; oy += 1) {
          for (let ox = -1; ox <= 1; ox += 1) {
            if (ox === 0 && oy === 0) continue;
            const sample = state.field[y + oy][x + ox];
            if (sample >= center) isPeak = false;
            if (sample > localMax) localMax = sample;
          }
        }

        if (!isPeak) continue;

        const prominence = center - localMax;
        const elevation = (center - range.min) / Math.max(1, range.max - range.min);
        if (prominence < MARKER_CONFIG.prominence || elevation < 0.56) continue;

        markers.push({
          x: x * size,
          y: y * size,
          prominence: prominence,
          elevation: elevation
        });
      }
    }

    markers.sort(function (a, b) {
      return (b.prominence + (b.elevation * 10)) - (a.prominence + (a.elevation * 10));
    });

    const selected = [];
    const minDistance = size * 12;

    markers.forEach(function (marker) {
      if (selected.length >= MARKER_CONFIG.maxCount) return;
      const isFarEnough = selected.every(function (other) {
        return Math.hypot(other.x - marker.x, other.y - marker.y) > minDistance;
      });
      if (isFarEnough) selected.push(marker);
    });

    return selected;
  }

  function renderGhostMarkers(markers) {
    if (!markers.length) return;

    sharpCtx.save();

    markers.forEach(function (marker, index) {
      const phase = (state.zOffset * 42) + (index * 0.85);
      const pulse = 0.72 + (((Math.sin(phase) + 1) * 0.5) * 0.28);
      const innerRadius = 1.3 + (marker.elevation * 0.85);
      const ringRadius = 4.5 + (marker.prominence * 0.05);

      sharpCtx.beginPath();
      sharpCtx.fillStyle = applyAlpha(state.theme.markerFill, pulse);
      sharpCtx.arc(marker.x, marker.y, innerRadius, 0, Math.PI * 2);
      sharpCtx.fill();

      sharpCtx.beginPath();
      sharpCtx.strokeStyle = applyAlpha(state.theme.markerRing, pulse * 0.95);
      sharpCtx.lineWidth = 0.85;
      sharpCtx.arc(marker.x, marker.y, ringRadius, 0, Math.PI * 2);
      sharpCtx.stroke();
    });

    sharpCtx.restore();
  }

  function renderContours() {
    clearCanvases();

    const range = fillField();
    const size = getCellSize(state.width);
    const peakMarkers = collectPeakMarkers(range, size);
    const thresholdStep = 7;
    const majorEvery = 5;
    const roundedMin = Math.floor(range.min / thresholdStep) * thresholdStep;
    const roundedMax = Math.ceil(range.max / thresholdStep) * thresholdStep;
    const midpoint = (range.min + range.max) * 0.5;
    const span = Math.max(1, (range.max - range.min) * 0.5);

    let thresholdIndex = 0;

    for (let threshold = roundedMin; threshold <= roundedMax; threshold += thresholdStep) {
      const isMajor = thresholdIndex % majorEvery === 0;
      const distanceFromMid = Math.abs(threshold - midpoint) / span;
      const fade = Math.max(0.18, 1 - (distanceFromMid * 0.78));

      sharpCtx.beginPath();
      if (isMajor) glowCtx.beginPath();

      for (let y = 0; y < state.rows - 1; y += 1) {
        for (let x = 0; x < state.cols - 1; x += 1) {
          marchCell(sharpCtx, x, y, threshold, size);
          if (isMajor) marchCell(glowCtx, x, y, threshold, size);
        }
      }

      if (isMajor) {
        sharpCtx.strokeStyle = applyAlpha(state.theme.majorColor, fade);
        sharpCtx.lineWidth = 0.98;
        sharpCtx.stroke();

        glowCtx.strokeStyle = applyAlpha(state.theme.glowColor, Math.min(1, fade + 0.08));
        glowCtx.lineWidth = 2.1;
        glowCtx.stroke();
      } else {
        sharpCtx.strokeStyle = applyAlpha(state.theme.minorColor, fade);
        sharpCtx.lineWidth = 0.5;
        sharpCtx.stroke();
      }

      thresholdIndex += 1;
    }

    renderGhostMarkers(peakMarkers);
  }

  function renderStaticFrame() {
    resize();
    renderContours();
    state.staticRendered = true;
  }

  function updateTheme() {
    state.theme = getTheme();
    state.staticRendered = false;
  }

  function tick(timestamp) {
    if (prefersReducedMotion.matches) {
      if (!state.staticRendered) renderStaticFrame();
      requestAnimationFrame(tick);
      return;
    }

    if (document.hidden) {
      requestAnimationFrame(tick);
      return;
    }

    if (timestamp - state.lastFrameTime < state.frameInterval) {
      requestAnimationFrame(tick);
      return;
    }

    resize();
    state.zOffset += 0.0012;
    renderContours();
    state.lastFrameTime = timestamp;
    requestAnimationFrame(tick);
  }

  const classObserver = new MutationObserver(updateTheme);
  classObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  window.addEventListener("resize", function () {
    state.staticRendered = false;
  });

  prefersReducedMotion.addEventListener("change", function () {
    state.staticRendered = false;
  });

  requestAnimationFrame(tick);
})();
