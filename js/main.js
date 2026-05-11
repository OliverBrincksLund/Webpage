(function () {
  const content = window.PORTFOLIO_CONTENT || {
    nav: { top: [], groups: [], bottom: [] },
    panels: {},
    selectedWork: [],
    galleryItems: []
  };

  function renderNavButton(item, isActive) {
    const activeClass = isActive ? " active" : "";
    const levelClass = item.level && item.level !== "root" ? ` ${item.level}` : "";
    return `
      <button type="button" class="nav-item${activeClass}${levelClass}" data-panel="${item.panel}">
        <i class="${item.icon}"></i>${item.label}
      </button>
    `;
  }

  function renderSidebarNav() {
    const nav = document.getElementById("sidebarNav") || document.querySelector(".sidebar-nav");
    if (!nav) return;

    const parts = [];
    const topItems = content.nav?.top || [];
    const navGroups = content.nav?.groups || [];
    const bottomItems = content.nav?.bottom || [];

    if (topItems.length > 0) {
      parts.push('<div class="nav-group">');
      topItems.forEach(item => parts.push(renderNavButton(item, item.panel === "home")));
      parts.push("</div>");
    }

    navGroups.forEach((group, index) => {
      parts.push('<div class="nav-sep"></div>');
      parts.push('<div class="nav-group">');
      parts.push(`<div class="nav-group-label"><i class="${group.icon}"></i>${group.label}</div>`);
      group.items.forEach(panelId => {
        const panel = content.panels[panelId];
        if (!panel) return;
        parts.push(renderNavButton({
          panel: panelId,
          label: panel.navLabel,
          icon: panel.navIcon,
          level: panel.navLevel || "sub"
        }, false));
      });
      parts.push("</div>");
    });

    if (bottomItems.length > 0) {
      bottomItems.forEach(item => {
        parts.push('<div class="nav-sep"></div>');
        parts.push('<div class="nav-group">');
        parts.push(renderNavButton(item, false));
        parts.push("</div>");
      });
    }

    nav.innerHTML = parts.join("");
  }

  function renderSelectedWork() {
    const cardList = document.querySelector(".card-list");
    if (!cardList) return;

    const cardsHtml = (content.selectedWork || [])
      .map(panelId => {
        const panel = content.panels[panelId];
        if (!panel || !panel.cardImage) return "";
        return `
          <a class="card" href="#${panelId}" data-panel-link="${panelId}">
            <div class="card-media">
              <img src="${panel.cardImage}" alt="${panel.cardAlt || panel.cardTitle}" loading="lazy">
            </div>
            <div class="card-left">
              <div class="card-eyebrow">${panel.cardEyebrow || ""}</div>
              <div class="card-name">${panel.cardTitle || panel.navLabel || panelId}</div>
              <div class="card-desc">${panel.cardDescription || ""}</div>
            </div>
            <div class="card-arrow">&#8594;</div>
          </a>
        `;
      })
      .join("");

    if (cardsHtml) cardList.innerHTML = cardsHtml;
  }

  function buildPanelOrder() {
    const order = [];
    const push = panelId => {
      if (panelId && !order.includes(panelId)) order.push(panelId);
    };

    (content.nav?.top || []).forEach(item => push(item.panel));
    (content.nav?.groups || []).forEach(group => group.items.forEach(push));
    (content.nav?.bottom || []).forEach(item => push(item.panel));

    return order.length > 0 ? order : ["home", "gallery", "about"];
  }

  renderSidebarNav();
  renderSelectedWork();

  const PANEL_ORDER = buildPanelOrder();
  const PANEL_SET = new Set(PANEL_ORDER);
  const GALLERY_ITEMS = Array.isArray(content.galleryItems) ? content.galleryItems : [];

  let currentPanel = "home";

  function normalisePanelId(rawPanelId) {
    const panelId = (rawPanelId || "").replace(/^#/, "");
    return PANEL_SET.has(panelId) ? panelId : null;
  }

  function syncDocumentTitle(panelId) {
    if (panelId === "home") {
      document.title = "Oliver B. Lund";
      return;
    }
    const panel = document.getElementById("panel-" + panelId);
    const panelTitle = panel && panel.querySelector(".panel-title");
    document.title = panelTitle
      ? `${panelTitle.textContent.trim()} | Oliver B. Lund`
      : "Oliver B. Lund";
  }

  function switchTo(panelId, options = {}) {
    const { updateHash = true } = options;
    const allPanels = document.querySelectorAll(".panel");
    const allItems = document.querySelectorAll(".nav-item[data-panel]");
    const target = document.getElementById("panel-" + panelId);

    if (!target || !PANEL_SET.has(panelId) || panelId === currentPanel) return;

    const goingBack = PANEL_ORDER.indexOf(panelId) < PANEL_ORDER.indexOf(currentPanel);

    allPanels.forEach(panel => panel.classList.remove("active", "dir-back"));
    allItems.forEach(item => item.classList.remove("active"));

    if (goingBack) target.classList.add("dir-back");
    target.classList.add("active");

    document.getElementById("main").scrollTo({ top: 0, behavior: "auto" });

    document
      .querySelectorAll(`.nav-item[data-panel="${panelId}"]`)
      .forEach(item => item.classList.add("active"));

    currentPanel = panelId;
    syncDocumentTitle(panelId);

    if (updateHash && window.location.hash !== `#${panelId}`) {
      window.location.hash = panelId;
    }
  }

  window.switchTo = switchTo;

  document.querySelectorAll(".nav-item[data-panel]").forEach(item => {
    item.addEventListener("click", () => switchTo(item.dataset.panel));
  });

  const toggle = document.getElementById("mobileToggle");
  const sidebar = document.getElementById("sidebar");

  function closeSidebar() {
    sidebar.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 680) closeSidebar();
    });
  });

  document.addEventListener("click", event => {
    if (
      window.innerWidth <= 680 &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeSidebar();
    }
  });

  document.querySelectorAll("[data-panel-link]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      switchTo(link.dataset.panelLink);
    });
  });

  window.addEventListener("hashchange", () => {
    const panelId = normalisePanelId(window.location.hash) || "home";
    switchTo(panelId, { updateHash: false });
  });

  document.querySelectorAll(".thumb-strip").forEach(strip => {
    const block = strip.previousElementSibling;
    if (!block || !block.classList.contains("screenshot-block")) return;

    const thumbs = Array.from(strip.querySelectorAll(".thumb"));
    const mainImg = block.querySelector("img");
    if (!mainImg || thumbs.length === 0) return;

    let currentIndex = Math.max(0, thumbs.findIndex(thumb => thumb.classList.contains("active")));
    if (currentIndex < 0) currentIndex = 0;

    function syncGallery(index) {
      const nextThumb = thumbs[index];
      const thumbImg = nextThumb && nextThumb.querySelector("img");
      if (!thumbImg) return;

      currentIndex = index;
      mainImg.src = thumbImg.src;
      mainImg.alt = thumbImg.alt || mainImg.alt || "";
      thumbs.forEach((thumb, thumbIndex) => {
        thumb.classList.toggle("active", thumbIndex === currentIndex);
      });
    }

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => syncGallery(index));
    });

    if (thumbs.length > 1) {
      const prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "screenshot-nav prev";
      prevBtn.setAttribute("aria-label", "Previous image");
      prevBtn.innerHTML = "&#8592;";

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "screenshot-nav next";
      nextBtn.setAttribute("aria-label", "Next image");
      nextBtn.innerHTML = "&#8594;";

      prevBtn.addEventListener("click", event => {
        event.stopPropagation();
        syncGallery((currentIndex - 1 + thumbs.length) % thumbs.length);
      });

      nextBtn.addEventListener("click", event => {
        event.stopPropagation();
        syncGallery((currentIndex + 1) % thumbs.length);
      });

      block.appendChild(prevBtn);
      block.appendChild(nextBtn);
    }

    syncGallery(currentIndex);
  });

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el, targetStr, duration) {
    const match = targetStr.match(/^(\d+)(\+?)(.*)?$/);
    if (!match) {
      el.textContent = targetStr;
      return;
    }
    const num = parseInt(match[1], 10);
    const suffix = (match[2] || "") + (match[3] || "");
    const start = performance.now();
    (function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOutCubic(progress) * num) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    })(start);
  }

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll(".stat-n").forEach(el => {
        animateCounter(el, el.dataset.val, 1400);
      });
      statsObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".stats-row").forEach(row => {
    row.querySelectorAll(".stat-n").forEach(el => {
      el.dataset.val = el.textContent.trim();
      el.textContent = "0";
    });
    statsObs.observe(row);
  });

  const themeToggle = document.getElementById("themeToggle");
  const themeLabel = themeToggle.querySelector(".toggle-label");

  function syncThemeToggle() {
    const isLight = document.body.classList.contains("light");
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeLabel.textContent = isLight ? "Dark mode" : "Light mode";
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.remove("light");
  } else {
    document.body.classList.add("light");
  }
  syncThemeToggle();

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
    syncThemeToggle();
  });

  setTimeout(() => document.body.classList.remove("is-init"), 1600);

  let galleryIndex = 0;

  function initGallery() {
    const carousel = document.getElementById("gallery-carousel");
    const emptyBlock = document.getElementById("gallery-empty");
    if (!carousel) return;

    if (GALLERY_ITEMS.length === 0) {
      carousel.style.display = "none";
      emptyBlock.style.display = "";
      return;
    }
    emptyBlock.style.display = "none";

    const thumbsEl = document.getElementById("gallery-thumbs");
    thumbsEl.innerHTML = "";
    GALLERY_ITEMS.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "thumb" + (index === 0 ? " active" : "");
      div.innerHTML = `<img src="${item.src}" alt="${item.title} thumbnail">`;
      div.addEventListener("click", () => goToGallery(index));
      thumbsEl.appendChild(div);
    });

    goToGallery(0);

    document.getElementById("gallery-prev").addEventListener("click", () => {
      goToGallery((galleryIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    });
    document.getElementById("gallery-next").addEventListener("click", () => {
      goToGallery((galleryIndex + 1) % GALLERY_ITEMS.length);
    });
  }

  function goToGallery(index) {
    const item = GALLERY_ITEMS[index];
    galleryIndex = index;

    document.getElementById("gallery-main-img").src = item.src;
    document.getElementById("gallery-main-img").alt = item.title;
    document.getElementById("gallery-counter").textContent =
      `${String(index + 1).padStart(2, "0")} / ${String(GALLERY_ITEMS.length).padStart(2, "0")}`;
    document.getElementById("gallery-caption-title").textContent = item.title;
    document.getElementById("gallery-caption-desc").textContent = item.desc;
    document.getElementById("gallery-project-tag").textContent = item.project;

    document.querySelectorAll("#gallery-thumbs .thumb").forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("active", thumbIndex === index);
    });

    const activeThumb = document.querySelectorAll("#gallery-thumbs .thumb")[index];
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }

  initGallery();

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxTitle = document.getElementById("lightbox-caption-title");
  const lightboxDesc = document.getElementById("lightbox-caption-desc");

  function openLightbox(src, title, desc) {
    lightboxImg.src = src;
    lightboxImg.alt = title || "";

    if (title || desc) {
      lightboxTitle.textContent = title || "";
      lightboxDesc.textContent = desc || "";
      lightboxTitle.style.display = title ? "" : "none";
      lightboxDesc.style.display = desc ? "" : "none";
      lightboxCaption.style.display = "";
      lightboxImg.classList.remove("no-caption");
    } else {
      lightboxCaption.style.display = "none";
      lightboxImg.classList.add("no-caption");
    }

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".showcase-img img").forEach(img => {
    img.addEventListener("click", event => {
      event.stopPropagation();
      const item = img.closest(".showcase-item");
      const title = item ? item.querySelector(".showcase-title")?.textContent || "" : "";
      const desc = item ? item.querySelector(".showcase-desc")?.textContent || "" : "";
      openLightbox(img.src, title, desc);
    });
  });

  document.querySelectorAll(".screenshot-block img").forEach(img => {
    img.addEventListener("click", event => {
      event.stopPropagation();
      openLightbox(img.src, img.alt || "", "");
    });
  });

  const galleryMainImg = document.getElementById("gallery-main-img");
  if (galleryMainImg) {
    galleryMainImg.addEventListener("click", event => {
      event.stopPropagation();
      if (GALLERY_ITEMS.length > 0) {
        const item = GALLERY_ITEMS[galleryIndex];
        openLightbox(item.src, item.title, item.desc);
      }
    });
  }

  lightbox.addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-close").addEventListener("click", event => {
    event.stopPropagation();
    closeLightbox();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeLightbox();
    if (currentPanel === "gallery" && GALLERY_ITEMS.length > 0) {
      if (event.key === "ArrowLeft") {
        goToGallery((galleryIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
      }
      if (event.key === "ArrowRight") {
        goToGallery((galleryIndex + 1) % GALLERY_ITEMS.length);
      }
    }
  });

  const initialPanel = normalisePanelId(window.location.hash);
  if (initialPanel) switchTo(initialPanel, { updateHash: false });
  syncDocumentTitle(currentPanel);
})();
