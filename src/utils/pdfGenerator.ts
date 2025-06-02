
export interface PackingSheetData {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  expectedAttendance: number;
  items: {
    id: string;
    name: string;
    assignedQuantity: number;
    price: number;
    tags: string[];
    notes: string;
  }[];
  totalItems: number;
  totalValue: number;
}

export const generatePackingSheetHTML = (data: PackingSheetData): string => {
  const categorizedItems = categorizeItems(data.items);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tour Merchandise Packing Sheet</title>
  <style>
    @page { 
      size: A4; 
      margin: 0.75in; 
    }
    
    body { 
      font-family: Arial, sans-serif; 
      font-size: 11px; 
      line-height: 1.4; 
      color: #333;
    }
    
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start; 
      margin-bottom: 20px; 
      border-bottom: 2px solid #000; 
      padding-bottom: 10px; 
    }
    
    .logo { 
      font-size: 16px; 
      font-weight: bold; 
    }
    
    .title { 
      text-align: center; 
      font-size: 18px; 
      font-weight: bold; 
      margin: 0; 
    }
    
    .event-details { 
      text-align: right; 
      font-size: 10px; 
    }
    
    .summary { 
      background: #f5f5f5; 
      padding: 10px; 
      margin: 15px 0; 
      border: 1px solid #ddd; 
    }
    
    .summary-row { 
      display: flex; 
      justify-content: space-between; 
      margin: 5px 0; 
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 15px 0; 
    }
    
    th { 
      background: #333; 
      color: white; 
      padding: 8px 4px; 
      text-align: left; 
      font-size: 10px; 
      font-weight: bold; 
    }
    
    td { 
      padding: 6px 4px; 
      border-bottom: 1px solid #ddd; 
      font-size: 10px; 
    }
    
    tr:nth-child(even) { 
      background: #f9f9f9; 
    }
    
    .category-header { 
      background: #e0e0e0; 
      font-weight: bold; 
      text-transform: uppercase; 
    }
    
    .subtotal { 
      background: #f0f0f0; 
      font-weight: bold; 
    }
    
    .checkbox { 
      width: 15px; 
      height: 15px; 
      border: 1px solid #333; 
      display: inline-block; 
    }
    
    .footer { 
      margin-top: 30px; 
      page-break-inside: avoid; 
    }
    
    .checklist { 
      background: #f9f9f9; 
      padding: 15px; 
      border: 1px solid #ddd; 
    }
    
    .signature-block { 
      display: flex; 
      justify-content: space-between; 
      margin-top: 20px; 
    }
    
    .signature { 
      border-bottom: 1px solid #333; 
      width: 150px; 
      margin: 10px 0; 
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">SPELMAN GLEE CLUB</div>
    <h1 class="title">TOUR MERCHANDISE PACKING SHEET</h1>
    <div class="event-details">
      <strong>${data.eventTitle}</strong><br>
      ${data.eventDate}<br>
      ${data.eventLocation}<br>
      Expected: ${data.expectedAttendance} attendees
    </div>
  </div>

  <div class="summary">
    <div class="summary-row">
      <span><strong>Total Items Assigned:</strong></span>
      <span>${data.totalItems}</span>
    </div>
    <div class="summary-row">
      <span><strong>Total Estimated Value:</strong></span>
      <span>$${data.totalValue.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span><strong>Generated:</strong></span>
      <span>${new Date().toLocaleString()}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 15%">Item Name</th>
        <th style="width: 10%">Category</th>
        <th style="width: 8%">Qty</th>
        <th style="width: 8%">Price</th>
        <th style="width: 10%">Total</th>
        <th style="width: 25%">Notes</th>
        <th style="width: 12%">Storage</th>
        <th style="width: 7%">Packed</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(categorizedItems).map(([category, items]) => `
        <tr class="category-header">
          <td colspan="8">${category.toUpperCase()}</td>
        </tr>
        ${items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.tags.join(', ')}</td>
            <td>${item.assignedQuantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.assignedQuantity * item.price).toFixed(2)}</td>
            <td>${item.notes}</td>
            <td>_____________</td>
            <td><span class="checkbox"></span></td>
          </tr>
        `).join('')}
        <tr class="subtotal">
          <td colspan="4"><strong>Category Subtotal:</strong></td>
          <td><strong>$${items.reduce((sum, item) => sum + (item.assignedQuantity * item.price), 0).toFixed(2)}</strong></td>
          <td colspan="3"></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <div class="checklist">
      <h3>PACKING CHECKLIST</h3>
      <div><span class="checkbox"></span> All items counted and verified</div>
      <div><span class="checkbox"></span> Fragile items properly protected</div>
      <div><span class="checkbox"></span> High-value items secured</div>
      <div><span class="checkbox"></span> Inventory sheet attached</div>
      <div><span class="checkbox"></span> Change fund prepared ($200 recommended)</div>
      <div><span class="checkbox"></span> Card reader and POS system ready</div>
    </div>

    <div class="signature-block">
      <div>
        <strong>Packed By:</strong><br>
        <div class="signature"></div>
        Date: ___________
      </div>
      <div>
        <strong>Verified By:</strong><br>
        <div class="signature"></div>
        Date: ___________
      </div>
      <div>
        <strong>Received By:</strong><br>
        <div class="signature"></div>
        Date: ___________
      </div>
    </div>
  </div>
</body>
</html>`;
};

const categorizeItems = (items: PackingSheetData['items']) => {
  const categories: { [key: string]: PackingSheetData['items'] } = {
    'Apparel': [],
    'Music': [],
    'Accessories': [],
    'Premium Items': []
  };

  items.forEach(item => {
    if (item.tags.some(tag => ['clothing', 'apparel', 't-shirt', 'hoodie'].includes(tag.toLowerCase()))) {
      categories['Apparel'].push(item);
    } else if (item.tags.some(tag => ['cd', 'music', 'vinyl', 'digital'].includes(tag.toLowerCase()))) {
      categories['Music'].push(item);
    } else if (item.tags.some(tag => ['premium', 'limited', 'signed', 'special'].includes(tag.toLowerCase()))) {
      categories['Premium Items'].push(item);
    } else {
      categories['Accessories'].push(item);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
};

export const downloadPDF = (htmlContent: string, filename: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Auto-print after a short delay to allow content to load
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};
