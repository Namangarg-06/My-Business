/**
 * Premium Packaging Solutions (P6S) - Main Application Controller
 * Handles Source Tracking, Cart, Auth, Calculator, and PDF-Exact Catalog Render
 */

class P6SApp {
  constructor() {
    this.cart = [];
    this.currentUser = null;
    this.trackingData = {
      source: 'direct',
      ref: '',
      phone: '',
      name: '',
      timestamp: new Date().toISOString()
    };
    
    this.init();
  }

  init() {
    this.loadUserFromStorage();
    this.detectSourceTracking();
    this.initSplashScreen();
    this.renderCatalog();
    this.setupEventListeners();
    this.renderCart();
    this.initInteractiveShowcase();
    this.initCalculator();
    this.updateOwnerStats();
    this.initPWA();
  }

  /* -------------------------------------------------------------
     ROYAL "स्वागतम्" (SWAGATAM) LUXURY SPLASH & VOICE ENGINE
  ------------------------------------------------------------- */
  initSplashScreen() {
    const curtain = document.getElementById('p6sSplashCurtain');
    if (!curtain) return;

    // Check if splash was already shown during this browser session
    // User requirement: "starting pr link krte time chahiye bas welcome wala aur nahi"
    const sessionSplashKey = 'p6s_welcome_seen';
    const hasSeenSplash = sessionStorage.getItem(sessionSplashKey);

    const urlParams = new URLSearchParams(window.location.search);
    const hasExplicitNewLinkParam = urlParams.has('ref') || urlParams.has('client') || urlParams.has('name') || urlParams.has('welcome');

    // If already seen in this session and not a fresh inbound campaign link, remove curtain immediately!
    if (hasSeenSplash && !hasExplicitNewLinkParam) {
      curtain.style.display = 'none';
      if (curtain.parentNode) curtain.parentNode.removeChild(curtain);
      return;
    }

    // Mark as seen for the rest of this session
    sessionStorage.setItem(sessionSplashKey, 'true');

    // Detect client name from storage or link referral
    let clientName = '';
    let greetingMsg = 'Indore Factory Direct Hospitality Atelier';

    if (this.currentUser && this.currentUser.restaurantName) {
      clientName = this.currentUser.restaurantName;
      greetingMsg = 'VIP Hospitality Account Active';
    } else if (this.trackingData && this.trackingData.ref) {
      clientName = this.trackingData.ref.startsWith('@') ? this.trackingData.ref : `@${this.trackingData.ref}`;
      greetingMsg = `Special Welcome for ${this.trackingData.source.toUpperCase()} Partner`;
    } else if (this.trackingData && this.trackingData.name) {
      clientName = this.trackingData.name;
      greetingMsg = 'Valued Partner Guest';
    }

    const clientDisplay = document.getElementById('splashClientName');
    const leadGreeting = document.getElementById('splashLeadGreeting');
    const progressBar = document.getElementById('splashProgressBar');

    if (clientDisplay && clientName) {
      clientDisplay.textContent = clientName;
      clientDisplay.classList.add('visible');
    }

    if (leadGreeting) {
      if (clientName) {
        leadGreeting.innerHTML = `<i class="fas fa-gem" style="color:#e5c07b;"></i> Special Welcome For <strong>${clientName}</strong>`;
      } else {
        leadGreeting.innerHTML = `<i class="fas fa-crown" style="color:#e5c07b;"></i> Welcome to P6S Hospitality Atelier • Indore`;
      }
    }

    if (progressBar) {
      setTimeout(() => {
        progressBar.style.width = '100%';
      }, 50);
    }

    // Play Voice Welcome Announcement on starting entry
    this.playWelcomeVoice(clientName);

    // Auto dismiss after 2.2 seconds
    this.splashTimer = setTimeout(() => {
      this.dismissSplash();
    }, 2200);

    // Click anywhere to dismiss immediately
    curtain.addEventListener('click', (e) => {
      // Don't dismiss if clicking the listen again button
      if (e.target && (e.target.closest('.splash-sound-btn') || e.target.closest('#splashSoundBtn'))) return;
      this.dismissSplash();
    });
  }

  triggerSwagatamScreen(clientName = '', subMessage = 'Welcome to P6S Atelier • Indore', autoDismissMs = 2800) {
    let curtain = document.getElementById('p6sSplashCurtain');
    
    // If curtain was removed or is not in DOM (e.g. subpages), build a luxury toast celebration!
    if (!curtain) {
      this.playWelcomeVoice(clientName, `Swagatam ${clientName}! Your VIP client profile is now active.`);
      this.showCelebrationToast(` स्वागतम् ${clientName}! VIP Factory Rates Active`);
      return;
    }

    const clientDisplay = document.getElementById('splashClientName');
    const leadGreeting = document.getElementById('splashLeadGreeting');
    const progressBar = document.getElementById('splashProgressBar');

    if (clientDisplay) {
      if (clientName) {
        clientDisplay.textContent = clientName;
        clientDisplay.classList.add('visible');
      } else {
        clientDisplay.textContent = '';
        clientDisplay.classList.remove('visible');
      }
    }

    if (leadGreeting) {
      leadGreeting.innerHTML = `<i class="fas fa-crown" style="color:#e5c07b;"></i> ${subMessage}`;
    }

    curtain.style.display = 'flex';
    curtain.classList.remove('splash-hidden');

    if (progressBar) {
      progressBar.style.width = '0%';
      setTimeout(() => { progressBar.style.width = '100%'; }, 50);
    }

    // Voice announcement
    this.playWelcomeVoice(clientName);

    if (this.splashTimer) clearTimeout(this.splashTimer);
    if (autoDismissMs > 0) {
      this.splashTimer = setTimeout(() => {
        this.dismissSplash();
      }, autoDismissMs);
    }
  }

