import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Info, Shield, Truck, Ship, Package, Globe, CheckCircle2, RefreshCcw, BarChart3, Binary, Download, LayoutGrid, ShieldCheck, Umbrella, Lock } from 'lucide-react';
import { INCOTERMS } from '../data/incoterms';

import LegalCompliance from './LegalCompliance';

interface ResultDisplayProps {
  code: string;
  onReset: () => void;
}

const STAGES = [
  { label: 'Origin Factory', icon: Package },
  { label: 'Inland Freight', icon: Truck },
  { label: 'Export Customs', icon: Globe },
  { label: 'Alongside Vessel', icon: Ship },
  { label: 'Main Carriage', icon: Ship },
  { label: 'Import Customs', icon: Binary },
  { label: 'Destination', icon: CheckCircle2 },
];

const getTransferIndices = (code: string) => {
  const mapping: Record<string, { risk: number; cost: number }> = {
    'EXW': { risk: 0, cost: 0 },
    'FCA': { risk: 1, cost: 1 },
    'FAS': { risk: 3, cost: 3 },
    'FOB': { risk: 3, cost: 3 },
    'CFR': { risk: 3, cost: 5 },
    'CIF': { risk: 3, cost: 5 },
    'CPT': { risk: 1, cost: 6 },
    'CIP': { risk: 1, cost: 6 },
    'DAP': { risk: 6, cost: 6 },
    'DPU': { risk: 6, cost: 6 },
    'DDP': { risk: 6, cost: 6 }
  };
  return mapping[code] || { risk: 0, cost: 0 };
};

type TabType = 'incoterms' | 'sustainability' | 'compliance' | 'all';
type ViewMode = 'hub' | 'detail';

