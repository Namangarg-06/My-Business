/**
 * Premium Packaging Solutions (P2S) - Invoice Generation Engine
 * Generates official hospitality invoices matching the company format
 */

class InvoiceEngine {
  constructor() {
    this.currentInvoice = null;
  }

  // Generate a formatted invoice object
  createInvoice({
    clientName = "Valued Hospitality Client",
    clientPhone = "",
    clientAddress = "Indore",
    items = [],
    dyeCharges = 0,
    deliveryCharges = 0,
    discount = 0,
    sourceTag = ""
  }) {
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    const invoiceNum = `INV-${date.getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`;

    let itemsTotal = 0;
    const formattedItems = items.map((item, index) => {
      const sNo = String(index + 1).padStart(2, '0');
      const qtyStr = typeof item.qty === 'number' ? `${item.qty.toLocaleString('en-IN')} ${item.unit || 'pcs'}` : item.qty;
      const rate = Number(item.rate || 0);
      const dye = Number(item.dye || 0);
      const amount = Number(item.amount || (item.qty * rate + dye));
      itemsTotal += amount;

      return {
        sNo,
        description: item.name || item.description,
        qty: qtyStr,
        rate: rate % 1 === 0 ? rate.toFixed(0) : rate.toFixed(2),
        dye: dye > 0 ? dye.toFixed(0) : '0',
        amount: Math.round(amount).toLocaleString('en-IN')
      };
    });

    const grandTotal = Math.max(0, itemsTotal + Number(dyeCharges) + Number(deliveryCharges) - Number(discount));

    const invoiceObj = {
      invoiceNo: `#${invoiceNum}`,
      date: formattedDate,
      place: "Indore",
      clientName: clientName || "Valued Customer",
      clientPhone,
      clientAddress,
      items: formattedItems,
      itemsTotal: Math.round(itemsTotal).toLocaleString('en-IN'),
      dyeCharges: Number(dyeCharges).toFixed(2),
      deliveryCharges: Number(deliveryCharges).toFixed(2),
      discount: Number(discount).toFixed(2),
      grandTotal: Math.round(grandTotal).toLocaleString('en-IN'),
      sourceTag: sourceTag || "Direct Visit",
      createdAt: new Date().toISOString()
    };

    this.currentInvoice = invoiceObj;
    this.saveToHistory(invoiceObj);
    return invoiceObj;
  }

