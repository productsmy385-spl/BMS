'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Download, Upload, FileText, Database, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

export default function TenantDataManagementPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [exportType, setExportType] = useState<'orders' | 'inventory' | 'products' | 'sales'>('orders');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  // Import state
  const [importJson, setImportJson] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; errors: any[] } | null>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      if (exportFormat === 'csv') {
        window.open(`/api/v1/tenants/${slug}/data?type=${exportType}&format=csv`, '_blank');
      } else {
        const res = await fetch(`/api/v1/tenants/${slug}/data?type=${exportType}&format=json`);
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug}_${exportType}.json`;
        a.click();
      }
    } catch {
      alert('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) return;

    try {
      setIsImporting(true);
      setImportResult(null);
      const parsed = JSON.parse(importJson);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      const res = await fetch(`/api/v1/tenants/${slug}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.success) {
        setImportResult(data.data);
        setImportJson('');
      } else {
        alert(data.error || 'Import failed');
      }
    } catch (err) {
      alert('Invalid JSON format: ' + (err as Error).message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navigation currentSlug={slug} />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Data Governance
                </span>
                <span className="text-xs text-slate-400">FlowDineOS</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">Data Import, Export & Backup</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Download className="w-5 h-5 text-blue-600" />
              <h2>Export Bakery Data</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export tenant-isolated operational records. Cross-tenant leakage is strictly prevented by server-side query scoping.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700">Select Dataset</label>
                <select
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="orders">Orders & Order Items</option>
                  <option value="inventory">Inventory & Stock Counts</option>
                  <option value="products">Product Catalog</option>
                  <option value="sales">Sales & Payment Ledger</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Export File Format</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setExportFormat('csv')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      exportFormat === 'csv'
                        ? 'bg-blue-50 border-blue-400 text-blue-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    CSV (Excel Compatible)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportFormat('json')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      exportFormat === 'json'
                        ? 'bg-blue-50 border-blue-400 text-blue-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    JSON (Structured Payload)
                  </button>
                </div>
              </div>

              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50 mt-4"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Generating Export...' : `Download ${exportType.toUpperCase()} (${exportFormat.toUpperCase()})`}</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Upload className="w-5 h-5 text-emerald-600" />
              <h2>Bulk Import Catalog</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Import products into this organization's menu. Imported rows are automatically bound to this tenant's ID on the server.
            </p>

            <form onSubmit={handleImport} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700">JSON Payload</label>
                <textarea
                  rows={5}
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder={`[\n  {\n    "name": "Matcha Choux Bun",\n    "basePrice": 140,\n    "taxRate": 5,\n    "isVeg": true\n  }\n]`}
                  className="w-full mt-1 p-3 text-xs font-mono border border-slate-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={isImporting || !importJson.trim()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{isImporting ? 'Validating & Importing...' : 'Import Catalog Items'}</span>
              </button>

              {importResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Successfully imported {importResult.imported} items!</span>
                  </div>
                  {importResult.errors.length > 0 && (
                    <div className="text-red-700 font-medium">
                      Failed rows: {importResult.errors.length}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
