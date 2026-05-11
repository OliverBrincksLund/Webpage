(function () {

  // ── Panel order (used for directional transitions) ──────────
  const PANEL_ORDER = [
    'home',
    'sw-headanalyser', 'sw-headanalyser-v2', 'sw-gsa', 'sw-datamerger', 'sw-qgis',
    'proj-1', 'proj-2', 'proj-3', 'proj-4',
    'proj-5', 'proj-6', 'proj-7',
    'gallery',
    'about'
  ];
  const PANEL_SET = new Set(PANEL_ORDER);

  let currentPanel = 'home';

  function normalisePanelId(rawPanelId) {
    const panelId = (rawPanelId || '').replace(/^#/, '');
    return PANEL_SET.has(panelId) ? panelId : null;
  }

  function syncDocumentTitle(panelId) {
    if (panelId === 'home') {
      document.title = 'Oliver B. Lund';
      return;
    }
    const panel = document.getElementById('panel-' + panelId);
    const panelTitle = panel && panel.querySelector('.panel-title');
    document.title = panelTitle
      ? `${panelTitle.textContent.trim()} | Oliver B. Lund`
      : 'Oliver B. Lund';
  }

  // ── Panel switching ─────────────────────────────────────────
  function switchTo(panelId, options = {}) {
    const { updateHash = true } = options;
    const allPanels = document.querySelectorAll('.panel');
    const allItems  = document.querySelectorAll('.nav-item[data-panel]');
    const target    = document.getElementById('panel-' + panelId);

    if (!target || !PANEL_SET.has(panelId) || panelId === currentPanel) return;

    const goingBack = PANEL_ORDER.indexOf(panelId) < PANEL_ORDER.indexOf(currentPanel);

    allPanels.forEach(p => p.classList.remove('active', 'dir-back'));
    allItems.forEach(i => i.classList.remove('active'));

    if (goingBack) target.classList.add('dir-back');
    target.classList.add('active');

    document.getElementById('main').scrollTo({ top: 0, behavior: 'auto' });

    document.querySelectorAll(`.nav-item[data-panel="${panelId}"]`)
      .forEach(i => i.classList.add('active'));

    currentPanel = panelId;
    syncDocumentTitle(panelId);

    if (updateHash && window.location.hash !== `#${panelId}`) {
      window.location.hash = panelId;
    }
  }

  // Expose switchTo globally for inline onclick handlers
  window.switchTo = switchTo;

  // Sidebar nav
  document.querySelectorAll('.nav-item[data-panel]').forEach(item => {
    item.addEventListener('click', () => switchTo(item.dataset.panel));
  });

  // ── Mobile sidebar toggle ───────────────────────────────────
  const toggle  = document.getElementById('mobileToggle');
  const sidebar = document.getElementById('sidebar');

  function closeSidebar() {
    sidebar.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 680) closeSidebar();
    });
  });

  document.addEventListener('click', e => {
    if (window.innerWidth <= 680 &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target)) {
      closeSidebar();
    }
  });

  document.querySelectorAll('[data-panel-link]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      switchTo(link.dataset.panelLink);
    });
  });

  window.addEventListener('hashchange', () => {
    const panelId = normalisePanelId(window.location.hash) || 'home';
    switchTo(panelId, { updateHash: false });
  });

  // ── Thumbnail switching ─────────────────────────────────────
  document.querySelectorAll('.thumb-strip').forEach(strip => {
    strip.querySelectorAll('.thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        strip.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const thumbImg = thumb.querySelector('img');
        if (thumbImg) {
          const block   = strip.previousElementSibling;
          const mainImg = block && block.querySelector('img');
          if (mainImg) mainImg.src = thumbImg.src;
        }
      });
    });
  });

  // ── Stats counter animation ─────────────────────────────────
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el, targetStr, duration) {
    const match = targetStr.match(/^(\d+)(\+?)(.*)?$/);
    if (!match) {
      el.textContent = targetStr;
      return;
    }
    const num    = parseInt(match[1]);
    const suffix = (match[2] || '') + (match[3] || '');
    const start  = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOutCubic(p) * num) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-n').forEach(el => {
        animateCounter(el, el.dataset.val, 1400);
      });
      statsObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stats-row').forEach(row => {
    row.querySelectorAll('.stat-n').forEach(el => {
      el.dataset.val = el.textContent.trim();
      el.textContent = '0';
    });
    statsObs.observe(row);
  });

  // ── Theme toggle (persisted via localStorage) ──────────────
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = themeToggle.querySelector('.toggle-label');

  function syncThemeToggle() {
    const isLight = document.body.classList.contains('light');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeLabel.textContent = isLight ? 'Dark mode' : 'Light mode';
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.remove('light');
  } else {
    document.body.classList.add('light');
  }
  syncThemeToggle();

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    syncThemeToggle();
  });

  // ── Remove is-init after entrance animations complete ───────
  setTimeout(() => document.body.classList.remove('is-init'), 1600);

  // ── Gallery carousel ─────────────────────────────────────
  // To add items: { src: 'Images/...', title: '...', desc: '...', project: '...' }
  const GALLERY_ITEMS = [
    // ── Maps ─────────────────────────────────────────────
    {
      src: 'Images/Gallery/Maps/map1.jpg',
      title: 'JAR 173-00090 — Mølleå, PFAS exceedance',
      desc: 'Site-specific exceedance map for Perfluoroktansyre (PFAS) at the Mølleå stream monitoring station near Copenhagen. Points are colour-coded by exceedance tier (>10× limit, above limit, above detection limit, below detection limit). V1/V2 contaminated site polygons overlaid.',
      project: 'Regionernes overfladevand'
    },
    {
      src: 'Images/Gallery/Maps/map10.jpg',
      title: 'National stream contamination status',
      desc: 'National overview of confirmed contamination status (Ja / Nej / Uafklaret) at all stream monitoring stations across Denmark, based on the regions\' 2021–22 sampling campaigns near V1/V2 mapped contaminated sites.',
      project: 'Regionernes overfladevand'
    },
    {
      src: 'Images/Gallery/Maps/map6.jpg',
      title: 'Nordjylland — landfill sites, multi-compound',
      desc: 'Landfill sites in Nordjylland with confirmed stream contamination, showing multiple compound groups simultaneously using point displacement rendering. Blue = impact primarily from site; red = site plus other sources.',
      project: 'Regionernes overfladevand'
    },
    {
      src: 'Images/Gallery/Maps/map2.jpg',
      title: 'Clay thickness over uppermost aquifer — national',
      desc: 'National map of clay cover thickness (m) above the uppermost connected sand aquifer layer, derived from the DK-model. Overlaid with borehole classification (DEPOT, VF, GRUMO, Grundvandskortlægning). Raster colour scale from <2 m (light) to >50 m (dark brown).',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Maps/map3.jpg',
      title: 'Clay thickness >50 m — national filter',
      desc: 'Subset of the national clay thickness dataset filtered to areas where the clay cover exceeds 50 m (n=263). Shows borehole distribution in areas with deep clay protection over the aquifer.',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Maps/map5.jpg',
      title: 'TREFOR — pesticide exceedance across catchments',
      desc: 'Pesticide monitoring results at intake points within TREFOR\'s drinking water catchments (Oplande), colour-coded by exceedance tier against the 0.1 µg/l groundwater quality criterion. Regulated streams overlaid.',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Maps/map4.jpg',
      title: 'NOVAFOS — Bagsværd wellfield and catchment',
      desc: 'Wellfield map for NOVAFOS\'s Bagsværd kildeplads showing individual intake boreholes and the delineated catchment area (opland). Located northwest of Copenhagen near Furesø.',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Maps/map7.jpg',
      title: 'TREFOR — Hedensted wellfield, V1/V2 and stormwater',
      desc: 'Hedensted kildeplads catchment showing V1 (suspected) and V2 (confirmed) contaminated sites, stormwater discharge points (regnbetingedeudløb), and treatment plants within the catchment boundary.',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Maps/map8.jpg',
      title: 'TREFOR — Solekær wellfield, land use',
      desc: 'Land use classification map (GEUS/CLC) within the Solekær kildeplads catchment area, covering over 25 land use categories. Used to assess contamination risk from agricultural and urban land uses.',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Maps/map9.jpg',
      title: 'TREFOR — Staurbyskov, Desphenyl chloridazon',
      desc: 'Exceedance map for Desphenyl chloridazon (a pesticide metabolite) at Staurbyskov kildeplads near Kolding. One intake exceeds 10× the quality criterion; one exceeds the limit value. Catchment boundary shown.',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Maps/map11.jpg',
      title: 'Geological cross-section — Copenhagen area',
      desc: 'GeoAtlas A–A\' geological profile near Avedøre Landsby showing subsurface stratigraphy: Upper Clay, Middle Sand, Lower Clay, Lower Sand, Lower Copenhagen Limestone, Bryozoan limestone, and Chalk. Borehole logs aligned along the profile.',
      project: 'Geo.dk integration work'
    },
    {
      src: 'Images/projects/project-04/tilstandsvurdering_map.png',
      title: 'PFAS state-assessment map',
      desc: 'Example national map from the active PFAS state-assessment workflow, showing how pre-screened groundwater bodies are routed into broad status classes for follow-up review.',
      project: 'Risiko- og tilstandsvurdering for PFAS og pesticider'
    },
    {
      src: 'Images/projects/project-04/volume_impact_geospatial_analysis.png',
      title: 'Groundwater volume impact analysis',
      desc: 'Risk-workflow output visualising potential affected-volume patterns across groundwater bodies using well chemistry, source areas, and geological raster data.',
      project: 'Risiko- og tilstandsvurdering for PFAS og pesticider'
    },
    {
      src: 'Images/projects/project-04/decision_tree_funnel.png',
      title: 'PFAS decision-tree flow',
      desc: 'Reporting figure tracing how groundwater bodies move through the active PFAS state-assessment logic from analysis coverage and exceedance checks to final categorisation.',
      project: 'Risiko- og tilstandsvurdering for PFAS og pesticider'
    },
    // ── Plots ────────────────────────────────────────────
    {
      src: 'Images/Gallery/Plots/plot6.jpg',
      title: 'Top 10 pesticide compounds across water utilities',
      desc: 'Heatmap showing the 10 most frequently detected pesticide compounds (above the detection limit, DG) across seven Danish water utilities. 2,6-Dichlorbenzamid and DMS are detected at all seven. Colour intensity reflects frequency; the red dashed line separates individual utilities from the total.',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Plots/plot7.jpg',
      title: 'Top 10 PFAS at wellfields with ≥25% urban catchment',
      desc: 'Ranked bar chart of the 10 most commonly detected PFAS compounds at wellfields where at least 25% of the catchment area is urban (bebyggelse). 6:2 FTS and PFBA are detected at 20 of the wellfields in this subset.',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Plots/plot8.jpg',
      title: 'PFAS detection at Nybølle Øst (HOFOR)',
      desc: 'Stacked bar chart showing the proportion of PFAS compounds detected above DG and above MKK at all 6 intakes of HOFOR\'s Nybølle Øst wellfield. SUM4 shows the highest exceedance rate; most long-chain PFAS are not detected.',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Plots/plot3.jpg',
      title: 'Pesticide depth distribution — DEPOT boreholes, clay 0–1 m',
      desc: 'Depth distribution of pesticide detections in DEPOT-type boreholes with <1 m clay cover. Shows proportion of intakes with detections above KV (limit), below KV, and not detected, binned by depth (m below surface). Detection rates are highest in the 0–30 m depth range.',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Plots/plot5.jpg',
      title: 'Pesticide depth distribution — GEUS control boreholes',
      desc: 'Depth distribution of pesticide detections in the national GEUS control borehole network, showing proportions above and below the quality criterion by depth interval. Provides a national baseline for comparison with individual water utility data.',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Plots/plot4.jpg',
      title: 'Pesticide depth vs concentration — HOFOR',
      desc: 'Scatter plot of pesticide concentration (µg/l) against intake depth (m) for HOFOR boreholes. DMS (N,N-Dimethylsulfamid) dominates detections. Points above 0.1 µg/l represent quality criterion exceedances. The vertical spread at shallow depths reflects the high density of shallow intakes.',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Plots/plot1.jpg',
      title: 'DIN Forsyning — pesticide detections vs national average',
      desc: 'Bar chart comparing DIN Forsyning\'s pesticide detection rates (above DG and above KV) to the national average across all monitored compounds. Desphenyl chloridazon shows 19.1% more detections above DG than the national mean (24 detections).',
      project: 'InSa-Drikkevand'
    },
    {
      src: 'Images/Gallery/Plots/plot2.jpg',
      title: 'Soil type composition per water utility',
      desc: 'Normalised stacked bar chart of GEUS 1:25000 soil type (jordart) distribution within the catchments of seven Danish water utilities. Moræneler (ML) dominates TREFOR and VandCenterSyd catchments; Aalborg Forsyning has a high proportion of unknown layers (X).',
      project: 'InSa-Drikkevand'
    },
  ];

  let galleryIndex = 0;

  function initGallery() {
    const carousel   = document.getElementById('gallery-carousel');
    const emptyBlock = document.getElementById('gallery-empty');
    if (!carousel) return;

    if (GALLERY_ITEMS.length === 0) {
      carousel.style.display   = 'none';
      emptyBlock.style.display = '';
      return;
    }
    emptyBlock.style.display = 'none';

    const thumbsEl = document.getElementById('gallery-thumbs');
    GALLERY_ITEMS.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'thumb' + (i === 0 ? ' active' : '');
      div.innerHTML = `<img src="${item.src}" alt="${item.title} thumbnail">`;
      div.addEventListener('click', () => goToGallery(i));
      thumbsEl.appendChild(div);
    });

    goToGallery(0);

    document.getElementById('gallery-prev').addEventListener('click', () =>
      goToGallery((galleryIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length));
    document.getElementById('gallery-next').addEventListener('click', () =>
      goToGallery((galleryIndex + 1) % GALLERY_ITEMS.length));
  }

  function goToGallery(i) {
    const item = GALLERY_ITEMS[i];
    galleryIndex = i;

    document.getElementById('gallery-main-img').src              = item.src;
    document.getElementById('gallery-main-img').alt              = item.title;
    document.getElementById('gallery-counter').textContent       = `${String(i + 1).padStart(2, '0')} / ${String(GALLERY_ITEMS.length).padStart(2, '0')}`;
    document.getElementById('gallery-caption-title').textContent = item.title;
    document.getElementById('gallery-caption-desc').textContent  = item.desc;
    document.getElementById('gallery-project-tag').textContent   = item.project;

    document.querySelectorAll('#gallery-thumbs .thumb').forEach((t, idx) => {
      t.classList.toggle('active', idx === i);
    });

    const activeThumb = document.querySelectorAll('#gallery-thumbs .thumb')[i];
    if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  initGallery();

  // ── Lightbox ─────────────────────────────────────────────
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = lightbox.querySelector('img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxTitle   = document.getElementById('lightbox-caption-title');
  const lightboxDesc    = document.getElementById('lightbox-caption-desc');

  function openLightbox(src, title, desc) {
    lightboxImg.src = src;
    lightboxImg.alt = title || '';

    if (title || desc) {
      lightboxTitle.textContent = title || '';
      lightboxDesc.textContent  = desc  || '';
      lightboxTitle.style.display = title ? '' : 'none';
      lightboxDesc.style.display  = desc  ? '' : 'none';
      lightboxCaption.style.display = '';
      lightboxImg.classList.remove('no-caption');
    } else {
      lightboxCaption.style.display = 'none';
      lightboxImg.classList.add('no-caption');
    }

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Showcase images — extract title + desc from sibling DOM
  document.querySelectorAll('.showcase-img img').forEach(img => {
    img.addEventListener('click', e => {
      e.stopPropagation();
      const item  = img.closest('.showcase-item');
      const title = item ? (item.querySelector('.showcase-title') || {}).textContent || '' : '';
      const desc  = item ? (item.querySelector('.showcase-desc')  || {}).textContent || '' : '';
      openLightbox(img.src, title, desc);
    });
  });

  // Screenshot-block images — use alt as title, no desc
  document.querySelectorAll('.screenshot-block img').forEach(img => {
    img.addEventListener('click', e => {
      e.stopPropagation();
      openLightbox(img.src, img.alt || '', '');
    });
  });

  // Gallery main image — use current GALLERY_ITEMS entry
  const galleryMainImg = document.getElementById('gallery-main-img');
  if (galleryMainImg) {
    galleryMainImg.addEventListener('click', e => {
      e.stopPropagation();
      if (GALLERY_ITEMS.length > 0) {
        const item = GALLERY_ITEMS[galleryIndex];
        openLightbox(item.src, item.title, item.desc);
      }
    });
  }

  lightbox.addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-close').addEventListener('click', e => {
    e.stopPropagation();
    closeLightbox();
  });

  // ── Keyboard: Esc closes lightbox, arrows navigate gallery ─
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
    if (currentPanel === 'gallery' && GALLERY_ITEMS.length > 0) {
      if (e.key === 'ArrowLeft')  goToGallery((galleryIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
      if (e.key === 'ArrowRight') goToGallery((galleryIndex + 1) % GALLERY_ITEMS.length);
    }
  });

  const initialPanel = normalisePanelId(window.location.hash);
  if (initialPanel) switchTo(initialPanel, { updateHash: false });
  syncDocumentTitle(currentPanel);

})();
