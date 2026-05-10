/* =====================================================
   HOME — D3.js Tech Stack Bubble Chart
   ===================================================== */

(function () {
  'use strict';

  const CAT_STYLES = {
    data: {
      fill:   'rgba(196,144,64,0.14)',
      stroke: 'rgba(196,144,64,0.55)',
      text:   '#D4AB68',
    },
    geo: {
      fill:   'rgba(56,168,152,0.12)',
      stroke: 'rgba(56,168,152,0.50)',
      text:   '#52BFB0',
    },
    dev: {
      fill:   'rgba(30,34,48,0.70)',
      stroke: 'rgba(53,61,82,0.85)',
      text:   '#878A9C',
    },
  };

  const SKILLS = [
    // Data & ML
    { name: 'Python',       cat: 'data', r: 38 },
    { name: 'Pandas',       cat: 'data', r: 28 },
    { name: 'NumPy',        cat: 'data', r: 23 },
    { name: 'Scikit-learn', cat: 'data', r: 26 },
    { name: 'TensorFlow',   cat: 'data', r: 22 },
    { name: 'Matplotlib',   cat: 'data', r: 22 },
    { name: 'Seaborn',      cat: 'data', r: 19 },
    { name: 'Plotly',       cat: 'data', r: 19 },
    // Spatial & GIS
    { name: 'QGIS',         cat: 'geo',  r: 32 },
    { name: 'GeoPandas',    cat: 'geo',  r: 26 },
    { name: 'PostGIS',      cat: 'geo',  r: 20 },
    { name: 'GDAL',         cat: 'geo',  r: 20 },
    { name: 'Rasterio',     cat: 'geo',  r: 18 },
    { name: 'Folium',       cat: 'geo',  r: 18 },
    { name: 'OpenCV',       cat: 'geo',  r: 22 },
    // Dev Tools
    { name: 'SQL',          cat: 'dev',  r: 26 },
    { name: 'Git',          cat: 'dev',  r: 22 },
    { name: 'PyQt',         cat: 'dev',  r: 24 },
    { name: 'FastAPI',      cat: 'dev',  r: 18 },
    { name: 'Docker',       cat: 'dev',  r: 17 },
    { name: 'D3.js',        cat: 'dev',  r: 20 },
    { name: 'Linux',        cat: 'dev',  r: 18 },
  ];

  let resizeTimer = null;

  function initSkillsChart() {
    const container = document.getElementById('skills-chart');
    if (!container || typeof d3 === 'undefined') return;

    const W = container.clientWidth || 800;
    const H = 320;

    // Clear previous render
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${W} ${H}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height', '100%');

    // Clone data to avoid position mutation across redraws
    const nodes = SKILLS.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes)
      .force('x', d3.forceX(W / 2).strength(0.04))
      .force('y', d3.forceY(H / 2).strength(0.06))
      .force('collision', d3.forceCollide(d => d.r + 3.5).strength(0.88))
      .alphaDecay(0.018)
      .on('tick', ticked);

    const nodeGroup = svg.selectAll('g.skill-bubble')
      .data(nodes)
      .join('g')
      .attr('class', 'skill-bubble')
      .style('cursor', 'default');

    // Background circle
    nodeGroup.append('circle')
      .attr('r', 0)
      .attr('fill',         d => CAT_STYLES[d.cat].fill)
      .attr('stroke',       d => CAT_STYLES[d.cat].stroke)
      .attr('stroke-width', 1)
      .transition()
        .duration(900)
        .delay((_, i) => i * 28)
        .ease(d3.easeBounceOut)
        .attr('r', d => d.r);

    // Label — show inside bubble when radius is large enough
    nodeGroup
      .filter(d => d.r >= 19)
      .append('text')
        .attr('text-anchor',       'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill',              d => CAT_STYLES[d.cat].text)
        .attr('font-family',       "'JetBrains Mono', monospace")
        .attr('font-size',         d => Math.max(7.5, d.r * 0.285) + 'px')
        .attr('font-weight',       '500')
        .attr('pointer-events',    'none')
        .attr('user-select',       'none')
        .style('opacity', 0)
        .text(d => d.name)
        .transition()
          .delay((_, i) => i * 28 + 550)
          .duration(350)
          .style('opacity', 1);

    // Hover interactions
    nodeGroup
      .on('mouseenter', function (_, d) {
        d3.select(this).select('circle')
          .transition().duration(140)
          .attr('r', d.r + 4)
          .attr('stroke-width', 1.8);
      })
      .on('mouseleave', function (_, d) {
        d3.select(this).select('circle')
          .transition().duration(140)
          .attr('r', d.r)
          .attr('stroke-width', 1);
      });

    function ticked() {
      nodeGroup.attr('transform', d => {
        d.x = Math.max(d.r + 5, Math.min(W - d.r - 5, d.x));
        d.y = Math.max(d.r + 5, Math.min(H - d.r - 5, d.y));
        return `translate(${d.x},${d.y})`;
      });
    }
  }

  // Debounced resize handler
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initSkillsChart, 260);
  }

  function init() {
    initSkillsChart();
    window.addEventListener('resize', onResize, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