export default function ResultDisplay({ code, onReset }: ResultDisplayProps) {
  const [activeTab, setActiveTab] = useState<TabType>('incoterms');
  const [viewMode, setViewMode] = useState<ViewMode>('hub');
  const [isPrintingReport, setIsPrintingReport] = useState(false);
  const info = INCOTERMS[code];

  if (!info) return null;

  const handleExportPDF = () => {
    setIsPrintingReport(false); // Global export
    setTimeout(() => {
      window.focus();
      window.print();
    }, 100);
  };

  const handleIncotermsReportPDF = () => {
    setIsPrintingReport(true); // Report-only export
    setTimeout(() => {
      window.focus();
      window.print();
      // We don't necessarily need to reset it immediately because window.print blocks, 
      // but a reset in the next tick or after-print event is safer.
      setTimeout(() => setIsPrintingReport(false), 500);
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto space-y-8"
      id="result-container"
    >
      {/* Header Card */}
      <div className={`bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 ${isPrintingReport ? 'print:hidden' : ''}`} id="result-header">
        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Globe size={180} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-widest mb-3">
                <Shield size={16} />
                Strategic Recommendation
              </div>
              <h1 className="text-7xl font-black tracking-tighter" id="incoterm-code">{info.code}</h1>
              <p className="text-2xl text-slate-300 mt-2 font-semibold">{info.name}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-lg hover:shadow-blue-500/50 text-sm font-black uppercase tracking-widest group"
              >
                <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                Export PDF Report
              </button>
              <button
                onClick={onReset}
                className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-sm font-bold backdrop-blur-md border border-white/10"
                id="start-over-btn"
              >
                <RefreshCcw size={18} />
                New Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Selection View (Hub) */}
        {viewMode === 'hub' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 space-y-12"
          >
            {/* Quick Responsibility Summary */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Responsibility Summary</h2>
                  <p className="text-slate-900 font-black text-xl">Logistical Hierarchy for {info.code}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Seller</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Buyer</span>
                  </div>
                </div>
              </div>

              {/* Linear Responsibility Timeline */}
              <div className="py-16 px-6">
                <div className="relative pt-8">
                  {/* Legend/Zone Indicators */}
                  <div className="absolute -top-6 left-0 w-full flex justify-between px-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">
                        Seller Managed
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-black uppercase tracking-widest text-orange-600 text-right">
                        Buyer Managed
                      </span>
                      <div className="w-2 h-2 rounded-full bg-orange-600" />
                    </div>
                  </div>

                  {/* The Base Line (Buyer background) */}
                  <div className="absolute top-1/2 left-0 w-full h-1.5 bg-orange-100 -translate-y-1/2 rounded-full" />
                  
                  {/* Seller Activity Line (Based on Cost) */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(getTransferIndices(code).cost / (STAGES.length - 1)) * 100}%` }}
                    className="absolute top-1/2 left-0 h-1.5 bg-blue-600 -translate-y-1/2 rounded-full z-10 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                  />

                  <div className="flex justify-between relative z-20">
                    {STAGES.map((stage, idx) => {
                      const { risk, cost } = getTransferIndices(code);
                      const isRiskPoint = risk === idx;
                      const isCostPoint = cost === idx;
                      const isSellerZone = idx <= cost;
                      
                      return (
                        <div key={idx} className="flex flex-col items-center group">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 rotate-45 shadow-sm group-hover:rotate-0 group-hover:scale-110 ${
                            isSellerZone 
                              ? 'bg-blue-600 text-white shadow-blue-200' 
                              : 'bg-white border-2 border-orange-500 text-orange-600'
                          }`}>
                            <div className="-rotate-45 group-hover:rotate-0 transition-transform">
                              <stage.icon size={16} />
                            </div>
                          </div>
                          
                          <div className="mt-6 flex flex-col items-center text-center">
                            <span className={`text-[8px] font-black uppercase tracking-tighter max-w-[60px] leading-tight mb-2 transition-colors ${
                              isSellerZone ? 'text-blue-600' : 'text-orange-600'
                            }`}>
                              {stage.label}
                            </span>
                            
                            <div className="flex flex-col gap-1.5 min-h-[40px]">
                              {isRiskPoint && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-slate-900 text-white text-[7px] font-black px-2 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap shadow-xl flex items-center gap-1 border border-white/20"
                                >
                                  <Shield size={8} /> Risk Transfer
                                </motion.div>
                              )}
                              {isCostPoint && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-red-600 text-white text-[7px] font-black px-2 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap shadow-xl flex items-center gap-1 border border-white/20"
                                >
                                  <RefreshCcw size={8} /> Cost Transfer
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* Combined Roadmap & Duties */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard 
                  icon={<Package size={20} />} 
                  label="Packaging & Handling" 
                  responsible="Seller" 
                  details="Goods must be marked and packed for export."
                />
                <SummaryCard 
                  icon={<Truck size={20} />} 
                  label="Export Clearance" 
                  responsible={info.responsibilities.export} 
                  details="Customs duties and export licenses."
                />
                <SummaryCard 
                  icon={<Ship size={20} />} 
                  label="Freight & Transport" 
                  responsible={info.responsibilities.mainTransport} 
                  details="Primary international carriage costs."
                />
                <SummaryCard 
                  icon={<Globe size={20} />} 
                  label="Import & Delivery" 
                  responsible={info.responsibilities.import} 
                  details="Local duties and terminal handling."
                />
              </div>

              <div className="pt-6 border-t border-slate-200 flex flex-wrap gap-10">
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Insurance</span>
                    <span className={`text-xs font-bold ${info.responsibilities.insurance === 'Seller' ? 'text-blue-600' : 'text-orange-600'}`}>
                      {info.responsibilities.insurance} Responsible
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 size={18} className="text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Risk Profile</span>
                    <span className="text-xs font-bold text-slate-600">
                      Balanced Risk allocation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Explore Analytics Context</h2>
              <p className="text-slate-600 font-medium text-sm">Select a module for deep technical breakdown</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'all', label: 'All Analytics', icon: LayoutGrid, color: 'text-slate-600', desc: 'Complete end-to-end perspective' },
                { id: 'incoterms', label: 'Incoterms Analysis', icon: Shield, color: 'text-blue-600', desc: 'Transfer points & standard duties' },
                { id: 'sustainability', label: 'Sustainability Analysis', icon: Leaf, color: 'text-emerald-600', desc: 'Scope 3 GHG protocol allocation' },
                { id: 'compliance', label: 'Documentary Compliance', icon: Binary, color: 'text-indigo-600', desc: 'ICC standards & UCP 600 mapping' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as TabType);
                    setViewMode('detail');
                  }}
                  className="flex flex-col items-center justify-center text-center gap-6 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:border-slate-900 hover:shadow-2xl hover:scale-[1.03] group"
                >
                  <div className={`p-5 rounded-[2rem] bg-white shadow-sm transition-all group-hover:bg-slate-900 group-hover:text-white ${tab.color}`}>
                    <tab.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">{tab.label}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">{tab.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            {/* Analysis Detail View */}
            {/* Context Header with Navigation */}
            <div className={`bg-slate-50 border-b border-slate-200 px-10 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-30 backdrop-blur-sm bg-slate-50/90 print:hidden ${isPrintingReport ? 'print:hidden' : ''}`}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setViewMode('hub')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all"
                >
                  <RefreshCcw size={12} className="rotate-180" />
                  Back to Hub
                </button>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Current View:</span>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900 px-3 py-1 bg-slate-900 text-white rounded-lg">
                    {activeTab === 'all' ? 'All Analytics' : activeTab === 'incoterms' ? 'Incoterms Analysis' : activeTab === 'sustainability' ? 'Sustainability Analysis' : 'Documentary Compliance'}
                  </span>
                </div>
              </div>

              {/* Quick Tab Switcher for convenience */}
              <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl">
                 {['incoterms', 'sustainability', 'compliance', 'all'].map((t) => (
                   <button
                    key={t}
                    onClick={() => setActiveTab(t as TabType)}
                    className={`p-2 rounded-lg transition-all ${activeTab === t ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    title={t.toUpperCase()}
                   >
                     {t === 'incoterms' && <Shield size={16} />}
                     {t === 'sustainability' && <Leaf size={16} />}
                     {t === 'compliance' && <Binary size={16} />}
                     {t === 'all' && <LayoutGrid size={16} />}
                   </button>
                 ))}
              </div>
            </div>

            <div className="p-10">
              {/* Content Area */}
              <div className="max-w-4xl mx-auto">
                <div className="space-y-12">
                  <div className={(activeTab === 'all' || activeTab === 'incoterms' || isPrintingReport) ? 'block' : 'hidden print:block'}>
                    {/* Report Header for PDF */}
                    <div className="hidden print:block mb-10 pb-6 border-b-4 border-slate-900">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Incoterms® 2020 Technical Report</h2>
                          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1 text-slate-400">Institutional Logistics Analysis Portfolio</p>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-black text-slate-900">{info.code}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Standard Code</div>
                        </div>
                      </div>
                    </div>

                    {/* Strategic Risk Transfer Bar */}
                    <section className="space-y-8">
                      <div className="flex justify-between items-center px-4">
                        <h3 className="flex items-center gap-3 text-slate-900 font-black text-2xl">
                          <Shield className="text-blue-600" size={28} />
                          Transfer Point Analysis
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol 2020</span>
                      </div>

                      <div className="grid grid-cols-1 gap-8">
                        {/* Risk Card */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-md">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                 <Shield size={16} className="text-slate-900" />
                                 <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Legal Risk Boundary</h4>
                               </div>
                               <p className="text-[11px] text-slate-500 font-medium italic tracking-wide">
                                 Incoterms® 2020 Article A2/B2 (Delivery & Transfer of Risks)
                               </p>
                            </div>
                            <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Risk Transfer</div>
                          </div>
                          
                          <div className="relative pt-12 pb-6 px-4">
                            <div className="relative">
                              <div className="absolute -top-12 left-0 flex flex-col items-start">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Seller Origin</span>
                              </div>
                              <div className="absolute -top-12 right-0 flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Buyer Destination</span>
                              </div>

                              <div className="relative mt-4">
                                <div className="relative h-6 w-full bg-slate-100 rounded-full overflow-hidden flex border-4 border-white shadow-inner">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${info.transferPosition}%` }}
                                    transition={{ type: "spring", stiffness: 50, delay: 0.5 }}
                                    className="h-full bg-blue-600 shadow-[inset_-5px_0_10px_rgba(0,0,0,0.1)]"
                                  />
                                  <div className="flex-1 h-full bg-orange-500 shadow-[inset_5px_0_10px_rgba(0,0,0,0.1)]" />
                                </div>

                                <motion.div 
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1, left: `${info.transferPosition}%` }}
                                  transition={{ delay: 1, type: "spring" }}
                                  className="absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 bg-white border-4 border-slate-900 rounded-full shadow-2xl z-20 flex items-center justify-center"
                                >
                                  <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
                                  <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-slate-900/50 -z-10" />
                                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase whitespace-nowrap shadow-2xl border border-white/20 text-center">
                                    <div className="opacity-60 text-[8px] mb-0.5">Article A2 Boundary</div>
                                    Risk Transfer Point
                                    <div className="text-[14px] leading-tight normal-case font-black mt-0.5">{info.transferPoint}</div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                                  </div>
                                </motion.div>
                              </div>
                            </div>                            <div className="flex justify-between mt-12 p-5 bg-slate-50/50 rounded-[1.5rem] border border-slate-100/50">
                              <div className="flex items-center gap-4">
                                <div className="w-4 h-4 bg-blue-600 rounded-full shadow-md" />
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Seller Exposure</span>
                                  <span className="text-xl font-black text-blue-600">{info.transferPosition}%</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-right">
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Buyer Exposure</span>
                                  <span className="text-xl font-black text-orange-600">{100 - info.transferPosition}%</span>
                                </div>
                                <div className="w-4 h-4 bg-orange-500 rounded-full shadow-md" />
                              </div>
                            </div>

                            {/* Integrated Operations into Risk Card */}
                            <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Delivery Place & Time */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-400">
                                  <Truck size={14} />
                                  <span className="text-[9px] font-black uppercase tracking-widest">Delivery Point</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-900 leading-tight">
                                  {info.detailedAnalysis.delivery.point}
                                </p>
                                <p className="text-[8px] text-slate-500 font-medium leading-relaxed italic">
                                  Legal transfer point (Art. A2).
                                </p>
                              </div>

                              {/* Notices */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-400">
                                  <Info size={14} />
                                  <span className="text-[9px] font-black uppercase tracking-widest">Notice (Art. A10/B10)</span>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] text-slate-700 font-medium leading-tight">
                                    <span className="font-bold text-blue-600 mr-1">S:</span> {info.detailedAnalysis.delivery.notices}
                                  </p>
                                  <p className="text-[10px] text-slate-700 font-medium leading-tight">
                                    <span className="font-bold text-orange-600 mr-1">B:</span> {['EXW', 'FCA', 'FAS', 'FOB'].includes(code) ? "Carrier/vessel identity & time." : "Place/time sync."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cost Card */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-md">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                             <div>
                               <div className="flex items-center gap-2 mb-1">
                                 <BarChart3 size={16} className="text-slate-900" />
                                 <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Financial Cost Boundary</h4>
                               </div>
                               <p className="text-[11px] text-slate-500 font-medium italic tracking-wide">
                                  Incoterms® 2020 Article A9/B9 (Allocation of Costs)
                               </p>
                            </div>
                            <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Cost Transfer</div>
                          </div>

                          <div className="space-y-12">
                            <div className="relative pt-12 pb-6 px-4">
                              <div className="relative">
                                <div className="absolute -top-12 left-0 flex flex-col items-start">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Seller Costs</span>
                                </div>
                                <div className="absolute -top-12 right-0 flex flex-col items-end">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Buyer Costs</span>
                                </div>

                                <div className="relative mt-4">
                                  <div className="relative h-6 w-full bg-slate-100 rounded-full overflow-hidden flex border-4 border-white shadow-inner">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${info.detailedAnalysis.costAllocation.sellerPercentage}%` }}
                                      transition={{ type: "spring", stiffness: 50, delay: 0.7 }}
                                      className="h-full bg-blue-600 shadow-[inset_-5px_0_10px_rgba(0,0,0,0.1)]"
                                    />
                                    <div className="flex-1 h-full bg-orange-500 shadow-[inset_5px_0_10px_rgba(0,0,0,0.1)]" />
                                  </div>

                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1, left: `${info.detailedAnalysis.costAllocation.sellerPercentage}%` }}
                                    transition={{ delay: 1.2, type: "spring" }}
                                    className="absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 bg-white border-4 border-slate-900 rounded-full shadow-2xl z-20 flex items-center justify-center"
                                  >
                                    <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
                                    <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-slate-900/50 -z-10" />
                                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase whitespace-nowrap shadow-2xl border border-white/20 text-center">
                                      <div className="opacity-60 text-[8px] mb-0.5">Article A9 Division</div>
                                      Cost Transfer Point
                                      <div className="text-[14px] leading-tight normal-case font-black mt-0.5">{info.detailedAnalysis.costTransferPoint}</div>
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                                    </div>
                                  </motion.div>
                                </div>
                              </div>
                            </div>

                            {/* Cost Allocation Deep Dive */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Seller's Obligations Box */}
                              <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-6 bg-blue-600 rounded-full" />
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Seller's Financial Cost List</h5>
                                  </div>
                                  <span className="text-lg font-black text-blue-600">{info.detailedAnalysis.costAllocation.sellerPercentage}%</span>
                                </div>
                                
                                <div className="space-y-2 flex-1">
                                  {[
                                    { label: 'Packaging & Inspection Costs', sellerPays: true },
                                    { label: 'Loading Charges at Origin', sellerPays: code !== 'EXW' },
                                    { label: 'Inland Freight / Pre-carriage', sellerPays: !['EXW', 'FCA'].includes(code) },
                                    { label: 'Origin Terminal Handling Charges (OTHC)', sellerPays: !['EXW', 'FCA', 'FAS'].includes(code) },
                                    { label: 'Main Carriage / International Freight', sellerPays: ['CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'].includes(code) },
                                    { label: 'Destination Terminal Handling Charges (DTHC)', sellerPays: ['DAP', 'DPU', 'DDP'].includes(code) },
                                    { label: 'Unloading Charges at Destination', sellerPays: code === 'DPU' },
                                  ].filter(item => item.sellerPays).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100/50 shadow-sm">
                                      <CheckCircle2 size={12} className="text-blue-500" />
                                      <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                                    </div>
                                  ))}
                                  {/* If no items, show a minimal placeholder or handle it */}
                                </div>
                                <div className="mt-4 pt-4 border-t border-blue-100">
                                  <p className="text-[8px] text-slate-400 font-medium uppercase tracking-tighter">Obligations under Incoterms® 2020 Article A9</p>
                                </div>
                              </div>

                              {/* Buyer's Obligations Box */}
                              <div className="bg-orange-50/50 rounded-3xl p-6 border border-orange-100 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-6 bg-orange-500 rounded-full" />
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Buyer's Financial Cost List</h5>
                                  </div>
                                  <span className="text-lg font-black text-orange-600">{info.detailedAnalysis.costAllocation.buyerPercentage}%</span>
                                </div>
                                
                                <div className="space-y-2 flex-1">
                                  {[
                                    { label: 'Packaging & Inspection Costs', buyerPays: false },
                                    { label: 'Loading Charges at Origin', buyerPays: code === 'EXW' },
                                    { label: 'Inland Freight / Pre-carriage', buyerPays: ['EXW', 'FCA'].includes(code) },
                                    { label: 'Origin Terminal Handling Charges (OTHC)', buyerPays: ['EXW', 'FCA', 'FAS'].includes(code) },
                                    { label: 'Main Carriage / International Freight', buyerPays: ['EXW', 'FCA', 'FAS', 'FOB'].includes(code) },
                                    { label: 'Destination Terminal Handling Charges (DTHC)', buyerPays: !['DAP', 'DPU', 'DDP'].includes(code) },
                                    { label: 'Unloading Charges at Destination', buyerPays: code !== 'DPU' },
                                  ].filter(item => item.buyerPays).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-orange-100/50 shadow-sm">
                                      <CheckCircle2 size={12} className="text-orange-500" />
                                      <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-orange-100">
                                  <p className="text-[8px] text-slate-400 font-medium uppercase tracking-tighter">Obligations under Incoterms® 2020 Article B9</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Insurance Card */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
                          {['CIF', 'CIP'].includes(info.code) && (
                            <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                          )}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                 <ShieldCheck size={16} className="text-slate-900" />
                                 <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Insurance Capability</h4>
                               </div>
                               <p className="text-[11px] text-slate-500 font-medium italic tracking-wide">
                                 Incoterms® 2020 Article A5/B5 (Insurance)
                               </p>
                            </div>
                            <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border transition-all ${
                              ['CIF', 'CIP'].includes(info.code) 
                                ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700' 
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                              {['CIF', 'CIP'].includes(info.code) 
                                ? <ShieldCheck size={14} className="animate-pulse" /> 
                                : <Info size={14} />
                              }
                              {['CIF', 'CIP'].includes(info.code) ? 'Mandatory Requirement' : 'Optional / Party Agreement'}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                             <div className="space-y-6 flex flex-col justify-center">
                                <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:border-slate-300">
                                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                                      info.detailedAnalysis.insurance.responsible === 'Seller' ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-orange-500 text-white shadow-orange-200'
                                   }`}>
                                      <Umbrella size={28} />
                                   </div>
                                   <div>
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insurance Responsible</span>
                                        <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider ${
                                          ['CIF', 'CIP'].includes(info.code) 
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                            : 'bg-slate-200 text-slate-600 border border-slate-300'
                                        }`}>
                                          {['CIF', 'CIP'].includes(info.code) ? 'Mandatory' : 'Optional'}
                                        </div>
                                      </div>
                                      <h5 className="text-xl font-black text-slate-900">{info.detailedAnalysis.insurance.responsible}</h5>
                                   </div>
                                </div>

                                <div className="p-6 bg-slate-900 text-white rounded-[2rem] border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
                                   <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                      <Lock size={40} />
                                   </div>
                                   <div className="flex items-center gap-2 relative z-10">
                                      <div className={`p-1 rounded-md ${info.code === 'CIP' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                                        <Lock size={10} className="text-white" />
                                      </div>
                                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Global Minimum Coverage Standard</span>
                                   </div>
                                   <div className="relative z-10 space-y-1">
                                      <p className="text-lg font-black leading-tight">
                                        {info.detailedAnalysis.insurance.minimumCoverage}
                                      </p>
                                      {info.code === 'CIF' && (
                                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-tight">Requirement: Institute Cargo Clauses (C)</p>
                                      )}
                                      {info.code === 'CIP' && (
                                        <p className="text-[10px] text-amber-400 font-bold uppercase tracking-tight">Requirement: Institute Cargo Clauses (A) - "All Risks"</p>
                                      )}
                                      {!['CIF', 'CIP'].includes(info.code) && (
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Recommended: Institute Cargo Clauses (A)</p>
                                      )}
                                   </div>
                                   <div className="pt-2 border-t border-white/10 mt-2">
                                      <p className="text-[9px] text-white/50 font-medium tracking-wide">Incoterms® 2020 Article A5/B5 standard for {info.code === 'CIP' ? 'high-value multimodal' : 'standard sea freight'} coverage.</p>
                                   </div>
                                </div>
                             </div>

                             <div className="relative bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 flex items-center justify-center p-8 text-center min-h-[16rem] group">
                                <div className="absolute inset-0 opacity-[0.03] transition-transform duration-700 group-hover:scale-110 pointer-events-none">
                                   <Umbrella size={220} className="absolute -right-16 -bottom-16 rotate-12" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                   <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors duration-500 ${
                                      ['CIF', 'CIP'].includes(info.code) ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                   }`}>
                                      {['CIF', 'CIP'].includes(info.code) ? <CheckCircle2 size={24} /> : <Info size={24} />}
                                   </div>
                                   <div className="space-y-2">
                                      <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rule of Law</h6>
                                      <p className="text-[13px] text-slate-700 font-bold leading-relaxed max-w-[240px] mx-auto">
                                         {['CIF', 'CIP'].includes(info.code) 
                                           ? "The Seller is legally bound to provide insurance. Failure to do so is a breach of contract under Incoterms rules." 
                                           : "Insurance is not mandatory by ICC standard, but strictly recommended to mitigate cross-border transit risks."}
                                      </p>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>

                        {/* Logistical & Legal Framework */}
                        <div className="pt-12 border-t border-slate-100 space-y-8 mt-12">
                          <div className="text-center md:text-left">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Operational Duties</h4>
                            <p className="text-slate-900 font-black text-xl">Logistical Control & Legal Formalities</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {/* Customs & Formalities */}
                             <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-5">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-slate-900" />
                                    <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-900">Customs Formalities (A7/B7)</h5>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  {/* Export Customs Clearance */}
                                  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-slate-900">Export Clearance</span>
                                      <span className="text-[7px] text-slate-400 font-black uppercase tracking-tighter">Licenses & Origin Duties</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                      code === 'EXW' ? 'bg-orange-100 text-orange-600' : 'bg-blue-600 text-white'
                                    }`}>
                                      {code === 'EXW' ? 'Buyer' : 'Seller'}
                                    </div>
                                  </div>

                                  {/* Transit Customs Clearance */}
                                  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-slate-900">Transit Clearance</span>
                                      <span className="text-[7px] text-slate-400 font-black uppercase tracking-tighter">Through Third Countries</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                      ['DAP', 'DPU', 'DDP', 'CPT', 'CIP', 'CFR', 'CIF'].includes(code) ? 'bg-blue-600 text-white' : 'bg-orange-100 text-orange-600'
                                    }`}>
                                      {['DAP', 'DPU', 'DDP', 'CPT', 'CIP', 'CFR', 'CIF'].includes(code) ? 'Seller' : 'Buyer'}
                                    </div>
                                  </div>

                                  {/* Import Customs Clearance */}
                                  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-slate-900">Import Clearance</span>
                                      <span className="text-[7px] text-slate-400 font-black uppercase tracking-tighter">Duties & Destination Taxes</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                      code === 'DDP' ? 'bg-blue-600 text-white' : 'bg-orange-100 text-orange-600'
                                    }`}>
                                      {code === 'DDP' ? 'Seller' : 'Buyer'}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-[8px] text-slate-400 font-medium italic leading-relaxed px-1">
                                  Includes export licenses, valuations, transit security, and final import duties/taxes as per ICC standards.
                                </p>
                             </div>

                             {/* Main Transport */}
                             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <div className="flex justify-between items-center">
                                  <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-900">Freight Control (A4/B4)</h5>
                                  <Truck size={14} className="text-slate-400" />
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100">
                                   <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Main Transport Contracting</div>
                                   <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${info.detailedAnalysis.transport.contracting === 'Seller' ? 'bg-blue-600' : 'bg-orange-500'}`} />
                                      <span className="text-sm font-black text-slate-900">{info.detailedAnalysis.transport.contracting} Responsible</span>
                                   </div>
                                </div>
                                <p className="text-[9px] text-slate-500 font-medium leading-tight">Party responsible for booking and paying the primary international carrier.</p>
                             </div>

                             {/* Pre-shipment Inspection (PSI) */}
                             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <div className="flex justify-between items-center">
                                  <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-900">Pre-shipment Inspection (PSI)</h5>
                                  <Binary size={14} className="text-slate-400" />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-700">Origin Inspection</span>
                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${code === 'EXW' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                      {code === 'EXW' ? 'Buyer Pays' : 'Seller Pays'}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-700">Import Inspection</span>
                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${code === 'DDP' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                      {code === 'DDP' ? 'Seller Pays' : 'Buyer Pays'}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[9px] text-slate-500 font-medium leading-tight">Cost allocation for mandatory pre-shipment inspections (Art. A9).</p>
                             </div>
                          </div>
                        </div>
                    </section>

                    {/* Strategic Insights & Advice */}
                    <section className="space-y-8 mt-12 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex justify-between items-center">
                          <h3 className="flex items-center gap-3 text-slate-900 font-black text-xl">
                            <Binary className="text-indigo-600" size={24} />
                            Strategic Insights
                          </h3>
                        </div>

                        <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
                          <h4 className="flex items-center gap-2 text-slate-900 font-bold text-lg mb-3">
                            <Info className="text-blue-600" size={20} />
                            Expert Advice
                          </h4>
                          <p className="text-slate-800 text-base leading-relaxed font-medium italic">
                            "{info.advice}"
                          </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          {info.insights.map((insight, i) => (
                            <div 
                              key={i} 
                              className={`p-6 rounded-[2rem] border transition-all hover:scale-[1.02] ${
                                insight.type === 'tip' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
                                insight.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-900' :
                                insight.type === 'danger' ? 'bg-red-50 border-red-100 text-red-900' :
                                'bg-blue-50 border-blue-100 text-blue-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                 <span className="font-black text-[9px] uppercase tracking-[0.2em] opacity-60">
                                   {insight.type === 'info' ? 'Responsibility' : insight.type}
                                 </span>
                              </div>
                              <p className="text-xs font-bold leading-relaxed">{insight.text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Export Strategic Report CTA */}
                        <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Finalize Documentation</p>
                           <button
                             onClick={handleIncotermsReportPDF}
                             className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] transition-all shadow-2xl hover:shadow-slate-900/40 hover:scale-[1.02] active:scale-95 text-sm font-black uppercase tracking-widest group print:hidden"
                           >
                             <Download size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                             Incoterms PDF Report
                           </button>
                           <p className="text-[9px] text-slate-400 font-medium">Includes Transfer Points, Sustainability Analysis, and Documentary Compliance</p>
                        </div>
                    </section>
                  </div>

                  <div className={`${(activeTab === 'all' || activeTab === 'sustainability') ? 'block' : 'hidden print:block'} ${isPrintingReport ? 'print:hidden' : ''}`}>
                    {/* Sustainability Section */}
                    <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-12 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                       
                       <div className="flex justify-between items-center relative z-10">
                        <h3 className="flex items-center gap-3 text-white font-black text-2xl">
                          <Leaf className="text-emerald-400" size={28} />
                          Sustainability & Carbon Control
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">GHG Protocol Allocation</span>
                      </div>

                      <div className="space-y-8 relative z-10">
                        <div className="space-y-4 relative">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Seller Carbon Control</span>
                            <span className="text-2xl font-black text-blue-400">{info.sellerCarbonControl}%</span>
                          </div>
                          <div className="h-6 w-full bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${info.sellerCarbonControl}%` }}
                              transition={{ delay: 0.8, duration: 1.5 }}
                              className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                            />
                          </div>
                        </div>

                        <div className="space-y-4 relative">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Buyer Carbon Control</span>
                            <span className="text-2xl font-black text-orange-400">{info.buyerCarbonControl}%</span>
                          </div>
                          <div className="h-6 w-full bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${info.buyerCarbonControl}%` }}
                              transition={{ delay: 1, duration: 1.5 }}
                              className="h-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-slate-800 space-y-6 relative z-10">
                        <div className="flex justify-between items-center">
                          <h4 className="text-slate-400 font-bold text-sm">GHG Protocol Scope 3 Segmentation</h4>
                          <span className="text-slate-600"><Info size={16} /></span>
                        </div>
                        
                        <div className="h-8 w-full bg-slate-800 rounded-xl overflow-hidden flex border border-slate-700 shadow-inner">
                          {info.scope3Allocation.map((segment, i) => (
                            <motion.div
                              key={i}
                              initial={{ width: 0 }}
                              animate={{ width: `${segment.percentage}%` }}
                              transition={{ delay: 1.2 + (i * 0.2) }}
                              className={`${segment.color} h-full relative group cursor-help`}
                            >
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </motion.div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-6">
                          {info.scope3Allocation.map((segment, i) => (
                            <div key={i} className="flex items-center gap-2">
                               <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{segment.label} ({segment.percentage}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className={`${(activeTab === 'all' || activeTab === 'compliance') ? 'block' : 'hidden print:block'} ${isPrintingReport ? 'print:hidden' : ''}`}>
                    {/* Institutional Standards Section */}
                    <section className="bg-white border border-slate-100 rounded-[2.5rem] p-1 shadow-sm overflow-hidden">
                      <div className="bg-slate-50 p-8 border-b border-slate-100">
                         <h3 className="flex items-center gap-3 text-slate-900 font-black text-2xl">
                          <Binary className="text-blue-600" size={28} />
                          Documentary Compliance
                        </h3>
                        <p className="text-slate-500 text-sm mt-1 font-medium italic">
                          Technical documentation mapped against Incoterms® 2020 rules, UCP 600, and ISBP 745.
                        </p>
                      </div>
                      <div className="p-8">
                        <LegalCompliance initialTerm={code} showSelector={false} showBibliography={true} />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Risk Disclaimer - Global footer for result */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-500 text-xs mt-8 max-w-4xl mx-auto mb-10">
              Based on International Chamber of Commerce (ICC) Incoterms® 2020 rules. This analysis is for informational purposes only.
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function SummaryCard({ icon, label, responsible, details }: { icon: React.ReactNode, label: string, responsible: string, details: string }) {
  const isSeller = responsible === 'Seller';
  return (
    <div className={`p-5 rounded-3xl border flex flex-col gap-3 transition-all hover:shadow-md ${isSeller ? 'bg-blue-50/30 border-blue-100' : 'bg-orange-50/30 border-orange-100'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSeller ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'}`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-400">Stage: {label}</div>
        <div className={`text-xs font-black uppercase tracking-wider mb-2 ${isSeller ? 'text-blue-700' : 'text-orange-700'}`}>
          {responsible} Control
        </div>
        <p className="text-[10px] text-slate-500 font-medium leading-tight">{details}</p>
      </div>
    </div>
  );
}

function RoadmapItem({ icon, label, responsible, active }: { icon: React.ReactNode, label: string, responsible: string, active: boolean }) {
  return (
    <div className={`p-6 rounded-3xl flex flex-col items-center text-center gap-4 border shadow-sm transition-all hover:shadow-md ${
      active ? 'bg-white border-slate-200 scale-100' : 'bg-slate-50 border-transparent opacity-50'
    }`}>
      <div className={`p-4 rounded-2xl ${
        responsible === 'Seller' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
      }`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-black text-slate-900 mb-1">{label}</div>
        <div className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
          responsible === 'Seller' ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'
        }`}>
          {responsible}
        </div>
      </div>
    </div>
  );
}