  // Save generated invoice to localStorage
  saveToHistory(invoice) {
    try {
      const history = JSON.parse(localStorage.getItem('p2s_invoices_history') || '[]');
      history.unshift(invoice);
      localStorage.setItem('p2s_invoices_history', JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  // Render the exact HTML template matching the PDF invoice
  renderHTML(invoice) {
    const itemsRows = invoice.items.map(it => `
      <tr>
        <td class="text-center">${it.sNo}</td>
        <td>${it.description}</td>
        <td class="text-center">${it.qty}</td>
        <td class="text-right">${it.rate}</td>
        <td class="text-right">${it.dye}</td>
        <td class="text-right" style="font-weight: 700;">${it.amount}</td>
      </tr>
    `).join('');

    return `
      <div id="printableInvoice" class="invoice-wrapper">
        <!-- Header -->
        <h1 class="invoice-header-title">Premium Packaging Solutions</h1>
        <div class="invoice-header-subtitle">SUPPLIER OF SMART SACHETS & HOSPITALITY PACKAGING SOLUTIONS</div>
        
        <!-- Blue Banner -->
        <div class="invoice-banner-bar">INVOICE</div>

        <!-- Meta Details -->
        <div class="invoice-meta-row">
          <div>Invoice No: <strong>${invoice.invoiceNo}</strong></div>
          <div>Date: <strong>${invoice.date}</strong></div>
          <div>Place: <strong>${invoice.place}</strong></div>
        </div>

        <div class="invoice-client-row">
          Client Name: <span>${invoice.clientName}</span>
          ${invoice.clientPhone ? `<span style="color:#64748b; font-size:0.85rem; margin-left:12px;">(Ph: ${invoice.clientPhone})</span>` : ''}
        </div>

        <!-- Table of Products -->
        <table class="invoice-table">
          <thead>
            <tr>
              <th style="width: 8%;">S.NO</th>
              <th style="width: 44%;">DESCRIPTION</th>
              <th style="width: 15%;">QTY</th>
              <th style="width: 11%;">RATE</th>
              <th style="width: 10%;">DYE</th>
              <th style="width: 12%;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <!-- Summary Calculation Block -->
        <div class="invoice-calc-table-wrap">
          <table class="invoice-calc-table">
            <tbody>
              <tr>
                <td class="label-col">Items Total</td>
                <td class="val-col">₹ ${invoice.itemsTotal}</td>
              </tr>
              <tr>
                <td class="label-col">Dye Charges</td>
                <td class="val-col">₹ ${invoice.dyeCharges}</td>
              </tr>
              <tr>
                <td class="label-col">Delivery Charges</td>
                <td class="val-col">₹ ${invoice.deliveryCharges}</td>
              </tr>
              <tr>
                <td class="label-col">Discount</td>
                <td class="val-col">₹ ${invoice.discount}</td>
              </tr>
              <tr class="grand-total-row">
                <td class="label-col" style="color: #fff; background: #0b3b82;">GRAND TOTAL</td>
                <td class="val-col" style="color: #fff; background: #0b3b82; font-weight: 800;">₹ ${invoice.grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Terms & Conditions -->
        <div class="invoice-terms">
          <div class="invoice-terms-title">Terms & Conditions:</div>
          <ol>
            <li>Goods once sold will not be taken back or exchanged.</li>
            <li>We are not responsible for any damage after delivery.</li>
            <li>All customized orders are final and non-refundable.</li>
            <li>Payment Terms: 50% Advance Payment, 50% Before Delivery.</li>
            <li>First order delivery is free; charges apply on subsequent orders.</li>
          </ol>
        </div>

        <div class="invoice-owners-signature">
          Business Owners: Ansh & Naman
        </div>

        <!-- Footer -->
        <div class="invoice-footer-message">
          <strong>Thank you for your business!</strong>
          For any queries, please reach out to us.<br>
          Contact: <strong>+91 9111789220 | +91 8462063330</strong>
        </div>
      </div>
    `;
  }

  // Native print to standard A4
  print() {
    window.print();
  }

  // Download PDF file using html2pdf if available or fallback to print
  downloadPDF(filename = null) {
    const element = document.getElementById('printableInvoice');
    if (!element) return;

    const name = filename || `P2S_Invoice_${this.currentInvoice ? this.currentInvoice.invoiceNo.replace('#', '') : 'order'}.pdf`;

    if (window.html2pdf) {
      const opt = {
        margin: [8, 8, 8, 8],
        filename: name,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      window.html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  }

  // Format message and open WhatsApp
  shareToWhatsApp(phoneNumber = "918462063330") {
    if (!this.currentInvoice) return;
    const inv = this.currentInvoice;

    let itemsText = "";
    inv.items.forEach(it => {
      itemsText += `• ${it.description} (${it.qty}) @ Rs. ${it.rate} = Rs. ${it.amount}\n`;
    });

    const text = 
`🧾 *OFFICIAL BILL / INVOICE - PREMIUM PACKAGING SOLUTIONS (P2S)*
----------------------------------------
📄 *Invoice No:* ${inv.invoiceNo}
📅 *Date:* ${inv.date}
📍 *Place:* ${inv.place}
👤 *Client Name:* ${inv.clientName}
${inv.clientPhone ? `📞 *Phone:* ${inv.clientPhone}\n` : ''}----------------------------------------
📦 *ITEM DETAILS:*
${itemsText}----------------------------------------
💰 *Items Total:* Rs. ${inv.itemsTotal}
🎨 *Dye Charges:* Rs. ${inv.dyeCharges}
🚚 *Delivery Charges:* Rs. ${inv.deliveryCharges}
🎁 *Discount:* Rs. ${inv.discount}
⭐ *GRAND TOTAL: Rs. ${inv.grandTotal}*
----------------------------------------
💼 *Business Owners:* Ansh & Naman
📞 *Contact:* +91 8462063330 | +91 9111789220
🏷️ *Source:* ${inv.sourceTag}
----------------------------------------
Please confirm and initiate order processing!`;

    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
    window.open(url, '_blank');
  }
}

window.invoiceEngine = new InvoiceEngine();