  showCelebrationToast(msg) {
    let toast = document.getElementById('p6sCelebrationToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'p6sCelebrationToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: linear-gradient(135deg, #0b3b82 0%, #071630 100%);
        color: #ffffff;
        border: 2px solid #e5c07b;
        padding: 14px 26px;
        border-radius: 30px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 999999;
        font-family: 'Cinzel', serif;
        font-weight: 800;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s;
        opacity: 0;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-crown text-gold"></i> ${msg}`;
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    }, 50);
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      toast.style.opacity = '0';
    }, 3500);
  }

  playWelcomeVoice(name = '', customMessage = '') {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();

      const cleanName = name ? name.replace('@', '').trim() : '';
      let speechText = '';

      if (customMessage) {
        speechText = customMessage;
      } else if (cleanName) {
        speechText = `Swagatam ${cleanName}! Welcome to Premium Packaging Solutions.`;
      } else {
        speechText = `Swagatam! Welcome to Premium Packaging Solutions, Indore.`;
      }

      this.lastSpokenText = speechText;

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      // Select best voice (Hindi or Indian English or default)
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(v => (v.lang && (v.lang.includes('hi') || v.lang.includes('IN'))) || (v.name && v.name.includes('India')));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log("Voice speech info:", e);
    }
  }

  replayVoice() {
    if (this.lastSpokenText) {
      this.playWelcomeVoice('', this.lastSpokenText);
    } else {
      const clientName = this.currentUser ? this.currentUser.restaurantName : (this.trackingData.ref || '');
      this.playWelcomeVoice(clientName);
    }
  }

  dismissSplash() {
    const curtain = document.getElementById('p6sSplashCurtain');
    if (!curtain) return;
    if (this.splashTimer) clearTimeout(this.splashTimer);
    curtain.classList.add('splash-hidden');
    setTimeout(() => {
      if (curtain && curtain.parentNode) curtain.style.display = 'none';
    }, 700);
  }

  /* -------------------------------------------------------------
     OFF-CANVAS "ALL PRODUCTS" SIDE DRAWER CONTROLLER
  ------------------------------------------------------------- */
  openProductsDrawer() {
    const drawer = document.getElementById('allProductsSideDrawer');
    const backdrop = document.getElementById('sideDrawerBackdrop');
    if (drawer && backdrop) {
      drawer.classList.add('open');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeProductsDrawer() {
    const drawer = document.getElementById('allProductsSideDrawer');
    const backdrop = document.getElementById('sideDrawerBackdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* -------------------------------------------------------------
     1. LINK TAP & SOURCE TRACKING ENGINE
  ------------------------------------------------------------- */
  detectSourceTracking() {
    const params = new URLSearchParams(window.location.search);
    const sourceParam = params.get('source') || params.get('utm_source');
    const refParam = params.get('ref') || params.get('id') || params.get('insta') || params.get('handle');
    const phoneParam = params.get('phone') || params.get('mobile');
    const nameParam = params.get('name') || params.get('client');

    if (sourceParam || refParam || phoneParam || nameParam) {
      this.trackingData = {
        source: sourceParam ? sourceParam.toLowerCase() : (refParam && refParam.startsWith('@') ? 'instagram' : 'referral'),
        ref: refParam || '',
        phone: phoneParam || '',
        name: nameParam || '',
        timestamp: new Date().toISOString()
      };

      this.logVisitorLead(this.trackingData);
      this.showSourceBanner(this.trackingData);
    } else {
      const savedLead = sessionStorage.getItem('p6s_current_source');
      if (savedLead) {
        try {
          this.trackingData = JSON.parse(savedLead);
          this.showSourceBanner(this.trackingData);
        } catch (e) {}
      }
    }
  }

  logVisitorLead(data) {
    sessionStorage.setItem('p6s_current_source', JSON.stringify(data));
    try {
      const logs = JSON.parse(localStorage.getItem('p6s_visitor_leads') || '[]');
      const recent = logs.find(l => (l.ref === data.ref || l.phone === data.phone) && (Date.now() - new Date(l.timestamp).getTime() < 300000));
      if (!recent) {
        logs.unshift({
          ...data,
          device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
          id: 'LEAD-' + Math.floor(1000 + Math.random() * 9000)
        });
        localStorage.setItem('p6s_visitor_leads', JSON.stringify(logs.slice(0, 100)));
      }
    } catch (e) {}
  }

  showSourceBanner(data) {
    const bannerEl = document.getElementById('sourceTrackingBanner');
    const textEl = document.getElementById('sourceBannerText');
    const pillEl = document.getElementById('sourceBannerPill');

    if (!bannerEl || !textEl) return;
    bannerEl.style.display = 'block';

    if (data.source.includes('insta')) {
      const handle = data.ref.startsWith('@') ? data.ref : `@${data.ref}`;
      pillEl.innerHTML = `<i class="fab fa-instagram"></i> INSTAGRAM PARTNER`;
      textEl.innerHTML = `Welcome <strong>${handle || 'Guest'}</strong>! P6S VIP hospitality packaging pricing is unlocked for your restaurant.`;
      
      if (!this.currentUser && handle) {
        const clientInput = document.getElementById('invoiceClientName');
        if (clientInput) clientInput.value = `${handle} Cafe / Restaurant`;
      }
    } else if (data.source.includes('whats') || data.phone) {
      pillEl.innerHTML = `<i class="fab fa-whatsapp"></i> WHATSAPP DIRECT`;
      textEl.innerHTML = `Welcome <strong>${data.name || data.phone || 'Valued Partner'}</strong>! Direct restaurant supply rates loaded.`;
      
      if (!this.currentUser && data.phone) {
        const phoneInput = document.getElementById('clientPhoneInput');
        if (phoneInput) phoneInput.value = data.phone;
      }
    } else if (data.source.includes('qr')) {
      pillEl.innerHTML = `📲 SMART SACHET SCAN`;
      textEl.innerHTML = `You scanned an official <strong>P6S Smart Sachet / QR Stand</strong>!`;
    } else {
      pillEl.innerHTML = `✨ EXCLUSIVE LINK`;
      textEl.innerHTML = `Welcome from <strong>${data.ref || 'Partner Referral'}</strong>! Factory rates active.`;
    }
  }

  /* -------------------------------------------------------------
     2. EXACT PDF-MATCH CATALOG RENDERING
     Displays crystal clear rate tables just like in the brochure!
  ------------------------------------------------------------- */
  renderCatalog(filterCategory = 'all') {
    const container = document.getElementById('catalogGrid');
    if (!container) return;

    const filtered = filterCategory === 'all' 
      ? PRODUCTS_DATA 
      : PRODUCTS_DATA.filter(p => p.category === filterCategory || (filterCategory === 'sachets' && (p.category === 'smart-sachets' || p.category === 'sachets')));

    container.innerHTML = filtered.map(prod => this.createPDFExactCard(prod)).join('');
  }

  createPDFExactCard(prod) {
    // 0. Smart Sachets Overview
    if (prod.id === 'smart-sachets-info') {
      return ''; // Already featured in dedicated spotlight section!
    }

    // 1. Mouth Freshener Sachet (Page 7 - 3 distinct tables)
    if (prod.id === 'mouth-freshener') {
      const tablesHTML = prod.variants.map(v => {
        const rows = v.tiers.map(t => `
          <tr>
            <td>${t.range}</td>
            <td class="rate-highlight">Rs. ${t.rate.toFixed(2)}</td>
          </tr>
        `).join('');

        return `
          <div style="flex: 1; min-width: 260px;">
            <div class="pdf-rate-table-wrapper">
              <div class="pdf-table-header-banner" style="background: ${v.colorTheme};">
                <i class="fas fa-leaf"></i> ${v.name}
              </div>
              <table class="pdf-rate-table">
                <thead>
                  <tr style="background: #f1f5f9;">
                    <th style="width:60%;">QTY. RANGE</th>
                    <th style="width:40%;">RATE / SACHET</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}', '${v.id}')" style="flex:1; padding:7px 12px; font-size:0.82rem;">
                <i class="fas fa-calculator"></i> Order ${v.name.split(' ')[2] || 'Saunf'}
              </button>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="pdf-product-showcase-card" data-category="${prod.category}">
          <div class="pdf-card-header">
            <div class="pdf-card-title-group">
              <h3>${prod.name}</h3>
              <p>${prod.tagline}</p>
            </div>
            <span class="pdf-card-badge">${prod.badge}</span>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:16px;">
            ${tablesHTML}
          </div>

          <div class="pdf-storage-note-box">
            <i class="fas fa-shield-alt"></i>
            <span><strong>Note:</strong> ${prod.storageNote}</span>
          </div>
        </div>
      `;
    }

    // 2. Sugar Sachet (Page 8 - White & Brown Sugar)
    if (prod.id === 'sugar-sachets') {
      const tablesHTML = prod.variants.map(v => {
        const rows = v.tiers.map(t => `
          <tr>
            <td>${t.range}</td>
            <td class="rate-highlight">Rs. ${t.rate.toFixed(2)}</td>
          </tr>
        `).join('');

        return `
          <div style="flex: 1; min-width: 280px;">
            <div class="pdf-rate-table-wrapper">
              <div class="pdf-table-header-banner" style="background: ${v.colorTheme};">
                <i class="fas fa-cube"></i> ${v.name}
              </div>
              <table class="pdf-rate-table">
                <thead>
                  <tr style="background: #f1f5f9;">
                    <th style="width:60%;">QTY. RANGE</th>
                    <th style="width:40%;">RATE / SACHET</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
            <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}', '${v.id}')" style="width:100%; padding:8px 12px; font-size:0.85rem; margin-top:6px;">
              <i class="fas fa-cart-plus"></i> Order ${v.name}
            </button>
          </div>
        `;
      }).join('');

      return `
        <div class="pdf-product-showcase-card" data-category="${prod.category}">
          <div class="pdf-card-header">
            <div class="pdf-card-title-group">
              <h3>${prod.name}</h3>
              <p>${prod.tagline}</p>
            </div>
            <span class="pdf-card-badge">${prod.badge}</span>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:20px;">
            ${tablesHTML}
          </div>

          <div class="pdf-storage-note-box">
            <i class="fas fa-shield-alt"></i>
            <span><strong>Note:</strong> ${prod.storageNote}</span>
          </div>
        </div>
      `;
    }

    // 3. Salt Sachet (Page 9 - Poster Paper vs Metallized Paper)
    if (prod.id === 'salt-sachets' || prod.id === 'black-pepper-sachets') {
      const paperCols = prod.paperOptions.map(p => {
        const rows = p.tiers.map(t => `
          <tr>
            <td>${t.range}</td>
            <td class="rate-highlight">Rs. ${t.rate.toFixed(2)}</td>
          </tr>
        `).join('');

        return `
          <div style="flex: 1; min-width: 270px;">
            <div class="pdf-rate-table-wrapper">
              <div class="pdf-table-header-banner" style="background: #991b1b;">
                <i class="fas fa-scroll"></i> ${p.title}
              </div>
              <table class="pdf-rate-table">
                <thead>
                  <tr style="background: #f1f5f9;">
                    <th style="width:60%;">QTY. RANGE</th>
                    <th style="width:40%;">RATE / SACHET</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="pdf-product-showcase-card" data-category="${prod.category}">
          <div class="pdf-card-header">
            <div class="pdf-card-title-group">
              <h3>${prod.name}</h3>
              <p>${prod.tagline}</p>
            </div>
            <span class="pdf-card-badge">${prod.badge}</span>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:20px;">
            ${paperCols}
          </div>

          <div style="display:flex; gap:12px; margin-top:14px; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}', 'poster')" style="flex:1;">
              <i class="fas fa-calculator"></i> Order Poster Paper
            </button>
            <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}', 'metallized')" style="flex:1; background:#0b3b82;">
              <i class="fas fa-shield-alt"></i> Order Metallized Paper
            </button>
            <button class="btn btn-whatsapp" onclick="app.quickWhatsAppProduct('${prod.name}')">
              <i class="fab fa-whatsapp"></i> WhatsApp
            </button>
          </div>

          <div class="pdf-storage-note-box">
            <i class="fas fa-shield-alt"></i>
            <span><strong>Note:</strong> ${prod.storageNote}</span>
          </div>
        </div>
      `;
    }

    // 4. Pizza Seasoning & Chilli Flakes (Page 10)
    if (prod.id === 'pizza-seasoning-chilli') {
      const variantsCols = prod.variants.map(v => {
        const rows = v.tiers.map(t => `
          <tr>
            <td>${t.range}</td>
            <td class="rate-highlight">Rs. ${t.rate.toFixed(2)}</td>
          </tr>
        `).join('');

        return `
          <div style="flex: 1; min-width: 270px;">
            <div class="pdf-rate-table-wrapper">
              <div class="pdf-table-header-banner" style="background: ${v.colorTheme};">
                <i class="fas fa-pizza-slice"></i> ${v.name}
              </div>
              <table class="pdf-rate-table">
                <thead>
                  <tr style="background: #f1f5f9;">
                    <th style="width:60%;">QTY. RANGE</th>
                    <th style="width:40%;">RATE / SACHET</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
            <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}', '${v.id}')" style="width:100%; padding:8px 12px; font-size:0.85rem; margin-top:6px;">
              <i class="fas fa-cart-plus"></i> Order ${v.name.split(' ')[0]}
            </button>
          </div>
        `;
      }).join('');

      return `
        <div class="pdf-product-showcase-card" data-category="${prod.category}">
          <div class="pdf-card-header">
            <div class="pdf-card-title-group">
              <h3>${prod.name}</h3>
              <p>${prod.tagline}</p>
            </div>
            <span class="pdf-card-badge">${prod.badge}</span>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:20px;">
            ${variantsCols}
          </div>

          <div class="pdf-storage-note-box">
            <i class="fas fa-shield-alt"></i>
            <span><strong>Note:</strong> ${prod.storageNote}</span>
          </div>
        </div>
      `;
    }

    // 5. Butter Paper Sheet (Page 12)
    if (prod.id === 'butter-paper') {
      return `
        <div class="pdf-product-showcase-card" data-category="${prod.category}">
          <div class="pdf-card-header">
            <div class="pdf-card-title-group">
              <h3>${prod.name}</h3>
              <p>${prod.tagline}</p>
            </div>
            <span class="pdf-card-badge">${prod.badge}</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; background:#faf8f5; border:2px dashed #c5a059; border-radius:14px; padding:24px; flex-wrap:wrap; gap:20px;">
            <div>
              <div style="font-size:0.9rem; font-weight:800; color:#854d0e; text-transform:uppercase; letter-spacing:0.05em;">NON OGR FOOD WRAPPING SHEET</div>
              <div style="font-size:3rem; font-weight:900; color:#0b3b82; line-height:1.1;">
                Rs. 290 <span style="font-size:1.1rem; color:#64748b; font-weight:600;">/- kg</span>
              </div>
              <div style="font-size:0.95rem; font-weight:700; color:#991b1b; margin-top:4px;">
                <i class="fas fa-box"></i> MINIMUM ORDER QUANTITY: 30KG
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:10px;">
              <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}')" style="padding:12px 24px;">
                <i class="fas fa-cart-plus"></i> Configure Butter Paper Order
              </button>
              <button class="btn btn-whatsapp" onclick="app.quickWhatsAppProduct('Butter Paper Sheets 30KG')">
                <i class="fab fa-whatsapp"></i> WhatsApp Instant Order
              </button>
            </div>
          </div>

          <div class="pdf-storage-note-box">
            <i class="fas fa-shield-alt"></i>
            <span><strong>Note:</strong> ${prod.storageNote}</span>
          </div>
        </div>
      `;
    }

    // 6. Tissue Paper Price List (Page 13)
    if (prod.id === 'tissue-paper') {
      const renderTissueTable = (tbl, bgHeader) => {
        const rows = tbl.rows.map(r => `
          <tr>
            <td style="font-weight:700;">${r.qty}</td>
            <td class="rate-highlight">₹ ${r.p750}</td>
            <td class="rate-highlight">₹ ${r.p500}</td>
            <td class="rate-highlight">₹ ${r.p250}</td>
          </tr>
        `).join('');

        return `
          <div style="flex:1; min-width:300px;">
            <div class="pdf-rate-table-wrapper">
              <div class="pdf-table-header-banner" style="background:${bgHeader};">
                ${tbl.title}
              </div>
              <table class="pdf-rate-table">
                <thead>
                  <tr style="background:#f1f5f9;">
                    <th>QTY</th>
                    <th>750 PACKS</th>
                    <th>500 PACKS</th>
                    <th>250 PACKS</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </div>
        `;
      };

      return `
        <div class="pdf-product-showcase-card" data-category="${prod.category}">
          <div class="pdf-card-header">
            <div class="pdf-card-title-group">
              <h3>${prod.name}</h3>
              <p>${prod.tagline}</p>
            </div>
            <div style="background:#0b3b82; color:#fff; padding:6px 14px; border-radius:20px; font-weight:800; font-size:0.82rem;">
              SIZE : 27 x 27 CM | 1 PLY
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:20px;">
            ${renderTissueTable(prod.tables.hardTissue, '#0f172a')}
            ${renderTissueTable(prod.tables.softTissue, '#166534')}
          </div>

          <div style="background:#fef3c7; border:1.5px solid #f59e0b; border-radius:10px; padding:12px 18px; margin-top:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div style="font-size:0.95rem; font-weight:800; color:#92400e;">
              <i class="fas fa-cog"></i> CUSTOMISATION CHARGES : ₹2 EXTRA / PACK
            </div>
            <div style="font-size:0.85rem; font-weight:700; color:#b45309;">
              • Minimum Order Quantity for Customisation: 500 Packets
            </div>
          </div>

          <div style="margin-top:16px; display:flex; gap:12px;">
            <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}')" style="flex:1;">
              <i class="fas fa-calculator"></i> Calculate Tissue Order
            </button>
            <button class="btn btn-whatsapp" onclick="app.quickWhatsAppProduct('Tissue Paper Custom Printing')">
              <i class="fab fa-whatsapp"></i> Inquire on WhatsApp
            </button>
          </div>
        </div>
      `;
    }

    // 7. Chopstick (Page 14)
    if (prod.id === 'chopstick') {
      const rows = prod.tiers.map(t => `
        <tr>
          <td>${t.range}</td>
          <td class="rate-highlight">Rs. ${t.rate.toFixed(2)}</td>
        </tr>
      `).join('');

      return `
        <div class="pdf-product-showcase-card" data-category="${prod.category}">
          <div class="pdf-card-header">
            <div class="pdf-card-title-group">
              <h3>${prod.name}</h3>
              <p>${prod.tagline}</p>
            </div>
            <span class="pdf-card-badge">${prod.badge}</span>
          </div>

          <div style="display:flex; gap:24px; align-items:center; flex-wrap:wrap;">
            <div style="flex:1; min-width:280px;">
              <div class="pdf-rate-table-wrapper">
                <div class="pdf-table-header-banner" style="background:#854d0e;">
                  <i class="fas fa-utensils"></i> CHOPSTICK WITH INDIVIDUAL SLEEVE
                </div>
                <table class="pdf-rate-table">
                  <thead>
                    <tr style="background:#f1f5f9;">
                      <th>QTY. RANGE</th>
                      <th>RATE / PAIR</th>
                    </tr>
                  </thead>
                  <tbody>${rows}</tbody>
                </table>
              </div>
            </div>

            <div style="background:#faf8f5; border:1.5px solid #c5a059; border-radius:12px; padding:20px; text-align:center; min-width:220px;">
              <i class="fas fa-box-open" style="font-size:2rem; color:#b8860b; margin-bottom:8px;"></i>
              <div style="font-size:0.8rem; font-weight:700; color:#64748b;">MINIMUM ORDER QUANTITY</div>
              <div style="font-size:1.6rem; font-weight:900; color:#0b3b82;">2,000 Pairs</div>
              <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}')" style="margin-top:12px; width:100%;">
                Order Chopsticks
              </button>
            </div>
          </div>

          <div class="pdf-storage-note-box">
            <i class="fas fa-shield-alt"></i>
            <span><strong>Note:</strong> ${prod.storageNote}</span>
          </div>
        </div>
      `;
    }

    // 8. QR Menu & Customer Engagement (Page 15)
    if (prod.id === 'qr-menu-stands') {
      const standsHTML = prod.stands.map(s => `
        <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:12px; padding:16px; text-align:center; flex:1; min-width:180px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
          <div style="font-size:0.82rem; font-weight:800; color:#64748b;">${s.name}</div>
          <div style="font-size:1.8rem; font-weight:900; color:#0b3b82; margin:6px 0;">₹${s.price}</div>
          <div style="font-size:0.75rem; color:#475569;">${s.subtitle}</div>
        </div>
      `).join('');

      return `
        <div class="pdf-product-showcase-card" data-category="${prod.category}">
          <div class="pdf-card-header">
            <div class="pdf-card-title-group">
              <h3>${prod.name}</h3>
              <p>${prod.tagline}</p>
            </div>
            <span class="pdf-card-badge">${prod.badge}</span>
          </div>

          <!-- Stands Row -->
          <div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:24px;">
            ${standsHTML}
          </div>

          <!-- Plans Row (Standard vs Premium Menu Plan) -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
            <!-- Standard Plan -->
            <div style="background:#faf8f5; border:2px solid #b8860b; border-radius:14px; padding:22px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 style="font-size:1.25rem; font-weight:900; color:#0b3b82;">STANDARD PLAN</h4>
                <span style="background:#16a34a; color:#fff; font-size:0.72rem; font-weight:800; padding:3px 10px; border-radius:12px;">8 Acrylic Stands FREE</span>
              </div>
              <div style="font-size:0.82rem; color:#854d0e; font-weight:700; margin-bottom:12px;">GOOGLE + INSTAGRAM</div>
              <div style="font-size:2.2rem; font-weight:900; color:#0b3b82; line-height:1;">
                ₹2,999 <span style="font-size:0.85rem; font-weight:600; color:#64748b;">/ one time charge</span>
              </div>
              <ul style="list-style:none; margin:16px 0; font-size:0.86rem; color:#334155; line-height:1.7;">
                <li><i class="fab fa-google text-gold"></i> Google Reviews Booster Setup</li>
                <li><i class="fab fa-instagram text-gold"></i> Instagram Follow Integration</li>
                <li><i class="fas fa-paint-brush text-gold"></i> Custom Design (Logo + Theme)</li>
                <li><i class="fas fa-check-circle text-gold"></i> Complete Setup Included</li>
              </ul>
              <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}', 'standard-plan')" style="width:100%;">
                Get Standard Plan
              </button>
            </div>

            <!-- Premium Menu Plan -->
            <div style="background:#f0fdf4; border:2px solid #16a34a; border-radius:14px; padding:22px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 style="font-size:1.25rem; font-weight:900; color:#14532d;">PREMIUM MENU PLAN</h4>
                <span style="background:#0b3b82; color:#fff; font-size:0.72rem; font-weight:800; padding:3px 10px; border-radius:12px;">12 Stands FREE (Yearly)</span>
              </div>
              <div style="font-size:0.82rem; color:#166534; font-weight:700; margin-bottom:12px;">DIGITAL MENU + WHATSAPP</div>
              <div style="font-size:2.2rem; font-weight:900; color:#14532d; line-height:1;">
                ₹649 <span style="font-size:0.85rem; font-weight:600; color:#64748b;">/ month</span>
                <span style="font-size:1.1rem; color:#0b3b82; margin-left:8px;">(₹5,999 / yr)</span>
              </div>
              <ul style="list-style:none; margin:16px 0; font-size:0.86rem; color:#334155; line-height:1.7;">
                <li><i class="fas fa-book-open" style="color:#16a34a;"></i> Complete Digital Dynamic Menu</li>
                <li><i class="fab fa-whatsapp" style="color:#16a34a;"></i> WhatsApp Direct Connect &amp; Order</li>
                <li><i class="fas fa-th-list" style="color:#16a34a;"></i> Category Wise Menu (Food, Drinks, etc.)</li>
                <li><i class="fas fa-mobile-alt" style="color:#16a34a;"></i> 100% Mobile Friendly Setup</li>
              </ul>
              <button class="btn btn-whatsapp" onclick="app.openOrderBuilder('${prod.id}', 'premium-plan')" style="width:100%;">
                Get Premium Digital Menu
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // 9. Printed Paper Cups (Page 16)
    if (prod.id === 'printed-paper-cups') {
      const sizeRows = prod.rates.map(r => `
        <tr>
          <td style="font-weight:700;">${r.size}</td>
          <td class="rate-highlight">₹ ${r.rate.toFixed(2)}</td>
        </tr>
      `).join('');

      return `
        <div class="pdf-product-showcase-card" data-category="${prod.category}">
          <div class="pdf-card-header">
            <div class="pdf-card-title-group">
              <h3>${prod.name}</h3>
              <p>${prod.tagline}</p>
            </div>
            <span class="pdf-card-badge">MINIMUM ORDER 3,000 PCS</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
            <!-- Cup Rates Table -->
            <div class="pdf-rate-table-wrapper">
              <div class="pdf-table-header-banner" style="background:#14532d;">
                <i class="fas fa-coffee"></i> CUP SIZES &amp; RATES / PC
              </div>
              <table class="pdf-rate-table">
                <thead>
                  <tr style="background:#f1f5f9;"><th>SIZE</th><th>RATE / PC</th></tr>
                </thead>
                <tbody>${sizeRows}</tbody>
              </table>
            </div>

            <!-- Lids & Dyes Table -->
            <div>
              <div class="pdf-rate-table-wrapper" style="margin-bottom:12px;">
                <div class="pdf-table-header-banner" style="background:#854d0e;">
                  PAPER CUP LIDS (SEPARATE)
                </div>
                <table class="pdf-rate-table">
                  <tbody>
                    <tr><td>80 MM Dome Lid</td><td class="rate-highlight">₹ 1.00</td></tr>
                    <tr><td>90 MM Dome Lid</td><td class="rate-highlight">₹ 1.30</td></tr>
                    <tr><td>80 MM Sipper Lid</td><td class="rate-highlight">₹ 1.30</td></tr>
                    <tr><td>90 MM Sipper Lid</td><td class="rate-highlight">₹ 1.90</td></tr>
                  </tbody>
                </table>
              </div>

              <!-- Dye Box -->
              <div style="background:#faf8f5; border:1px solid #c5a059; border-radius:10px; padding:10px 14px; font-size:0.85rem;">
                <div style="font-weight:800; color:#0b3b82; margin-bottom:4px;"><i class="fas fa-palette"></i> DESIGN &amp; DYE CHARGES (ONE TIME)</div>
                <div style="display:flex; justify-content:space-between;">
                  <span>Single Colour: <strong>₹ 600</strong></span>
                  <span>Multicolor: <strong>₹ 2,500</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div style="display:flex; gap:12px; margin-top:16px;">
            <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}')" style="flex:1;">
              <i class="fas fa-calculator"></i> Calculate Printed Cup Order
            </button>
            <button class="btn btn-whatsapp" onclick="app.quickWhatsAppProduct('Custom Printed Paper Cups')">
              <i class="fab fa-whatsapp"></i> Inquire on WhatsApp
            </button>
          </div>
        </div>
      `;
    }

    // 10. Paper Cups Non Customised (Page 17)
    if (prod.id === 'plain-paper-cups') {
      const sizeRows = prod.rates.map(r => `
        <tr>
          <td style="font-weight:700;">${r.size}</td>
          <td class="rate-highlight">₹ ${r.rate.toFixed(2)}</td>
        </tr>
      `).join('');

      return `
        <div class="pdf-product-showcase-card" data-category="${prod.category}">
          <div class="pdf-card-header">
            <div class="pdf-card-title-group">
              <h3>${prod.name}</h3>
              <p>${prod.tagline}</p>
            </div>
            <span class="pdf-card-badge">MINIMUM ORDER 20 CARTONS</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
            <div class="pdf-rate-table-wrapper">
              <div class="pdf-table-header-banner" style="background:#0b3b82;">
                PLAIN WHITE CUPS (READY STOCK)
              </div>
              <table class="pdf-rate-table">
                <thead>
                  <tr style="background:#f1f5f9;"><th>SIZE</th><th>RATE / PC</th></tr>
                </thead>
                <tbody>${sizeRows}</tbody>
              </table>
            </div>

            <div class="pdf-rate-table-wrapper">
              <div class="pdf-table-header-banner" style="background:#475569;">
                LIDS (SEPARATE PRICE)
              </div>
              <table class="pdf-rate-table">
                <tbody>
                  <tr><td>80 MM Dome</td><td class="rate-highlight">₹ 1.00</td></tr>
                  <tr><td>90 MM Dome</td><td class="rate-highlight">₹ 1.30</td></tr>
                  <tr><td>80 MM Sipper</td><td class="rate-highlight">₹ 1.30</td></tr>
                  <tr><td>90 MM Sipper</td><td class="rate-highlight">₹ 1.90</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style="display:flex; gap:12px; margin-top:16px;">
            <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}')" style="flex:1;">
              <i class="fas fa-cart-plus"></i> Order Plain Cups
            </button>
            <button class="btn btn-whatsapp" onclick="app.quickWhatsAppProduct('Plain White Paper Cups 20 Cartons')">
              <i class="fab fa-whatsapp"></i> Inquire on WhatsApp
            </button>
          </div>
        </div>
      `;
    }

    return '';
  }

  /* -------------------------------------------------------------
     3. ORDER BUILDER & CONFIGURATOR
  ------------------------------------------------------------- */
  openOrderBuilder(productId, variantId = null) {
    const prod = PRODUCTS_DATA.find(p => p.id === productId);
    if (!prod) return;

    const modal = document.getElementById('orderBuilderModal');
    const title = document.getElementById('builderModalTitle');
    const body = document.getElementById('builderModalBody');

    title.innerText = `Configure Order: ${prod.name}`;

    let optionsHTML = '';

    if (prod.id === 'mouth-freshener' || prod.id === 'sugar-sachets' || prod.id === 'pizza-seasoning-chilli') {
      const variantOptions = prod.variants.map((v, i) => `
        <option value="${v.id}" ${variantId === v.id || i === 0 ? 'selected' : ''}>${v.name}</option>
      `).join('');

      optionsHTML = `
        <div class="form-group">
          <label class="form-label">Select Flavor / Variant:</label>
          <select id="builderVariantSelect" class="form-control" onchange="app.recalcBuilder('${prod.id}')">
            ${variantOptions}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Quantity (${prod.unit}s) - Min MOQ ${prod.moq.toLocaleString('en-IN')}:</label>
          <input type="number" id="builderQtyInput" class="form-control" value="${prod.moq}" min="${prod.moq}" step="1000" oninput="app.recalcBuilder('${prod.id}')">
        </div>
      `;
    } 
    else if (prod.paperOptions) {
      optionsHTML = `
        <div class="form-group">
          <label class="form-label">Select Paper Material:</label>
          <select id="builderPaperSelect" class="form-control" onchange="app.recalcBuilder('${prod.id}')">
            <option value="poster" ${variantId === 'poster' ? 'selected' : ''}>In Poster Paper</option>
            <option value="metallized" ${variantId === 'metallized' ? 'selected' : ''}>In Metallized Paper</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Quantity (${prod.unit}s) - Min MOQ ${prod.moq.toLocaleString('en-IN')}:</label>
          <input type="number" id="builderQtyInput" class="form-control" value="${prod.moq}" min="${prod.moq}" step="1000" oninput="app.recalcBuilder('${prod.id}')">
        </div>
      `;
    }
    else if (prod.pricingType === 'weight_sheet') {
      optionsHTML = `
        <div class="form-group">
          <label class="form-label">Paper Specification:</label>
          <input type="text" class="form-control" value="NON OGR 1-Colour Printed Sheet" disabled>
        </div>
        <div class="form-group">
          <label class="form-label">Order Weight in KG (Min MOQ ${prod.moq} KG):</label>
          <input type="number" id="builderQtyInput" class="form-control" value="${prod.moq}" min="${prod.moq}" step="5" oninput="app.recalcBuilder('${prod.id}')">
        </div>
      `;
    }
    else if (prod.pricingType === 'cups_custom_table') {
      optionsHTML = `
        <div class="form-group">
          <label class="form-label">Cup Size:</label>
          <select id="builderCupSize" class="form-control" onchange="app.recalcBuilder('${prod.id}')">
            <option value="200 ML" data-rate="3.40">200 ML - ₹3.40 / pc</option>
            <option value="250 ML" data-rate="4.15" selected>250 ML - ₹4.15 / pc</option>
            <option value="350 ML" data-rate="5.40">350 ML - ₹5.40 / pc</option>
            <option value="480 ML" data-rate="6.15">480 ML - ₹6.15 / pc</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Quantity (Min Order 3,000 pcs):</label>
          <input type="number" id="builderQtyInput" class="form-control" value="3000" min="3000" step="1000" oninput="app.recalcBuilder('${prod.id}')">
        </div>
        <div class="form-group">
          <label class="form-label">Design & Dye Printing Choice:</label>
          <select id="builderDyeChoice" class="form-control" onchange="app.recalcBuilder('${prod.id}')">
            <option value="600">Single Colour Dye (₹600 One Time)</option>
            <option value="2500">Multicolor Dye (₹2,500 One Time)</option>
            <option value="0">Repeat Order (No Dye Charge - ₹0)</option>
          </select>
        </div>
      `;
    }
    else if (prod.pricingType === 'qr_hardware_plans') {
      optionsHTML = `
        <div class="form-group">
          <label class="form-label">Select QR Hardware / Plan:</label>
          <select id="builderStandSelect" class="form-control" onchange="app.recalcBuilder('${prod.id}')">
            <option value="acrylic_t" data-price="349">Acrylic T-Stand - ₹349 each</option>
            <option value="gold_frame" data-price="449">Gold Frame Luxury Stand - ₹449 each</option>
            <option value="qr_display" data-price="149">QR Display Stand - ₹149 each</option>
            <option value="plan_std" data-price="2999" ${variantId === 'standard-plan' ? 'selected' : ''}>Standard Plan (Google + Insta + 8 FREE Stands) - ₹2,999</option>
            <option value="plan_prem" data-price="5999" ${variantId === 'premium-plan' ? 'selected' : ''}>Premium Menu Plan (Yearly + 12 FREE Stands) - ₹5,999</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Quantity:</label>
          <input type="number" id="builderQtyInput" class="form-control" value="1" min="1" oninput="app.recalcBuilder('${prod.id}')">
        </div>
      `;
    }
    else {
      optionsHTML = `
        <div class="form-group">
          <label class="form-label">Quantity (${prod.unit || 'pcs'}):</label>
          <input type="number" id="builderQtyInput" class="form-control" value="2000" min="1" oninput="app.recalcBuilder('${prod.id}')">
        </div>
      `;
    }

    body.innerHTML = `
      <div style="margin-bottom:18px;">
        ${optionsHTML}
      </div>

      <div id="builderCalcResult" style="background:#faf8f5; border:1.5px solid var(--border-gold-solid); border-radius:12px; padding:18px; margin-bottom:20px;">
        <!-- Filled by recalcBuilder -->
      </div>

      <div style="display:flex; gap:12px;">
        <button class="btn btn-primary" onclick="app.addItemToCartFromBuilder('${prod.id}')" style="flex:1;">
          <i class="fas fa-cart-plus"></i> Add to Order List
        </button>
        <button class="btn btn-whatsapp" onclick="app.orderItemDirectWhatsApp('${prod.id}')" style="flex:1;">
          <i class="fab fa-whatsapp"></i> Order on WhatsApp
        </button>
      </div>
    `;

    modal.classList.add('active');
    this.recalcBuilder(prod.id);
  }

  recalcBuilder(productId) {
    const prod = PRODUCTS_DATA.find(p => p.id === productId);
    if (!prod) return;

    const resultBox = document.getElementById('builderCalcResult');
    const qtyInput = document.getElementById('builderQtyInput');
    const qty = Math.max(1, Number(qtyInput ? qtyInput.value : 1000));

    let calculatedRate = 0;
    let dye = 0;
    let description = prod.name;
    let total = 0;

    if (prod.id === 'mouth-freshener' || prod.id === 'sugar-sachets' || prod.id === 'pizza-seasoning-chilli') {
      const variantSelect = document.getElementById('builderVariantSelect');
      const vId = variantSelect ? variantSelect.value : prod.variants[0].id;
      const variant = prod.variants.find(v => v.id === vId) || prod.variants[0];
      description = variant.name;

      const tier = variant.tiers.find(t => qty >= t.min && qty <= t.max) || variant.tiers[variant.tiers.length - 1];
      calculatedRate = tier ? tier.rate : 1.0;
      total = qty * calculatedRate;
    }
    else if (prod.paperOptions) {
      const paperSelect = document.getElementById('builderPaperSelect');
      const paperVal = paperSelect ? paperSelect.value : 'poster';
      const paperOpt = prod.paperOptions.find(p => p.id === paperVal) || prod.paperOptions[0];
      description = `${prod.name} (${paperOpt.title})`;

      const tier = paperOpt.tiers.find(t => qty >= t.min && qty <= t.max) || paperOpt.tiers[paperOpt.tiers.length - 1];
      calculatedRate = tier ? tier.rate : 0.55;
      total = qty * calculatedRate;
    }
    else if (prod.pricingType === 'weight_sheet') {
      calculatedRate = prod.pricePerUnit; // 290
      description = `Butter Paper (customized)`;
      total = qty * calculatedRate;
    }
    else if (prod.pricingType === 'cups_custom_table') {
      const cupSelect = document.getElementById('builderCupSize');
      const selectedOption = cupSelect.options[cupSelect.selectedIndex];
      calculatedRate = parseFloat(selectedOption.getAttribute('data-rate') || 4.15);
      const cupSize = selectedOption.value;

      const dyeSelect = document.getElementById('builderDyeChoice');
      dye = Number(dyeSelect ? dyeSelect.value : 600);

      description = `Printed Paper Cups ${cupSize} (customized)`;
      total = (qty * calculatedRate) + dye;
    }
    else if (prod.pricingType === 'qr_hardware_plans') {
      const standSelect = document.getElementById('builderStandSelect');
      const selOpt = standSelect.options[standSelect.selectedIndex];
      calculatedRate = parseFloat(selOpt.getAttribute('data-price') || 349);
      description = selOpt.text.split(' - ')[0];
      total = qty * calculatedRate;
    }
    else {
      calculatedRate = 1.00;
      total = qty * calculatedRate;
    }

    resultBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.95rem;">
        <span style="color:#64748b;">Selected Item:</span>
        <strong style="color:#0f172a;">${description}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.92rem;">
        <span style="color:#64748b;">Applied Tier Rate:</span>
        <strong style="color:#991b1b; font-size:1.05rem;">₹ ${calculatedRate.toFixed(2)} / ${prod.unit || 'unit'}</strong>
      </div>
      ${dye > 0 ? `
      <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.92rem;">
        <span style="color:#64748b;">Dye Printing Charge:</span>
        <strong style="color:#0b3b82;">₹ ${dye.toFixed(2)}</strong>
      </div>` : ''}
      <div style="display:flex; justify-content:space-between; border-top:1.5px dashed #cbd5e1; padding-top:10px; margin-top:8px;">
        <span style="color:#0b3b82; font-weight:800; font-size:1.05rem;">Estimated Total:</span>
        <strong style="color:#0b3b82; font-weight:900; font-size:1.3rem;">₹ ${Math.round(total).toLocaleString('en-IN')}</strong>
      </div>
    `;

    this.currentBuilderPayload = {
      productId: prod.id,
      name: description,
      qty: qty,
      unit: prod.unit || 'pcs',
      rate: calculatedRate,
      dye: dye,
      amount: total
    };
  }

  addItemToCartFromBuilder() {
    if (!this.currentBuilderPayload) return;
    this.cart.push({ ...this.currentBuilderPayload, cartId: 'c_' + Date.now() });
    this.renderCart();
    this.closeModal('orderBuilderModal');
    this.toggleCart(true);
  }

  orderItemDirectWhatsApp(productId) {
    if (!this.currentBuilderPayload) return;
    const it = this.currentBuilderPayload;
    const clientName = this.currentUser ? this.currentUser.restaurantName : "Customer";
    const refInfo = this.trackingData.ref ? `\n🎯 *Source:* ${this.trackingData.source} (${this.trackingData.ref})` : '';

    const text = 
`👋 *HELLO PREMIUM PACKAGING SOLUTIONS (P6S)*
I want to order this product:

📦 *Product:* ${it.name}
🔢 *Quantity:* ${it.qty.toLocaleString('en-IN')} ${it.unit}
🏷️ *Applied Rate:* Rs. ${it.rate.toFixed(2)}
🎨 *Dye Charges:* Rs. ${it.dye || 0}
💰 *Total Amount:* Rs. ${Math.round(it.amount).toLocaleString('en-IN')}
-----------------------------------------
👤 *Client:* ${clientName}${refInfo}
📍 *Place:* Indore / Pan-India

Please share the design preview & confirmation!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918462063330?text=${encoded}`, '_blank');
  }

  quickWhatsAppProduct(productName) {
    const text = `Hello P6S Packaging! I want to inquire regarding *${productName}*. Please share delivery timelines and sample designs.`;
    window.open(`https://wa.me/918462063330?text=${encodeURIComponent(text)}`, '_blank');
  }

  /* -------------------------------------------------------------
     4. CART MANAGEMENT & DRAWER
  ------------------------------------------------------------- */
  renderCart() {
    const countBadge = document.getElementById('navCartCount');
    const cartItemsEl = document.getElementById('cartDrawerItems') || document.getElementById('cartItemsList');
    const subtotalEl = document.getElementById('cartDrawerSubtotal') || document.getElementById('cartSubtotalText');

    if (countBadge) countBadge.innerText = this.cart.length;
    if (!cartItemsEl) return;

    if (this.cart.length === 0) {
      cartItemsEl.innerHTML = `
        <div style="text-align:center; padding:40px 10px; color:#64748b;">
          <i class="fas fa-shopping-bag" style="font-size:2.5rem; margin-bottom:12px; color:#cbd5e1;"></i>
          <p style="font-weight:700; color:#1e293b;">Your order list is empty.</p>
          <p style="font-size:0.85rem; margin-top:4px;">Select products above to generate an instant official bill or WhatsApp order.</p>
        </div>
      `;
      if (subtotalEl) subtotalEl.innerText = "₹ 0";
      return;
    }

    let subtotal = 0;
    cartItemsEl.innerHTML = this.cart.map((item, index) => {
      subtotal += item.amount;
      return `
        <div class="cart-item">
          <div>
            <div style="font-weight:700; color:#0b3b82; font-size:0.92rem;">${item.name}</div>
            <div style="font-size:0.8rem; color:#64748b;">
              ${item.qty.toLocaleString('en-IN')} ${item.unit} @ ₹${item.rate.toFixed(2)}
              ${item.dye > 0 ? ` + Dye ₹${item.dye}` : ''}
            </div>
            <div style="font-weight:800; color:#991b1b; font-size:0.95rem; margin-top:4px;">
              ₹ ${Math.round(item.amount).toLocaleString('en-IN')}
            </div>
          </div>
          <button onclick="app.removeFromCart(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:1.1rem; padding:6px;">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
    }).join('');

    if (subtotalEl) subtotalEl.innerText = `₹ ${Math.round(subtotal).toLocaleString('en-IN')}`;

    const waBtn = document.getElementById('cartWhatsAppOrderBtn');
    if (waBtn) {
      if (this.cart.length > 0) {
        let msg = `Hello Naman & Ansh (P6S), I would like to place an order:%0A%0A`;
        this.cart.forEach((it, idx) => {
          msg += `${idx + 1}. *${it.name}* - ${it.qty} ${it.unit} @ Rs. ${it.rate.toFixed(2)}${it.dye > 0 ? ` (Dye: Rs. ${it.dye})` : ''} = Rs. ${Math.round(it.amount)}%0A`;
        });
        msg += `%0A*Estimated Total:* Rs. ${Math.round(subtotal).toLocaleString('en-IN')}%0A%0APlease confirm dispatch timelines for our restaurant.`;
        waBtn.href = `https://wa.me/918462063330?text=${msg}`;
      } else {
        waBtn.href = `https://wa.me/918462063330?text=Hello%20P6S%2C%20I%20want%20to%20order%20packaging.`;
      }
    }
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.renderCart();
  }

  clearCart() {
    this.cart = [];
    this.renderCart();
  }

  toggleCart(open = null) {
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    if (open === true) drawer.classList.add('active');
    else if (open === false) drawer.classList.remove('active');
    else drawer.classList.toggle('active');
  }

  /* -------------------------------------------------------------
     5. AUTOMATIC BILL GENERATION (PDF 2 FORMAT)
  ------------------------------------------------------------- */
  generateInvoiceFromCart() {
    let itemsToBill = [];
    let dyeTotal = 0;

    if (this.cart.length > 0) {
      itemsToBill = this.cart.map(c => {
        dyeTotal += (c.dye || 0);
        return {
          name: c.name,
          qty: c.qty,
          unit: c.unit,
          rate: c.rate,
          dye: c.dye || 0,
          amount: c.amount
        };
      });
    } else {
      // Default to sample products from the invoice PDF!
      itemsToBill = [
        { name: "Butter Paper (customized)", qty: 15.4, unit: "kg", rate: 280, dye: 600, amount: 4912 },
        { name: "White Acrylic Stand", qty: 42, unit: "pcs", rate: 150, dye: 0, amount: 6300 },
        { name: "Golden QR Stand", qty: 3, unit: "pcs", rate: 600, dye: 0, amount: 1800 },
        { name: "Madrasi Sauf", qty: 5, unit: "kg", rate: 180, dye: 0, amount: 900 },
        { name: "Coupon Voucher", qty: 4200, unit: "pcs", rate: 3.30, dye: 0, amount: 13860 }
      ];
      dyeTotal = 600;
    }

    const clientNameInput = document.getElementById('invoiceClientName');
    const clientName = (clientNameInput && clientNameInput.value.trim()) 
      ? clientNameInput.value.trim() 
      : (this.currentUser ? this.currentUser.restaurantName : (this.trackingData.ref ? `${this.trackingData.ref} Restaurant` : "Shree Kripa Midway Restaurant"));

    const sourceTag = this.trackingData.ref ? `${this.trackingData.source} (${this.trackingData.ref})` : "Direct Customer";

    const invoice = window.invoiceEngine.createInvoice({
      clientName: clientName,
      clientPhone: this.currentUser ? this.currentUser.phone : (this.trackingData.phone || "+91 8462063330"),
      items: itemsToBill,
      dyeCharges: dyeTotal > 0 ? dyeTotal : 600,
      deliveryCharges: 300,
      discount: 300,
      sourceTag: sourceTag
    });

    this.displayInvoiceModal(invoice);
  }

  displayInvoiceModal(invoice) {
    const modal = document.getElementById('invoicePreviewModal');
    const container = document.getElementById('invoiceRenderContainer');
    if (!modal || !container) return;

    container.innerHTML = window.invoiceEngine.renderHTML(invoice);
    modal.classList.add('active');
    this.toggleCart(false);
  }

  /* -------------------------------------------------------------
     6. USER AUTH & RESTAURANT PROFILE
  ------------------------------------------------------------- */
  loadUserFromStorage() {
    try {
      const u = localStorage.getItem('p6s_current_user');
      if (u) {
        this.currentUser = JSON.parse(u);
        this.updateUserUI();
      }
    } catch (e) {}
  }

  fillDemoProfile() {
    const r = document.getElementById('authRestName');
    const o = document.getElementById('authOwnerName');
    const p = document.getElementById('authPhone');
    const c = document.getElementById('authCity');
    const g = document.getElementById('authGST');
    if (r) r.value = "The Grand Heritage Bistro";
    if (o) o.value = "Vikram Sharma (Partner)";
    if (p) p.value = "9876543210";
    if (c) c.value = "Indore";
    if (g) g.value = "23AAACH1234F1Z9";
  }

  saveUserProfile() {
    const restName = document.getElementById('authRestName').value.trim();
    const ownerName = document.getElementById('authOwnerName').value.trim();
    const phone = document.getElementById('authPhone').value.trim();
    const city = document.getElementById('authCity').value.trim() || 'Indore';
    const gst = document.getElementById('authGST').value.trim();

    if (!restName || !phone) {
      alert("Please enter at least Restaurant Name and Phone Number.");
      return;
    }

    this.currentUser = {
      restaurantName: restName,
      ownerName: ownerName || restName,
      phone: phone,
      city: city,
      gst: gst,
      joinedAt: new Date().toISOString()
    };

    localStorage.setItem('p6s_current_user', JSON.stringify(this.currentUser));
    this.updateUserUI();
    this.closeModal('loginModal');

    const clientInput = document.getElementById('invoiceClientName');
    if (clientInput) clientInput.value = this.currentUser.restaurantName;

    // Trigger Royal "स्वागतम्" (Swagatam) Voice & Celebration Screen!
    this.triggerSwagatamScreen(
      this.currentUser.restaurantName,
      `VIP Hospitality Client Account Activated • Factory Rates Active`,
      2800
    );
  }

  updateUserUI() {
    const btn = document.getElementById('navUserBtn');
    if (!btn) return;
    if (this.currentUser) {
      btn.innerHTML = `<i class="fas fa-user-circle"></i> ${this.currentUser.restaurantName.substring(0, 14)}...`;
      btn.classList.add('btn-outline-gold');
    } else {
      btn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Client Login`;
    }
  }

  logoutUser() {
    this.currentUser = null;
    localStorage.removeItem('p6s_current_user');
    this.updateUserUI();
    this.closeModal('profileModal');
  }

  /* -------------------------------------------------------------
     7. OWNER / ADMIN PORTAL (FOR ANSH & NAMAN)
  ------------------------------------------------------------- */
  openOwnerPortal() {
    const pin = prompt("🔐 Enter Owner Security PIN (Default: 2026):", "2026");
    if (pin === "2026" || pin === "anshnaman") {
      const modal = document.getElementById('ownerPortalModal');
      this.updateOwnerStats();
      this.renderVisitorLogsTable();
      modal.classList.add('active');
    } else if (pin !== null) {
      alert("Incorrect Security PIN. Please contact Naman or Ansh.");
    }
  }

  updateOwnerStats() {
    try {
      const leads = JSON.parse(localStorage.getItem('p6s_visitor_leads') || '[]');
      const invoices = JSON.parse(localStorage.getItem('p6s_invoices_history') || '[]');

      const totalTaps = leads.length;
      const instaLeads = leads.filter(l => l.source && l.source.includes('insta')).length;
      const whatsLeads = leads.filter(l => l.source && l.source.includes('whats')).length;

      const statTaps = document.getElementById('statTotalTaps');
      const statInsta = document.getElementById('statInstaLeads');
      const statWhats = document.getElementById('statWhatsLeads');
      const statBills = document.getElementById('statTotalInvoices');

      if (statTaps) statTaps.innerText = totalTaps;
      if (statInsta) statInsta.innerText = instaLeads;
      if (statWhats) statWhats.innerText = whatsLeads;
      if (statBills) statBills.innerText = invoices.length;
    } catch (e) {}
  }

  renderVisitorLogsTable() {
    const tbody = document.getElementById('ownerVisitorLogsBody');
    if (!tbody) return;

    const leads = JSON.parse(localStorage.getItem('p6s_visitor_leads') || '[]');
    if (leads.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#64748b;">No link taps recorded yet. Generate a tracked link below to test!</td></tr>`;
      return;
    }

    tbody.innerHTML = leads.map(l => {
      const dateStr = new Date(l.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      });

      return `
        <tr>
          <td><span style="font-weight:700; color:#0b3b82;">${l.source.toUpperCase()}</span></td>
          <td style="color:#b8860b; font-weight:700;">${l.ref || l.phone || l.name || 'Direct Link'}</td>
          <td>${l.device || 'Mobile'}</td>
          <td style="color:#64748b; font-size:0.8rem;">${dateStr}</td>
          <td>
            <a href="https://wa.me/91${(l.phone || '8462063330').replace(/\D/g,'')}" target="_blank" class="btn btn-whatsapp" style="padding:4px 8px; font-size:0.75rem;">
              <i class="fab fa-whatsapp"></i> Chat
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }

  generateTrackedLink() {
    const platform = document.getElementById('genPlatform').value;
    const clientRef = document.getElementById('genClientRef').value.trim();
    const campaign = document.getElementById('genCampaign').value.trim();

    if (!clientRef) {
      alert("Please enter an Instagram handle (@username) or WhatsApp Phone number.");
      return;
    }

    const baseUrl = window.location.origin + window.location.pathname;
    let url = `${baseUrl}?source=${encodeURIComponent(platform)}&ref=${encodeURIComponent(clientRef)}`;
    if (campaign) url += `&campaign=${encodeURIComponent(campaign)}`;

    const outInput = document.getElementById('generatedLinkOutput');
    if (outInput) outInput.value = url;
  }

  copyGeneratedLink() {
    const outInput = document.getElementById('generatedLinkOutput');
    if (!outInput || !outInput.value) return;
    navigator.clipboard.writeText(outInput.value).then(() => {
      alert("✅ Tracked Link copied to clipboard!");
    });
  }

  /* -------------------------------------------------------------
     8. 3D FLIP SACHET DEMO & PACKET SAMPLES
  ------------------------------------------------------------- */
  initInteractiveShowcase() {
    const flipBtn = document.getElementById('flipSachetBtn');
    const sachetBox = document.getElementById('demoSachetBox');
    if (flipBtn && sachetBox) {
      flipBtn.addEventListener('click', () => {
        sachetBox.classList.toggle('flipped');
      });
    }
  }

  flipSamplePacket(sampleId) {
    const el = document.getElementById(sampleId);
    if (el) {
      el.classList.toggle('flipped');
    }
  }

  /* -------------------------------------------------------------
     9. LIVE CALCULATOR TAB
  ------------------------------------------------------------- */
  initCalculator() {
    this.calcProductSelect = document.getElementById('calcProductSelect');
    this.calcQty = document.getElementById('calcQtyInput');
    if (this.calcProductSelect) {
      this.calcProductSelect.addEventListener('change', () => this.updateCalculator());
    }
    if (this.calcQty) {
      this.calcQty.addEventListener('input', () => this.updateCalculator());
    }
    this.updateCalculator();
  }

  updateCalculator() {
    const prodId = this.calcProductSelect ? this.calcProductSelect.value : 'mouth-freshener';
    const qty = Math.max(1, Number(this.calcQty ? this.calcQty.value : 6000));
    const prod = PRODUCTS_DATA.find(p => p.id === prodId) || PRODUCTS_DATA[1];

    let rate = 0.85;
    let dye = 600;

    if (prod.pricingType === 'tiered_multi' && prod.variants) {
      const v = prod.variants[0];
      const tier = v.tiers.find(t => qty >= t.min && qty <= t.max) || v.tiers[v.tiers.length - 1];
      rate = tier.rate;
    } else if (prod.pricingType === 'side_by_side_paper') {
      rate = qty >= 10000 ? 0.40 : (qty >= 8000 ? 0.45 : (qty >= 6000 ? 0.50 : 0.55));
    } else if (prod.pricingType === 'weight_sheet') {
      rate = 290;
      dye = 600;
    } else if (prod.pricingType === 'cups_custom_table') {
      rate = 4.15;
    }

    const itemTotal = qty * rate;
    const grandTotal = itemTotal + dye;

    const rateEl = document.getElementById('calcDisplayRate');
    const dyeEl = document.getElementById('calcDisplayDye');
    const subtotalEl = document.getElementById('calcDisplayTotal');

    if (rateEl) rateEl.innerText = `₹ ${rate.toFixed(2)}`;
    if (dyeEl) dyeEl.innerText = `₹ ${dye.toFixed(2)}`;
    if (subtotalEl) subtotalEl.innerText = `₹ ${Math.round(grandTotal).toLocaleString('en-IN')}`;
  }

  addCalculatedToCart() {
    const prodId = this.calcProductSelect.value;
    const qty = Math.max(1, Number(this.calcQty.value));
    const prod = PRODUCTS_DATA.find(p => p.id === prodId);
    if (!prod) return;

    let rate = 0.85;
    if (prod.pricingType === 'tiered_multi' && prod.variants) {
      const v = prod.variants[0];
      const tier = v.tiers.find(t => qty >= t.min && qty <= t.max) || v.tiers[v.tiers.length - 1];
      rate = tier.rate;
    } else if (prod.pricingType === 'weight_sheet') {
      rate = 290;
    }

    this.cart.push({
      cartId: 'c_' + Date.now(),
      productId: prod.id,
      name: prod.name,
      qty: qty,
      unit: prod.unit || 'pcs',
      rate: rate,
      dye: 600,
      amount: (qty * rate) + 600
    });

    this.renderCart();
    this.toggleCart(true);
  }

  /* -------------------------------------------------------------
     10. EVENT LISTENERS
  ------------------------------------------------------------- */
  setupEventListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const filter = e.target.getAttribute('data-filter');
        this.renderCatalog(filter);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });
  }

  openLoginModal() {
    if (this.currentUser) {
      const modal = document.getElementById('profileModal');
      const pRest = document.getElementById('profRestName');
      const pOwner = document.getElementById('profOwnerName');
      const pPhone = document.getElementById('profPhone');
      const pCity = document.getElementById('profCity');
      if (pRest) pRest.innerText = this.currentUser.restaurantName;
      if (pOwner) pOwner.innerText = this.currentUser.ownerName;
      if (pPhone) pPhone.innerText = this.currentUser.phone;
      if (pCity) pCity.innerText = this.currentUser.city || 'Indore';
      if (modal) modal.classList.add('active');
    } else {
      const modal = document.getElementById('loginModal');
      if (modal) modal.classList.add('active');
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  /* -------------------------------------------------------------
     10. PROGRESSIVE WEB APP (PWA) & MOBILE 1-CLICK INSTALL
  ------------------------------------------------------------- */
  initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
          .then((reg) => console.log('P6S Atelier ServiceWorker active', reg.scope))
          .catch((err) => console.log('ServiceWorker registration error:', err));
      });
    }

    // Capture install prompt event for Android Chrome
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPwaPrompt = e;
      this.showPwaInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPwaPrompt = null;
      this.dismissPwaFloatingBar();
      this.showCelebrationToast('✨ P6S Atelier App Installed on Home Screen!');
    });

    // Create floating install bar for mobile after 1.5 seconds if not standalone
    setTimeout(() => {
      this.createPwaFloatingBar();
    }, 1500);
  }

  showPwaInstallButton() {
    const btns = document.querySelectorAll('.pwa-install-btn');
    btns.forEach(b => {
      b.style.display = 'inline-flex';
    });
  }

  hidePwaInstallButton() {
    const btns = document.querySelectorAll('.pwa-install-btn');
    btns.forEach(b => {
      b.style.display = 'none';
    });
  }

  createPwaFloatingBar() {
    if (sessionStorage.getItem('p6s_pwa_floating_dismissed') || window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }
    if (window.innerWidth > 860) return;
    if (document.getElementById('pwaFloatingBar')) return;

    const bar = document.createElement('div');
    bar.id = 'pwaFloatingBar';
    bar.className = 'pwa-floating-bar';
    bar.innerHTML = `
      <div class="pwa-floating-bar-info">
        <img src="icons/icon-192.svg" alt="P6S" class="pwa-floating-bar-icon">
        <div class="pwa-floating-bar-text">
          <h4>P6S Atelier App</h4>
          <p>Install on phone for 1-click orders</p>
        </div>
      </div>
      <div class="pwa-floating-bar-actions">
        <button type="button" class="pwa-floating-install-btn" onclick="app.promptPwaInstall()">
          <i class="fas fa-download"></i> Install
        </button>
        <button type="button" class="pwa-floating-close-btn" onclick="app.dismissPwaFloatingBar()" title="Close">
          ✕
        </button>
      </div>
    `;
    document.body.appendChild(bar);
  }

  dismissPwaFloatingBar() {
    const bar = document.getElementById('pwaFloatingBar');
    if (bar) bar.remove();
    sessionStorage.setItem('p6s_pwa_floating_dismissed', 'true');
  }

  createPwaModal() {
    if (document.getElementById('pwaInstallModal')) return;
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const modal = document.createElement('div');
    modal.id = 'pwaInstallModal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-box pwa-install-modal-content" style="max-width: 480px; text-align: left; padding: 26px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="icons/icon-192.svg" alt="P6S Icon" style="width: 44px; height: 44px; border-radius: 10px; border: 1px solid #c5a059;">
            <div>
              <h3 style="font-family: 'Cinzel', serif; font-size: 1.1rem; color: #071630; margin: 0;">P6S Atelier Mobile App</h3>
              <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">1-Click Install • Full Screen App Experience</div>
            </div>
          </div>
          <button class="modal-close-btn" onclick="app.closeModal('pwaInstallModal')" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #64748b;">✕</button>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          <button type="button" id="pwaTabAndroid" class="btn ${!isIos ? 'btn-primary' : 'btn-outline-gold'}" onclick="app.switchPwaTab('android')" style="flex: 1; padding: 8px; font-size: 0.85rem;">
            <i class="fab fa-android"></i> Android Phone
          </button>
          <button type="button" id="pwaTabIos" class="btn ${isIos ? 'btn-primary' : 'btn-outline-gold'}" onclick="app.switchPwaTab('ios')" style="flex: 1; padding: 8px; font-size: 0.85rem;">
            <i class="fab fa-apple"></i> iPhone / iPad
          </button>
        </div>

        <div id="pwaGuideAndroid" style="display: ${!isIos ? 'block' : 'none'};">
          <div class="pwa-modal-guide-step">
            <div class="pwa-step-badge">1</div>
            <div style="font-size: 0.88rem; color: #1e293b;">
              Chrome browser me upar right corner me <strong>3 Dots (⋮)</strong> par click karein.
            </div>
          </div>
          <div class="pwa-modal-guide-step">
            <div class="pwa-step-badge">2</div>
            <div style="font-size: 0.88rem; color: #1e293b;">
              Menu me <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> par tap karein.
            </div>
          </div>
          <div class="pwa-modal-guide-step">
            <div class="pwa-step-badge">3</div>
            <div style="font-size: 0.88rem; color: #1e293b;">
              <strong>"Install"</strong> par click karein. P6S App aapki mobile screen par icon bankar save ho jayega!
            </div>
          </div>
        </div>

        <div id="pwaGuideIos" style="display: ${isIos ? 'block' : 'none'};">
          <div class="pwa-modal-guide-step">
            <div class="pwa-step-badge">1</div>
            <div style="font-size: 0.88rem; color: #1e293b;">
              Safari browser me neeche <strong>Share icon ( <i class="fas fa-arrow-up-from-bracket"></i> )</strong> par tap karein.
            </div>
          </div>
          <div class="pwa-modal-guide-step">
            <div class="pwa-step-badge">2</div>
            <div style="font-size: 0.88rem; color: #1e293b;">
              Thoda neeche scroll karke <strong>"Add to Home Screen" <i class="fas fa-plus-square text-gold"></i></strong> select karein.
            </div>
          </div>
          <div class="pwa-modal-guide-step">
            <div class="pwa-step-badge">3</div>
            <div style="font-size: 0.88rem; color: #1e293b;">
              Top-right corner me <strong>"Add"</strong> dabayein. P6S App bina browser bar ke fullscreen app ban jayega!
            </div>
          </div>
        </div>

        <div style="margin-top: 18px; text-align: center;">
          <button type="button" class="btn btn-primary" onclick="app.closeModal('pwaInstallModal')" style="width: 100%; padding: 10px; font-weight: 700;">
            Theek Hai, Samajh Gaya (Got It)
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  switchPwaTab(type) {
    const tabAndroid = document.getElementById('pwaTabAndroid');
    const tabIos = document.getElementById('pwaTabIos');
    const guideAndroid = document.getElementById('pwaGuideAndroid');
    const guideIos = document.getElementById('pwaGuideIos');
    if (type === 'android') {
      if (tabAndroid) { tabAndroid.className = 'btn btn-primary'; }
      if (tabIos) { tabIos.className = 'btn btn-outline-gold'; }
      if (guideAndroid) guideAndroid.style.display = 'block';
      if (guideIos) guideIos.style.display = 'none';
    } else {
      if (tabAndroid) { tabAndroid.className = 'btn btn-outline-gold'; }
      if (tabIos) { tabIos.className = 'btn btn-primary'; }
      if (guideAndroid) guideAndroid.style.display = 'none';
      if (guideIos) guideIos.style.display = 'block';
    }
  }

  promptPwaInstall() {
    if (this.deferredPwaPrompt) {
      this.deferredPwaPrompt.prompt();
      this.deferredPwaPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          console.log('User installed P6S App');
          this.dismissPwaFloatingBar();
        }
        this.deferredPwaPrompt = null;
      });
    } else {
      this.createPwaModal();
      const modal = document.getElementById('pwaInstallModal');
      if (modal) modal.classList.add('active');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new P6SApp();
});
