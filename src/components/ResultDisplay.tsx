import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Info, Shield, Truck, Ship, Package, Globe, CheckCircle2, RefreshCcw, BarChart3, Binary } from 'lucide-react';
import { INCOTERMS } from '../data/incoterms';

import LegalCompliance from './LegalCompliance';

interface ResultDisplayProps {
  code: string;
  onReset: () => void;
}

type TabType = 'analysis' | 'standards';

export default function ResultDisplay({ code, onReset }: ResultDisplayProps) {
  const [activeTab, setActiveTab] = useState<TabType>('analysis');
  const info = INCOTERMS[code];

  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto space-y-8"
      id="result-container"
    >
      {/* Header Card */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100" id="result-header">
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
            <button
              onClick={onReset}
              className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-sm font-bold backdrop-blur-md border border-white/10 hover:scale-105"
              id="start-over-btn"
            >
              <RefreshCcw size={18} />
              New Analysis
            </button>
          </div>
        </div>

        {/* Dynamic Tab Selector */}
        <div className="bg-slate-50 border-b border-slate-200 px-10 flex gap-8">
          {[
            { id: 'analysis', label: 'Strategic Analysis', icon: BarChart3 },
            { id: 'standards', label: 'Technical Standards', icon: Binary }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2.5 py-6 text-sm font-black uppercase tracking-widest relative transition-all ${
                activeTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-10 grid lg:grid-cols-12 gap-10">
          {/* Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'analysis' ? (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-10"
                >
                  {/* Strategic Risk Transfer Bar */}
                  <section className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-12">
                    <div className="flex justify-between items-center">
                      <h3 className="flex items-center gap-3 text-slate-900 font-black text-2xl">
                        <Shield className="text-emerald-600" size={28} />
                        Risk Transfer Point
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Incoterms® 2020 Protocol</span>
                    </div>

                    <div className="relative pt-16 pb-8">
                      <div className="absolute top-0 left-0 flex flex-col items-start gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Seller Origin</span>
                      </div>
                      <div className="absolute top-0 right-0 flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Buyer Destination</span>
                      </div>

                      <div className="relative mt-12 mb-8">
                        <div className="relative h-6 w-full bg-slate-100 rounded-full overflow-hidden flex border-4 border-slate-50 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${info.transferPosition}%` }}
                            transition={{ type: "spring", stiffness: 50, delay: 0.5 }}
                            className="h-full bg-blue-600 shadow-[inset_-5px_0_10px_rgba(0,0,0,0.1)]"
                          />
                          <div className="flex-1 h-full bg-red-500 shadow-[inset_5px_0_10px_rgba(0,0,0,0.1)]" />
                        </div>

                        <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1, left: `${info.transferPosition}%` }}
                          transition={{ delay: 1, type: "spring" }}
                          className="absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 bg-white border-4 border-slate-900 rounded-full shadow-2xl z-20 flex items-center justify-center"
                        >
                          <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
                          <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-slate-900/50 -z-10" />
                          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase whitespace-nowrap shadow-2xl">
                            {info.transferPoint}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                          </div>
                        </motion.div>
                      </div>

                      <div className="flex justify-between mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 bg-blue-600 rounded-full shadow-lg shadow-blue-200" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seller Risk</span>
                            <span className="text-xl font-black text-blue-600">{info.transferPosition}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buyer Risk</span>
                            <span className="text-xl font-black text-red-600">{100 - info.transferPosition}%</span>
                          </div>
                          <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-200" />
                        </div>
                      </div>
                    </div>

                    <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
                      <h4 className="flex items-center gap-2 text-slate-900 font-bold text-lg mb-3">
                        <Info className="text-blue-600" size={20} />
                        Expert Analysis
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
                  </section>

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
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Seller Carbon Control</span>
                          <span className="text-2xl font-black text-emerald-400">{info.sellerCarbonControl}%</span>
                        </div>
                        <div className="h-6 w-full bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${info.sellerCarbonControl}%` }}
                            transition={{ delay: 0.8, duration: 1.5 }}
                            className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 relative">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Buyer Carbon Control</span>
                          <span className="text-2xl font-black text-red-400">{info.buyerCarbonControl}%</span>
                        </div>
                        <div className="h-6 w-full bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${info.buyerCarbonControl}%` }}
                            transition={{ delay: 1, duration: 1.5 }}
                            className="h-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 space-y-6 relative z-10">
                      <div className="flex justify-between items-center">
                        <h4 className="text-slate-400 font-bold text-sm">GHG Protocol Scope 3 Segmentation</h4>
                        <Info size={16} className="text-slate-600" />
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
                </motion.div>
              ) : (
                <motion.div
                  key="standards"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-10"
                >
                  <LegalCompliance initialTerm={code} showSelector={false} showBibliography={true} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Risk Disclaimer - Global footer for result */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-500 text-xs mt-8">
              Based on International Chamber of Commerce (ICC) Incoterms® 2020 rules. This analysis is for informational purposes only.
            </div>
          </div>

          {/* Sidebar Column - Context remains constant */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 sticky top-28">
              <h3 className="flex items-center gap-2 text-slate-900 font-bold text-xl mb-6 border-b border-slate-200 pb-4">
                <Shield className="text-indigo-600" size={24} />
                Standard Duties
              </h3>
              
              <div className="space-y-4">
                {Object.entries(info.responsibilities).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
                      <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className={value === 'Seller' ? 'text-indigo-600' : 'text-orange-600'}>{value}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${value === 'Seller' ? 'bg-indigo-600' : 'bg-orange-500'} transition-all`} style={{ width: value === 'Seller' ? '100%' : '50%' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-white rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <Leaf size={18} />
                  </div>
                  <span className="font-bold text-slate-900">ESG Status</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed text-slate-400">
                  Calculated based on logistical efficiency and carbon intensity of the transport mode used under {info.code}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logistics Roadmap */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="logistics-roadmap">
        <RoadmapItem icon={<Package />} label="Packaging" responsible="Seller" active />
        <RoadmapItem icon={<Truck />} label="Export" responsible={info.responsibilities.export} active />
        <RoadmapItem icon={<Ship />} label="Transport" responsible={info.responsibilities.mainTransport} active />
        <RoadmapItem icon={<CheckCircle2 />} label="Import" responsible={info.responsibilities.import} active />
      </div>
    </motion.div>
  );
}

function RoadmapItem({ icon, label, responsible, active }: { icon: React.ReactNode, label: string, responsible: string, active: boolean }) {
  return (
    <div className={`p-6 rounded-3xl flex flex-col items-center text-center gap-4 border shadow-sm transition-all hover:shadow-md ${
      active ? 'bg-white border-slate-200 scale-100' : 'bg-slate-50 border-transparent opacity-50'
    }`}>
      <div className={`p-4 rounded-2xl ${
        responsible === 'Seller' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'
      }`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-black text-slate-900 mb-1">{label}</div>
        <div className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
          responsible === 'Seller' ? 'bg-indigo-600 text-white' : 'bg-orange-500 text-white'
        }`}>
          {responsible}
        </div>
      </div>
    </div>
  );
}
