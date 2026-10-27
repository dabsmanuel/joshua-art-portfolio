'use client';

import React, { useState, useEffect } from 'react';

interface InvoiceItem {
  id: string;
  description: string;
  frameSize: string;
  quantity: number;
  unitPrice: number;  
  amount: number;
  breakdown?: {
    framing: number;
    glass: number;
    mounting: number;
    shipping: number;
    insurance: number;
  };
  showBreakdown: boolean;
}

const JocArtsInvoice: React.FC = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('JA-2025-001');
  const [invoiceDate, setInvoiceDate] = useState('August 4, 2025');
  const [dueDate, setDueDate] = useState('September 3, 2025');
  
  const [vatSettings, setVatSettings] = useState({
    includeVat: true,
    vatRate: 20
  });
  
  const [fromInfo, setFromInfo] = useState({
    company: 'Joc Arts Studio',
    address1: '',
    city: '',
    email: '',
    phone: ''
  });

  const [billToInfo, setBillToInfo] = useState({
    name: '',
    address1: '',
    city: '',
    email: '',
    phone: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);

  const [totals, setTotals] = useState({
    subtotal: 0,
    vat: 0,
    total: 0
  });

  // Calculate totals whenever items or VAT settings change
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const vat = vatSettings.includeVat ? subtotal * (vatSettings.vatRate / 100) : 0;
    const total = subtotal + vat;
    
    setTotals({ subtotal, vat, total });
  }, [items, vatSettings]);

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number | boolean) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const updateItemBreakdown = (id: string, field: keyof NonNullable<InvoiceItem['breakdown']>, value: number) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id && item.breakdown) {
          const updatedBreakdown = { ...item.breakdown, [field]: value };
          const newUnitPrice = Object.values(updatedBreakdown).reduce((sum, val) => sum + val, 0);
          return {
            ...item,
            breakdown: updatedBreakdown,
            unitPrice: newUnitPrice,
            amount: item.quantity * newUnitPrice
          };
        }
        return item;
      })
    );
  };

  const toggleBreakdown = (id: string) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          if (!item.showBreakdown && !item.breakdown) {
            // Initialize breakdown if it doesn't exist
            const unitPrice = item.unitPrice;
            return {
              ...item,
              breakdown: {
                framing: Math.round(unitPrice * 0.55),
                glass: Math.round(unitPrice * 0.15),
                mounting: Math.round(unitPrice * 0.10),
                shipping: Math.round(unitPrice * 0.15),
                insurance: Math.round(unitPrice * 0.05)
              },
              showBreakdown: true
            };
          }
          return { ...item, showBreakdown: !item.showBreakdown };
        }
        return item;
      })
    );
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: 'Custom Framed Artwork',
      frameSize: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      showBreakdown: false
    };
    setItems([...items, newItem]);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadAsWord = () => {
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
        <head>
          <meta charset="utf-8">
          <title>Joc Arts Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 3px solid #2c3e50; padding-bottom: 20px; }
            .company-info h1 { color: #2c3e50; font-size: 2.5em; margin-bottom: 5px; }
            .tagline { color: #7f8c8d; font-style: italic; }
            .invoice-details h2 { color: #2c3e50; font-size: 2em; }
            .billing-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .billing-info { width: 48%; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th { background: #34495e; color: white; padding: 15px 10px; }
            .items-table td { padding: 12px 10px; border-bottom: 1px solid #ecf0f1; }
            .breakdown { font-size: 0.85em; color: #666; margin-top: 5px; }
            .totals { width: 300px; margin-left: auto; margin-top: 20px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .notes { margin-top: 40px; padding: 20px; background: #f8f9fa; border-left: 4px solid #3498db; border-radius: 5px; }
            .footer { margin-top: 40px; text-align: center; color: #7f8c8d; font-size: 0.9em; border-top: 1px solid #ecf0f1; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <h1>JOC ARTS</h1>
              <div class="tagline">Fine Art & Custom Framing</div>
            </div>
            <div class="invoice-details">
              <h2>INVOICE</h2>
            </div>
          </div>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 30px;">
            <div><strong>Invoice Number:</strong> ${invoiceNumber}</div>
            <div><strong>Invoice Date:</strong> ${invoiceDate}</div>
            <div><strong>Due Date:</strong> ${dueDate}</div>
          </div>
          
          <div class="billing-section">
            <div class="billing-info">
              <h3>From:</h3>
              <div>${fromInfo.company}</div>
              ${fromInfo.address1 ? `<div>${fromInfo.address1}</div>` : ''}
              ${fromInfo.city ? `<div>${fromInfo.city}</div>` : ''}
              ${fromInfo.email ? `<div>Email: ${fromInfo.email}</div>` : ''}
              ${fromInfo.phone ? `<div>Phone: ${fromInfo.phone}</div>` : ''}
            </div>
            <div class="billing-info">
              <h3>Bill To:</h3>
              ${billToInfo.name ? `<div>${billToInfo.name}</div>` : ''}
              ${billToInfo.address1 ? `<div>${billToInfo.address1}</div>` : ''}
              ${billToInfo.city ? `<div>${billToInfo.city}</div>` : ''}
              ${billToInfo.email ? `<div>${billToInfo.email}</div>` : ''}
              ${billToInfo.phone ? `<div>${billToInfo.phone}</div>` : ''}
            </div>
          </div>
          
          ${items.length > 0 ? `
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-center">Frame Size</th>
                <th class="text-center">Quantity</th>
                <th class="text-right">Unit Price (£)</th>
                <th class="text-right">Amount (£)</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>
                    ${item.description}
                    ${item.showBreakdown && item.breakdown ? `
                      <div class="breakdown">
                        Framing: £${item.breakdown.framing.toFixed(2)} | Glass: £${item.breakdown.glass.toFixed(2)} | 
                        Mounting: £${item.breakdown.mounting.toFixed(2)} | Shipping: £${item.breakdown.shipping.toFixed(2)} | 
                        Insurance: £${item.breakdown.insurance.toFixed(2)}
                      </div>
                    ` : ''}
                  </td>
                  <td class="text-center">${item.frameSize}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-right">£${item.unitPrice.toFixed(2)}</td>
                  <td class="text-right">£${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div>Subtotal: £${totals.subtotal.toFixed(2)}</div>
            ${vatSettings.includeVat ? `<div>VAT (${vatSettings.vatRate}%): £${totals.vat.toFixed(2)}</div>` : ''}
            <div><strong>Total Amount: £${totals.total.toFixed(2)}</strong></div>
          </div>
          ` : ''}
          
          <div class="notes">
            <h4>Important Notes:</h4>
            <p><strong>Pricing Includes:</strong> Professional framing, protective glass, mounting, shipping, and insurance coverage.</p>
            <p><strong>Payment Terms:</strong> Payment is due within 30 days of invoice date. We accept bank transfer, cheque, or card payments.</p>
            <p><strong>Note:</strong> Prices shown are estimates and will be confirmed before final order processing.</p>
          </div>

          <div class="footer">
            <p>Thank you for choosing Joc Arts for your custom framing needs!</p>
            <p>For questions about this invoice, please contact us at info@jocarts.com</p>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Joc_Arts_Invoice.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      {/* Controls */}
      <div className="text-center mb-5 print:hidden">
        <button 
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded mr-3 transition-colors"
        >
          Print Invoice
        </button>
        <button 
          onClick={downloadAsWord}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded mr-3 transition-colors"
        >
          Download as Word
        </button>
        <button 
          onClick={handlePrint}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded mr-3 transition-colors"
        >
          Download as PDF
        </button>
      </div>

      {/* Invoice Container */}
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-start mb-10 border-b-4 border-slate-700 pb-5">
          <div>
            <h1 className="text-5xl font-bold text-slate-700 mb-2">JOC ARTS</h1>
            <div className="text-gray-500 italic text-lg">Fine Art & Custom Framing</div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl text-slate-700 mb-3">INVOICE</h2>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="bg-gray-100 p-4 rounded mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-bold text-slate-700">Invoice Number:</span>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded min-w-32"
            />
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-bold text-slate-700">Invoice Date:</span>
            <input
              type="text"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded min-w-32"
            />
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-slate-700">Due Date:</span>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded min-w-32"
            />
          </div>
        </div>

        {/* VAT Settings */}
        <div className="bg-blue-50 p-4 rounded mb-8 print:hidden">
          <h3 className="text-slate-700 mb-3 text-lg font-bold">VAT Settings</h3>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={vatSettings.includeVat}
                onChange={(e) => setVatSettings({...vatSettings, includeVat: e.target.checked})}
                className="mr-2"
              />
              Include VAT
            </label>
            {vatSettings.includeVat && (
              <div className="flex items-center">
                <span className="mr-2">VAT Rate:</span>
                <input
                  type="number"
                  value={vatSettings.vatRate}
                  onChange={(e) => setVatSettings({...vatSettings, vatRate: parseFloat(e.target.value) || 0})}
                  className="bg-white border border-gray-400 px-2 py-1 rounded w-16 text-center"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="ml-1">%</span>
              </div>
            )}
          </div>
        </div>

        {/* Billing Section */}
        <div className="flex justify-between mb-10">
          <div className="w-5/12">
            <h3 className="text-slate-700 mb-4 text-xl border-b-2 border-blue-500 pb-1">From:</h3>
            <input
              type="text"
              value={fromInfo.company}
              onChange={(e) => setFromInfo({...fromInfo, company: e.target.value})}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded mb-1 w-full"
              placeholder="Company Name"
            />
            <input
              type="text"
              value={fromInfo.address1}
              onChange={(e) => setFromInfo({...fromInfo, address1: e.target.value})}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded mb-1 w-full"
              placeholder="Address Line 1"
            />
            <input
              type="text"
              value={fromInfo.city}
              onChange={(e) => setFromInfo({...fromInfo, city: e.target.value})}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded mb-1 w-full"
              placeholder="City, Country"
            />
            <input
              type="text"
              value={fromInfo.email}
              onChange={(e) => setFromInfo({...fromInfo, email: e.target.value})}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded mb-1 w-full"
              placeholder="Email Address"
            />
            <input
              type="text"
              value={fromInfo.phone}
              onChange={(e) => setFromInfo({...fromInfo, phone: e.target.value})}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded mb-1 w-full"
              placeholder="Phone Number"
            />
          </div>
          <div className="w-5/12">
            <h3 className="text-slate-700 mb-4 text-xl border-b-2 border-blue-500 pb-1">Bill To:</h3>
            <input
              type="text"
              value={billToInfo.name}
              onChange={(e) => setBillToInfo({...billToInfo, name: e.target.value})}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded mb-1 w-full"
              placeholder="Client Name"
            />
            <input
              type="text"
              value={billToInfo.address1}
              onChange={(e) => setBillToInfo({...billToInfo, address1: e.target.value})}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded mb-1 w-full"
              placeholder="Address"
            />
            <input
              type="text"
              value={billToInfo.city}
              onChange={(e) => setBillToInfo({...billToInfo, city: e.target.value})}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded mb-1 w-full"
              placeholder="City, Postal Code"
            />
            <input
              type="text"
              value={billToInfo.email}
              onChange={(e) => setBillToInfo({...billToInfo, email: e.target.value})}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded mb-1 w-full"
              placeholder="Email Address"
            />
            <input
              type="text"
              value={billToInfo.phone}
              onChange={(e) => setBillToInfo({...billToInfo, phone: e.target.value})}
              className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded mb-1 w-full"
              placeholder="Phone Number"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-700">Invoice Items</h3>
          <button 
            onClick={addItem}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors print:hidden"
          >
            + Add New Item
          </button>
        </div>
        
        {items.length > 0 ? (
          <>
            <table className="w-full border-collapse mb-8">
              <thead>
                <tr>
                  <th className="bg-slate-600 text-white p-4 text-left">Description</th>
                  <th className="bg-slate-600 text-white p-4 text-center">Frame Size</th>
                  <th className="bg-slate-600 text-white p-4 text-center">Quantity</th>
                  <th className="bg-slate-600 text-white p-4 text-right">Unit Price (£)</th>
                  <th className="bg-slate-600 text-white p-4 text-right">Amount (£)</th>
                  <th className="bg-slate-600 text-white p-4 text-center print:hidden">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <tr className={index % 2 === 1 ? 'bg-gray-50' : ''}>
                      <td className="p-3 border-b border-gray-200">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded w-full"
                          />
                          <button
                            onClick={() => toggleBreakdown(item.id)}
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors print:hidden"
                          >
                            {item.showBreakdown ? 'Hide Breakdown' : 'Show Pricing Breakdown'}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 border-b border-gray-200 text-center">
                        <input
                          type="text"
                          value={item.frameSize}
                          onChange={(e) => updateItem(item.id, 'frameSize', e.target.value)}
                          className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded w-full text-center"
                          placeholder="Frame Size"
                        />
                      </td>
                      <td className="p-3 border-b border-gray-200 text-center">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded w-16 text-center"
                          min="0"
                        />
                      </td>
                      <td className="p-3 border-b border-gray-200 text-right">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="bg-gray-50 border border-dashed border-gray-400 px-2 py-1 rounded w-20 text-right"
                          min="0"
                          step="0.01"
                          disabled={Boolean(item.showBreakdown && item.breakdown)}
                        />
                      </td>
                      <td className="p-3 border-b border-gray-200 text-right font-bold text-slate-700">
                        £{item.amount.toFixed(2)}
                      </td>
                      <td className="p-3 border-b border-gray-200 text-center print:hidden">
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {item.showBreakdown && item.breakdown && (
                      <tr className={index % 2 === 1 ? 'bg-gray-50' : ''}>
                        <td colSpan={6} className="p-3 border-b border-gray-200">
                          <div className="bg-blue-50 p-3 rounded">
                            <h4 className="text-sm font-bold text-slate-700 mb-2">Pricing Breakdown:</h4>
                            <div className="grid grid-cols-5 gap-2 text-xs">
                              <div>
                                <label className="block text-gray-600 mb-1">Framing</label>
                                <input
                                  type="number"
                                  value={item.breakdown.framing}
                                  onChange={(e) => updateItemBreakdown(item.id, 'framing', parseFloat(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                                  step="0.01"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1">Glass</label>
                                <input
                                  type="number"
                                  value={item.breakdown.glass}
                                  onChange={(e) => updateItemBreakdown(item.id, 'glass', parseFloat(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                                  step="0.01"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1">Mounting</label>
                                <input
                                  type="number"
                                  value={item.breakdown.mounting}
                                  onChange={(e) => updateItemBreakdown(item.id, 'mounting', parseFloat(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                                  step="0.01"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1">Shipping</label>
                                <input
                                  type="number"
                                  value={item.breakdown.shipping}
                                  onChange={(e) => updateItemBreakdown(item.id, 'shipping', parseFloat(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                                  step="0.01"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1">Insurance</label>
                                <input
                                  type="number"
                                  value={item.breakdown.insurance}
                                  onChange={(e) => updateItemBreakdown(item.id, 'insurance', parseFloat(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                                  step="0.01"
                                />
                              </div>
                            </div>
                            <div className="mt-2 text-right text-sm font-semibold text-slate-700">
                              Total: £{(item.breakdown.framing + item.breakdown.glass + item.breakdown.mounting + item.breakdown.shipping + item.breakdown.insurance).toFixed(2)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="w-80 ml-auto mt-5">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>Subtotal:</span>
                <span>£{totals.subtotal.toFixed(2)}</span>
              </div>
              {vatSettings.includeVat && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span>VAT ({vatSettings.vatRate}%):</span>
                  <span>£{totals.vat.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-slate-700 mt-3 font-bold text-lg text-slate-700">
                <span>Total Amount:</span>
                <span>£{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-4">No items added yet</p>
            <p>Click &quot;Add New Item&quot; to get started</p>
          </div>
        )}

        {/* Notes */}
        <div className="mt-10 p-5 bg-gray-50 border-l-4 border-blue-500 rounded">
          <h4 className="text-slate-700 mb-3 font-bold">Important Notes:</h4>
          <p><strong>Pricing Includes:</strong> Professional framing, protective glass, mounting, shipping, and insurance coverage.</p>
          <br />
          <p><strong>Payment Terms:</strong> Payment is due within 30 days of invoice date. We accept bank transfer, cheque, or card payments.</p>
          <br />
          <p><strong>Note:</strong> Prices shown are estimates and will be confirmed before final order processing.</p>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 text-sm border-t border-gray-200 pt-5">
          <p>Thank you for choosing Joc Arts for your custom framing needs!</p>
          <p>For questions about this invoice, please contact us at info@jocarts.com</p>
        </div>
      </div>
    </div>
  );
};

export default JocArtsInvoice;