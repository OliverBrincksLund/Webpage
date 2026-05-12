(function () {
  const sharpCanvas = document.getElementById("bgContourCanvas");
  const glowCanvas = document.getElementById("bgContourGlow");

  if (!sharpCanvas || !glowCanvas) return;

  const sharpCtx = sharpCanvas.getContext("2d", { alpha: true });
  const glowCtx = glowCanvas.getContext("2d", { alpha: true });

  if (!sharpCtx || !glowCtx) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const noise = new PerlinNoise();
  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    cols: 0,
    rows: 0,
    values: [],
    zOffset: 0,
    noiseMin: 100,
    noiseMax: 0,
    currentThreshold: 0,
    staticRendered: false,
    lastFrameTime: 0,
    frameInterval: 1000 / 12,
    theme: getTheme()
  };

  const thresholdIncrement = 4;
  const thickLineThresholdMultiple = 4;
  const baseZOffset = 0.00024;

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
    if (document.body.classList.contains("light")) {
      return {
        minorColor: "rgba(122, 129, 144, 0.048)",
        majorColor: "rgba(109, 118, 136, 0.102)",
        glowColor: "rgba(178, 186, 198, 0.12)"
      };
    }

    return {
      minorColor: "rgba(92, 108, 164, 0.07)",
      majorColor: "rgba(122, 144, 214, 0.17)",
      glowColor: "rgba(115, 144, 232, 0.28)"
    };
  }

  function getResolution(width) {
    if (width < 700) return 8.8;
    if (width < 1180) return 7.4;
    return 6.2;
  }

  function resize() {
    const rect = sharpCanvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width || window.innerWidth));
    const height = Math.max(1, Math.round(rect.height || window.innerHeight));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    if (width === state.width && height === state.height && dpr === state.dpr) return;

    state.width = width;
    state.height = height;
    state.dpr = dpr;

    sharpCanvas.width = glowCanvas.width = Math.round(width * dpr);
    sharpCanvas.height = glowCanvas.height = Math.round(height * dpr);

    sharpCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    glowCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    sharpCtx.lineCap = "round";
    sharpCtx.lineJoin = "round";
    glowCtx.lineCap = "round";
    glowCtx.lineJoin = "round";

    const resolution = getResolution(width);
    state.cols = Math.floor(width / resolution) + 1;
    state.rows = Math.floor(height / resolution) + 1;
    state.values = new Array(state.rows + 1);
    state.staticRendered = false;
  }

  function generateNoise() {
    state.noiseMin = 100;
    state.noiseMax = 0;

    for (let y = 0; y < state.rows; y += 1) {
      const row = new Array(state.cols + 1);
      for (let x = 0; x <= state.cols; x += 1) {
        const n1 = ((noise.sample(x * 0.018, y * 0.018, state.zOffset) + 1) * 0.5) * 100;
        const n2 = ((noise.sample(x * 0.04, y * 0.04, (state.zOffset * 1.3) + 100) + 1) * 0.5) * 30;
        const value = n1 + n2;
        row[x] = value;
        if (value < state.noiseMin) state.noiseMin = value;
        if (value > state.noiseMax) state.noiseMax = value;
      }
      state.values[y] = row;
    }
  }

  function interpolate(v0, v1) {
    return v0 === v1 ? 0 : (state.currentThreshold - v0) / (v1 - v0);
  }

  function binaryToType(nw, ne, se, sw) {
    return (nw << 3) | (ne << 2) | (se << 1) | sw;
  }

  function addSegment(ctx, from, to) {
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
  }

  function marchCell(ctx, gridValue, x, y, resolution) {
    const nw = state.values[y][x];
    const ne = state.values[y][x + 1];
    const se = state.values[y + 1][x + 1];
    const sw = state.values[y + 1][x];
    const px = x * resolution;
    const py = y * resolution;
    const a = [px + (resolution * interpolate(nw, ne)), py];
    const b = [px + resolution, py + (resolution * interpolate(ne, se))];
    const c = [px + (resolution * interpolate(sw, se)), py + resolution];
    const d = [px, py + (resolution * interpolate(nw, sw))];

    switch (gridValue) {
      case 1:
      case 14:
        addSegment(ctx, d, c);
        break;
      case 2:
      case 13:
        addSegment(ctx, b, c);
        break;
      case 3:
      case 12:
        addSegment(ctx, d, b);
        break;
      case 4:
      case 11:
        addSegment(ctx, a, b);
        break;
      case 5:
        addSegment(ctx, d, a);
        addSegment(ctx, c, b);
        break;
      case 6:
      case 9:
        addSegment(ctx, c, a);
        break;
      case 7:
      case 8:
        addSegment(ctx, d, a);
        break;
      case 10:
        addSegment(ctx, a, b);
        addSegment(ctx, c, d);
        break;
      default:
        break;
    }
  }

  function renderAtThreshold(resolution) {
    const isMajor = state.currentThreshold % (thresholdIncrement * thickLineThresholdMultiple) === 0;
    const mid = (state.noiseMin + state.noiseMax) * 0.5;
    const span = ((state.noiseMax - state.noiseMin) * 0.5) + 0.1;
    const distanceFromMid = Math.abs(state.currentThreshold - mid) / span;
    const brightnessFactor = Math.max(0.15, 1 - (distanceFromMid * 0.7));

    sharpCtx.beginPath();
    if (isMajor) glowCtx.beginPath();

    for (let y = 0; y < state.rows - 1; y += 1) {
      for (let x = 0; x < state.cols - 1; x += 1) {
        const nw = state.values[y][x] > state.currentThreshold ? 1 : 0;
        const ne = state.values[y][x + 1] > state.currentThreshold ? 1 : 0;
        const se = state.values[y + 1][x + 1] > state.currentThreshold ? 1 : 0;
        const sw = state.values[y + 1][x] > state.currentThreshold ? 1 : 0;

        if ((nw && ne && se && sw) || (!nw && !ne && !se && !sw)) continue;

        const gridValue = binaryToType(nw, ne, se, sw);
        marchCell(sharpCtx, gridValue, x, y, resolution);
        if (isMajor) marchCell(glowCtx, gridValue, x, y, resolution);
      }
    }

    if (isMajor) {
      sharpCtx.strokeStyle = withAlpha(state.theme.majorColor, Math.min(1, 0.72 + (brightnessFactor * 0.4)));
      sharpCtx.lineWidth = 1.02;
      sharpCtx.stroke();

      glowCtx.strokeStyle = withAlpha(state.theme.glowColor, Math.min(1, 0.55 + (brightnessFactor * 0.45)));
      glowCtx.lineWidth = 3.4;
      glowCtx.stroke();
    } else {
      sharpCtx.strokeStyle = withAlpha(state.theme.minorColor, Math.min(1, 0.7 + (brightnessFactor * 0.3)));
      sharpCtx.lineWidth = 0.42;
      sharpCtx.stroke();
    }
  }

  function withAlpha(rgba, factor) {
    return rgba.replace(/[\d.]+\)\s*$/, function (match) {
      const base = parseFloat(match.slice(0, -1));
      return String((base * factor).toFixed(3)) + ")";
    });
  }

  function renderContours() {
    const resolution = getResolution(state.width);
    sharpCtx.clearRect(0, 0, state.width, state.height);
    glowCtx.clearRect(0, 0, state.width, state.height);
    generateNoise();

    const roundedMin = Math.floor(state.noiseMin / thresholdIncrement) * thresholdIncrement;
    const roundedMax = Math.ceil(state.noiseMax / thresholdIncrement) * thresholdIncrement;

    for (let threshold = roundedMin; threshold < roundedMax; threshold += thresholdIncrement) {
      state.currentThreshold = threshold;
      renderAtThreshold(resolution);
    }
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
    state.zOffset += baseZOffset;
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
