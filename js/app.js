/**
 * Premium Packaging Solutions (P2S) - Main Application Controller
 * Handles Source Tracking, Cart, Auth, Calculator, and Interactive Modals
 */

class P2SApp {
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
    this.renderCatalog();
    this.setupEventListeners();
    this.renderCart();
    this.initInteractiveShowcase();
    this.initCalculator();
    this.updateOwnerStats();
  }

  /* -------------------------------------------------------------
     1. LINK TAP & SOURCE TRACKING ENGINE
     Detects Instagram handles, WhatsApp numbers, QR sources, etc.
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

      // Save to localStorage leads
      this.logVisitorLead(this.trackingData);

      // Display luxury welcome banner
      this.showSourceBanner(this.trackingData);
    } else {
      // Check if session had previous referral
      const savedLead = sessionStorage.getItem('p2s_current_source');
      if (savedLead) {
        try {
          this.trackingData = JSON.parse(savedLead);
          this.showSourceBanner(this.trackingData);
        } catch (e) {}
      }
    }
  }

  logVisitorLead(data) {
    sessionStorage.setItem('p2s_current_source', JSON.stringify(data));
    try {
      const logs = JSON.parse(localStorage.getItem('p2s_visitor_leads') || '[]');
      // Avoid duplicate log within 5 minutes
      const recent = logs.find(l => (l.ref === data.ref || l.phone === data.phone) && (Date.now() - new Date(l.timestamp).getTime() < 300000));
      if (!recent) {
        logs.unshift({
          ...data,
          device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
          id: 'LEAD-' + Math.floor(1000 + Math.random() * 9000)
        });
        localStorage.setItem('p2s_visitor_leads', JSON.stringify(logs.slice(0, 100)));
      }
    } catch (e) {
      console.warn("Storage error", e);
    }
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
      textEl.innerHTML = `Welcome <strong>${handle || 'Guest'}</strong>! We've unlocked VIP hospitality pricing and custom sample mockups for your brand.`;
      
      // Auto pre-fill client name if empty
      if (!this.currentUser && handle) {
        const clientInput = document.getElementById('invoiceClientName');
        if (clientInput) clientInput.value = `${handle} Cafe/Restaurant`;
      }
    } else if (data.source.includes('whats') || data.phone) {
      pillEl.innerHTML = `<i class="fab fa-whatsapp"></i> WHATSAPP DIRECT`;
      textEl.innerHTML = `Welcome <strong>${data.name || data.phone || 'Valued Partner'}</strong>! Direct restaurant supply pricing is activated.`;
      
      if (!this.currentUser && data.phone) {
        const phoneInput = document.getElementById('clientPhoneInput');
        if (phoneInput) phoneInput.value = data.phone;
      }
    } else if (data.source.includes('qr')) {
      pillEl.innerHTML = `📲 SMART SACHET SCAN`;
      textEl.innerHTML = `You scanned a live <strong>P2S Smart Sachet / QR Stand</strong>! See how your restaurant can have this exact experience.`;
    } else {
      pillEl.innerHTML = `✨ PARTNER LINK`;
      textEl.innerHTML = `Welcome from <strong>${data.ref || 'Exclusive Referral'}</strong>! Special packaging rates are active.`;
    }
  }

  /* -------------------------------------------------------------
     2. CATALOG RENDERING & DYNAMIC PRICING
  ------------------------------------------------------------- */
  renderCatalog(filterCategory = 'all') {
    const container = document.getElementById('catalogGrid');
    if (!container) return;

    const filtered = filterCategory === 'all' 
      ? PRODUCTS_DATA 
      : PRODUCTS_DATA.filter(p => p.category === filterCategory || (filterCategory === 'sachets' && (p.category === 'smart-sachets' || p.category === 'sachets')));

    container.innerHTML = filtered.map(prod => this.createProductCardHTML(prod)).join('');
  }

  createProductCardHTML(prod) {
    let pricingSnippet = '';
    let actionButtons = '';

    // Handle different product structures
    if (prod.pricingType === 'tiered' && prod.variants) {
      const v = prod.variants[0];
      const tierRows = v.tiers.map(t => `
        <tr>
          <td>${t.max === Infinity ? `${t.min.toLocaleString('en-IN')}+` : `${t.min.toLocaleString('en-IN')} - ${t.max.toLocaleString('en-IN')}`}</td>
          <td style="font-weight: 700; color: #f5d77f;">₹ ${t.rate.toFixed(2)}</td>
        </tr>
      `).join('');

      pricingSnippet = `
        <div style="font-size:0.82rem; font-weight:700; color:#d4af37; margin-bottom:6px;">
          ${v.name} (Tiered Rates)
        </div>
        <table class="tier-pricing-table">
          <thead>
            <tr><th>Qty Range</th><th>Rate / ${prod.unit}</th></tr>
          </thead>
          <tbody>${tierRows}</tbody>
        </table>
      `;

      actionButtons = `
        <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}', '${v.id}')" style="flex:1;">
          <i class="fas fa-calculator"></i> Order & Price
        </button>
        <button class="btn btn-whatsapp" onclick="app.quickWhatsAppProduct('${prod.name}')" title="Quick WhatsApp Inquiry">
          <i class="fab fa-whatsapp"></i>
        </button>
      `;
    } 
    else if (prod.pricingType === 'tiered_paper' && prod.paperOptions) {
      const poster = prod.paperOptions[0];
      const metal = prod.paperOptions[1];
      pricingSnippet = `
        <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:8px; color:#d4af37;">
          <span>Poster Paper: ₹0.55 - ₹0.40</span>
          <span>Metallized: ₹0.65 - ₹0.50</span>
        </div>
        <table class="tier-pricing-table">
          <thead>
            <tr><th>Qty</th><th>Poster</th><th>Metallized</th></tr>
          </thead>
          <tbody>
            <tr><td>4k - 6k</td><td>₹ 0.55</td><td>₹ 0.65</td></tr>
            <tr><td>6k - 8k</td><td>₹ 0.50</td><td>₹ 0.60</td></tr>
            <tr><td>8k - 10k</td><td>₹ 0.45</td><td>₹ 0.55</td></tr>
            <tr><td>10k+</td><td>₹ 0.40</td><td>₹ 0.50</td></tr>
          </tbody>
        </table>
      `;
      actionButtons = `
        <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}', 'poster')" style="flex:1;">
          <i class="fas fa-calculator"></i> Order & Price
        </button>
        <button class="btn btn-whatsapp" onclick="app.quickWhatsAppProduct('${prod.name}')">
          <i class="fab fa-whatsapp"></i>
        </button>
      `;
    }
    else if (prod.pricingType === 'weight') {
      pricingSnippet = `
        <div style="background:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.3); border-radius:8px; padding:12px; margin-bottom:16px;">
          <div style="font-size:0.85rem; color:#94a3b8;">Base Price (Non OGR):</div>
          <div style="font-size:1.8rem; font-weight:800; color:#f3e5ab;">₹ 290 <span style="font-size:0.9rem; font-weight:400; color:#94a3b8;">/ kg</span></div>
          <div style="font-size:0.8rem; color:#d4af37; margin-top:4px;">Minimum Order Quantity: 30 KG</div>
        </div>
      `;
      actionButtons = `
        <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}')" style="flex:1;">
          <i class="fas fa-cart-plus"></i> Configure Order
        </button>
        <button class="btn btn-whatsapp" onclick="app.quickWhatsAppProduct('${prod.name}')">
          <i class="fab fa-whatsapp"></i>
        </button>
      `;
    }
    else if (prod.pricingType === 'cups_custom') {
      pricingSnippet = `
        <div style="font-size:0.8rem; color:#94a3b8; margin-bottom:8px;">MOQ: 3,000 pcs | Single Color Dye ₹600 / Multi ₹2,500</div>
        <table class="tier-pricing-table">
          <thead>
            <tr><th>Cup Size</th><th>Rate / Pc</th></tr>
          </thead>
          <tbody>
            <tr><td>200 ML</td><td style="color:#f5d77f; font-weight:700;">₹ 3.40</td></tr>
            <tr><td>250 ML</td><td style="color:#f5d77f; font-weight:700;">₹ 4.15</td></tr>
            <tr><td>350 ML</td><td style="color:#f5d77f; font-weight:700;">₹ 5.40</td></tr>
            <tr><td>480 ML</td><td style="color:#f5d77f; font-weight:700;">₹ 6.15</td></tr>
          </tbody>
        </table>
      `;
      actionButtons = `
        <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}')" style="flex:1;">
          <i class="fas fa-coffee"></i> Custom Cup Order
        </button>
        <button class="btn btn-whatsapp" onclick="app.quickWhatsAppProduct('${prod.name}')">
          <i class="fab fa-whatsapp"></i>
        </button>
      `;
    }
    else if (prod.pricingType === 'fixed_stands') {
      pricingSnippet = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; font-size:0.85rem;">
          <div style="background:rgba(255,255,255,0.03); padding:8px; border-radius:6px;">
            <div style="color:#94a3b8; font-size:0.75rem;">Acrylic T-Stand</div>
            <div style="color:#f3e5ab; font-weight:700; font-size:1.1rem;">₹ 349</div>
          </div>
          <div style="background:rgba(255,255,255,0.03); padding:8px; border-radius:6px;">
            <div style="color:#94a3b8; font-size:0.75rem;">Gold Frame Stand</div>
            <div style="color:#f3e5ab; font-weight:700; font-size:1.1rem;">₹ 449</div>
          </div>
        </div>
        <div style="font-size:0.8rem; color:#10b981; font-weight:600;">✨ Standard Plan ₹2,999 (8 Stands Free)</div>
      `;
      actionButtons = `
        <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}')" style="flex:1;">
          <i class="fas fa-qrcode"></i> Choose QR Stand / Plan
        </button>
        <button class="btn btn-whatsapp" onclick="app.quickWhatsAppProduct('QR Stands & Digital Menu Setup')">
          <i class="fab fa-whatsapp"></i>
        </button>
      `;
    }
    else {
      // General or tissue
      pricingSnippet = `
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:12px; margin-bottom:14px; font-size:0.85rem; color:#94a3b8;">
          ${prod.tagline}
        </div>
      `;
      actionButtons = `
        <button class="btn btn-primary" onclick="app.openOrderBuilder('${prod.id}')" style="flex:1;">
          <i class="fas fa-calculator"></i> Calculate Price
        </button>
        <button class="btn btn-whatsapp" onclick="app.quickWhatsAppProduct('${prod.name}')">
          <i class="fab fa-whatsapp"></i>
        </button>
      `;
    }

    return `
      <div class="product-card" data-category="${prod.category}">
        <span class="product-badge">${prod.badge || 'Premium'}</span>
        <div class="product-icon-wrap">
          <i class="${this.getProductIcon(prod.category)}"></i>
        </div>
        <h3 class="product-title">${prod.name}</h3>
        <p class="product-tagline">${prod.tagline}</p>
        ${pricingSnippet}
        <div class="product-actions">
          ${actionButtons}
        </div>
      </div>
    `;
  }

  getProductIcon(category) {
    switch (category) {
      case 'smart-sachets': return 'fas fa-gem';
      case 'sachets': return 'fas fa-cube';
      case 'paper-packaging': return 'fas fa-scroll';
      case 'hospitality': return 'fas fa-utensils';
      case 'qr-systems': return 'fas fa-qrcode';
      case 'paper-cups': return 'fas fa-coffee';
      default: return 'fas fa-box-open';
    }
  }

  /* -------------------------------------------------------------
     3. ORDER BUILDER & DYNAMIC CART CALCULATION
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
        <div class="form-group">
          <label class="form-label">Packaging Paper Type:</label>
          <select id="builderPaperType" class="form-control">
            <option value="Poster Paper">Custom Printed Poster Paper</option>
            <option value="Metallized Paper">Premium Metallized Barrier Paper</option>
          </select>
        </div>
      `;
    } 
    else if (prod.pricingType === 'tiered_paper') {
      // Salt, Pepper
      optionsHTML = `
        <div class="form-group">
          <label class="form-label">Select Paper Material:</label>
          <select id="builderPaperSelect" class="form-control" onchange="app.recalcBuilder('${prod.id}')">
            <option value="poster">In Poster Paper (More Economical)</option>
            <option value="metallized">In Metallized Paper (Luxury Metallic Finish)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Quantity (${prod.unit}s) - Min MOQ ${prod.moq.toLocaleString('en-IN')}:</label>
          <input type="number" id="builderQtyInput" class="form-control" value="${prod.moq}" min="${prod.moq}" step="1000" oninput="app.recalcBuilder('${prod.id}')">
        </div>
      `;
    }
    else if (prod.pricingType === 'weight') {
      // Butter paper
      optionsHTML = `
        <div class="form-group">
          <label class="form-label">Paper Specification:</label>
          <input type="text" class="form-control" value="Non OGR 1-Colour Printed Sheet" disabled>
        </div>
        <div class="form-group">
          <label class="form-label">Order Weight in KG (Min MOQ ${prod.moq} KG):</label>
          <input type="number" id="builderQtyInput" class="form-control" value="${prod.moq}" min="${prod.moq}" step="5" oninput="app.recalcBuilder('${prod.id}')">
        </div>
      `;
    }
    else if (prod.pricingType === 'cups_custom') {
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
        <div class="form-group">
          <label class="form-label">Matching Lids (Optional):</label>
          <select id="builderLidSelect" class="form-control" onchange="app.recalcBuilder('${prod.id}')">
            <option value="none">No Lids Needed</option>
            <option value="dome_80" data-rate="1.00">80 MM Dome Lid (+₹1.00/pc)</option>
            <option value="sipper_80" data-rate="1.30">80 MM Sipper Lid (+₹1.30/pc)</option>
            <option value="dome_90" data-rate="1.30">90 MM Dome Lid (+₹1.30/pc)</option>
            <option value="sipper_90" data-rate="1.90">90 MM Sipper Lid (+₹1.90/pc)</option>
          </select>
        </div>
      `;
    }
    else if (prod.pricingType === 'fixed_stands') {
      optionsHTML = `
        <div class="form-group">
          <label class="form-label">Select QR Hardware / Plan:</label>
          <select id="builderStandSelect" class="form-control" onchange="app.recalcBuilder('${prod.id}')">
            <option value="acrylic_t" data-price="349">Acrylic T-Stand - ₹349 each</option>
            <option value="gold_frame" data-price="449">Gold Frame Luxury Stand - ₹449 each</option>
            <option value="qr_display" data-price="149">QR Display Stand - ₹149 each</option>
            <option value="plan_std" data-price="2999">Standard Plan (Google + Insta + 8 FREE Stands) - ₹2,999</option>
            <option value="plan_prem" data-price="5999">Premium Menu Plan (Yearly + 12 FREE Stands) - ₹5,999</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Quantity:</label>
          <input type="number" id="builderQtyInput" class="form-control" value="1" min="1" oninput="app.recalcBuilder('${prod.id}')">
        </div>
      `;
    }
    else {
      // Default
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

      <!-- Live Calculation Box -->
      <div id="builderCalcResult" style="background:rgba(212,175,55,0.06); border:1px solid var(--border-gold); border-radius:12px; padding:18px; margin-bottom:20px;">
        <!-- Filled by recalcBuilder -->
      </div>

      <div style="display:flex; gap:12px;">
        <button class="btn btn-primary" onclick="app.addItemToCartFromBuilder('${prod.id}')" style="flex:1;">
          <i class="fas fa-cart-plus"></i> Add to Order List
        </button>
        <button class="btn btn-whatsapp" onclick="app.orderItemDirectWhatsApp('${prod.id}')" style="flex:1;">
          <i class="fab fa-whatsapp"></i> Order Directly on WhatsApp
        </button>
      </div>
    `;

    modal.classList.add('active');
    this.recalcBuilder(prod.id);
  }

  // Calculate live price in modal
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
    else if (prod.pricingType === 'tiered_paper') {
      const paperSelect = document.getElementById('builderPaperSelect');
      const paperVal = paperSelect ? paperSelect.value : 'poster';
      const paperOpt = prod.paperOptions.find(p => p.id === paperVal) || prod.paperOptions[0];
      description = `${prod.name} (${paperOpt.name})`;

      const tier = paperOpt.tiers.find(t => qty >= t.min && qty <= t.max) || paperOpt.tiers[paperOpt.tiers.length - 1];
      calculatedRate = tier ? tier.rate : 0.55;
      total = qty * calculatedRate;
    }
    else if (prod.pricingType === 'weight') {
      calculatedRate = prod.pricePerUnit; // 290
      description = `Butter Paper (customized)`;
      total = qty * calculatedRate;
    }
    else if (prod.pricingType === 'cups_custom') {
      const cupSelect = document.getElementById('builderCupSize');
      const selectedOption = cupSelect.options[cupSelect.selectedIndex];
      calculatedRate = parseFloat(selectedOption.getAttribute('data-rate') || 4.15);
      const cupSize = selectedOption.value;

      const dyeSelect = document.getElementById('builderDyeChoice');
      dye = Number(dyeSelect ? dyeSelect.value : 600);

      const lidSelect = document.getElementById('builderLidSelect');
      let lidRate = 0;
      let lidText = "";
      if (lidSelect && lidSelect.value !== 'none') {
        const lidOpt = lidSelect.options[lidSelect.selectedIndex];
        lidRate = parseFloat(lidOpt.getAttribute('data-rate') || 0);
        lidText = ` + ${lidOpt.text}`;
      }

      description = `Printed Paper Cups ${cupSize}${lidText} (customized)`;
      calculatedRate = calculatedRate + lidRate;
      total = (qty * calculatedRate) + dye;
    }
    else if (prod.pricingType === 'fixed_stands') {
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
        <span style="color:#94a3b8;">Item:</span>
        <strong style="color:#fff;">${description}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.92rem;">
        <span style="color:#94a3b8;">Rate Applied:</span>
        <strong style="color:#f5d77f;">₹ ${calculatedRate.toFixed(2)} / ${prod.unit || 'unit'}</strong>
      </div>
      ${dye > 0 ? `
      <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.92rem;">
        <span style="color:#94a3b8;">Dye Printing Charge:</span>
        <strong style="color:#93c5fd;">₹ ${dye.toFixed(2)}</strong>
      </div>` : ''}
      <div style="display:flex; justify-content:space-between; border-top:1px dashed var(--border-gold); padding-top:10px; margin-top:8px;">
        <span style="color:#f3e5ab; font-weight:700; font-size:1.1rem;">Estimated Amount:</span>
        <strong style="color:#f3e5ab; font-weight:800; font-size:1.25rem;">₹ ${Math.round(total).toLocaleString('en-IN')}</strong>
      </div>
    `;

    // Store current calculated payload on modal for easy retrieval
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
`👋 *HELLO PREMIUM PACKAGING SOLUTIONS (P2S)*
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
    const text = `Hello P2S Packaging! I am interested in inquiring about *${productName}*. Please share catalog, minimum order and design mockups.`;
    window.open(`https://wa.me/918462063330?text=${encodeURIComponent(text)}`, '_blank');
  }

  /* -------------------------------------------------------------
     4. CART MANAGEMENT & DRAWER
  ------------------------------------------------------------- */
  renderCart() {
    const countBadge = document.getElementById('navCartCount');
    const cartItemsEl = document.getElementById('cartDrawerItems');
    const subtotalEl = document.getElementById('cartDrawerSubtotal');

    if (countBadge) countBadge.innerText = this.cart.length;

    if (!cartItemsEl) return;

    if (this.cart.length === 0) {
      cartItemsEl.innerHTML = `
        <div style="text-align:center; padding:40px 10px; color:#64748b;">
          <i class="fas fa-shopping-bag" style="font-size:2.5rem; margin-bottom:12px; color:rgba(212,175,55,0.3);"></i>
          <p>Your order list is empty.</p>
          <p style="font-size:0.8rem; margin-top:4px;">Select items from the catalog to build an instant bill or WhatsApp order.</p>
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
            <div style="font-weight:700; color:#fff; font-size:0.92rem;">${item.name}</div>
            <div style="font-size:0.8rem; color:#94a3b8;">
              ${item.qty.toLocaleString('en-IN')} ${item.unit} @ ₹${item.rate.toFixed(2)}
              ${item.dye > 0 ? ` + Dye ₹${item.dye}` : ''}
            </div>
            <div style="font-weight:700; color:#f5d77f; font-size:0.92rem; margin-top:4px;">
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
     5. AUTOMATIC BILL / INVOICE GENERATOR (MATCHING PDF 2 FORMAT)
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
      // Default to the exact sample products from the invoice PDF!
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
      dyeCharges: dyeTotal > 0 ? dyeTotal : 0,
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
      const u = localStorage.getItem('p2s_current_user');
      if (u) {
        this.currentUser = JSON.parse(u);
        this.updateUserUI();
      }
    } catch (e) {}
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

    localStorage.setItem('p2s_current_user', JSON.stringify(this.currentUser));
    this.updateUserUI();
    this.closeModal('loginModal');

    // Auto-update invoice client name if input exists
    const clientInput = document.getElementById('invoiceClientName');
    if (clientInput) clientInput.value = this.currentUser.restaurantName;

    alert(`✨ Welcome ${this.currentUser.restaurantName}! Your client profile is active.`);
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
    localStorage.removeItem('p2s_current_user');
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
      alert("Incorrect Security PIN. Please contact Ansh or Naman.");
    }
  }

  updateOwnerStats() {
    try {
      const leads = JSON.parse(localStorage.getItem('p2s_visitor_leads') || '[]');
      const invoices = JSON.parse(localStorage.getItem('p2s_invoices_history') || '[]');

      const totalTaps = leads.length;
      const instaLeads = leads.filter(l => l.source && l.source.includes('insta')).length;
      const whatsLeads = leads.filter(l => l.source && l.source.includes('whats')).length;
      const qrLeads = leads.filter(l => l.source && l.source.includes('qr')).length;

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

    const leads = JSON.parse(localStorage.getItem('p2s_visitor_leads') || '[]');
    if (leads.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#94a3b8;">No link taps recorded yet. Generate a tracked link below to test!</td></tr>`;
      return;
    }

    tbody.innerHTML = leads.map(l => {
      const dateStr = new Date(l.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      });

      return `
        <tr>
          <td><span style="font-weight:700; color:#fff;">${l.source.toUpperCase()}</span></td>
          <td style="color:#f5d77f; font-weight:700;">${l.ref || l.phone || l.name || 'Direct Link'}</td>
          <td>${l.device || 'Mobile'}</td>
          <td style="color:#94a3b8; font-size:0.8rem;">${dateStr}</td>
          <td>
            <a href="https://wa.me/91${(l.phone || '8462063330').replace(/\D/g,'')}" target="_blank" class="btn btn-whatsapp" style="padding:4px 8px; font-size:0.75rem;">
              <i class="fab fa-whatsapp"></i> Chat
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Generate trackable URL for Instagram Bio, DM or WhatsApp
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
      alert("✅ Tracked Link copied to clipboard! You can paste it into Instagram Bio or WhatsApp messages.");
    });
  }

  /* -------------------------------------------------------------
     8. INTERACTIVE SMART SACHET 3D FLIP DEMO
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

  /* -------------------------------------------------------------
     9. INSTANT LIVE CALCULATOR TAB
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
    const qty = Math.max(1, Number(this.calcQty ? this.calcQty.value : 5000));
    const prod = PRODUCTS_DATA.find(p => p.id === prodId) || PRODUCTS_DATA[1];

    let rate = 0.90;
    let name = prod.name;
    let dye = 600;

    if (prod.pricingType === 'tiered' && prod.variants) {
      const v = prod.variants[0];
      name = v.name;
      const tier = v.tiers.find(t => qty >= t.min && qty <= t.max) || v.tiers[v.tiers.length - 1];
      rate = tier.rate;
    } else if (prod.pricingType === 'tiered_paper') {
      rate = qty >= 10000 ? 0.40 : (qty >= 8000 ? 0.45 : (qty >= 6000 ? 0.50 : 0.55));
    } else if (prod.pricingType === 'weight') {
      rate = 290;
      dye = 600;
    } else if (prod.pricingType === 'cups_custom') {
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

    let rate = 0.90;
    if (prod.pricingType === 'tiered' && prod.variants) {
      const v = prod.variants[0];
      const tier = v.tiers.find(t => qty >= t.min && qty <= t.max) || v.tiers[v.tiers.length - 1];
      rate = tier.rate;
    } else if (prod.pricingType === 'weight') {
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
     10. EVENT LISTENERS & MODAL CONTROLS
  ------------------------------------------------------------- */
  setupEventListeners() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const filter = e.target.getAttribute('data-filter');
        this.renderCatalog(filter);
      });
    });

    // Close modal triggers
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
      // Show Profile Modal
      const modal = document.getElementById('profileModal');
      document.getElementById('profRestName').innerText = this.currentUser.restaurantName;
      document.getElementById('profOwnerName').innerText = this.currentUser.ownerName;
      document.getElementById('profPhone').innerText = this.currentUser.phone;
      document.getElementById('profCity').innerText = this.currentUser.city;
      modal.classList.add('active');
    } else {
      const modal = document.getElementById('loginModal');
      modal.classList.add('active');
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }
}

// Instantiate Global App
window.addEventListener('DOMContentLoaded', () => {
  window.app = new P2SApp();
});
