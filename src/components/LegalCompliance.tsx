import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Shield, Info, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, BookOpen, User, Gavel, Landmark, StickyNote } from 'lucide-react';
import { LEGAL_DATA, type LegalDoc, type LegalRef } from '../data/legalFramework';

interface LegalComplianceProps {
  initialTerm?: string;
  showSelector?: boolean;
  showBibliography?: boolean;
}

export default function LegalCompliance({ 
  initialTerm = 'FCA', 
  showSelector = true,
  showBibliography = false
}: LegalComplianceProps) {
  const [selectedTerm, setSelectedTerm] = useState(initialTerm);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const termData = LEGAL_DATA[selectedTerm] || LEGAL_DATA['EXW'];
  const terms = ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF'];

  const renderBadge = (ref: LegalRef) => {
    let colorClass = 'bg-slate-100 text-slate-500';
    if (ref.source === 'Incoterms 2020') colorClass = 'bg-blue-100 text-blue-700';
    if (ref.source === 'UCP 600') colorClass = 'bg-amber-100 text-amber-700';
    if (ref.source === 'ISBP 745') colorClass = 'bg-emerald-100 text-emerald-700';

    return (
      <span key={`${ref.source}-${ref.article}`} className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold leading-none ${colorClass}`}>
        [{ref.source} · {ref.article}]
      </span>
    );
  };

  const DocRow = ({ doc }: { doc: LegalDoc, key?: React.Key }) => {
    const isExpanded = expandedDoc === doc.name;
    return (
      <div className="border-b border-slate-100 last:border-0">
        <button
          onClick={() => setExpandedDoc(isExpanded ? null : doc.name)}
          className="w-full p-4 flex flex-col gap-1 text-left hover:bg-slate-50 transition-colors group"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{doc.name}</span>
                <div className="flex flex-wrap gap-1">
                  {doc.refs.map(renderBadge)}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic font-medium">
                {doc.description}
              </p>
            </div>
            {isExpanded ? <ChevronUp size={16} className="text-slate-400 mt-1" /> : <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 mt-1" />}
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-slate-50/50"
            >
              <div className="p-4 space-y-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <User size={14} className="text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prepped By</span>
                      <p className="text-xs font-bold text-slate-700">{doc.whoPrepares}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Gavel size={14} className="text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Legal Basis</span>
                      <p className="text-xs font-bold text-slate-700">{doc.legalBasis}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Landmark size={14} className="text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Banking Requirement</span>
                      <div className="space-y-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block ${doc.isLCRequired ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                          {doc.isLCRequired ? 'Required for LC Presentation' : 'Not Mandatory for LC'}
                        </span>
                        {doc.bankingRequirement && (
                          <p className="text-[11px] text-slate-600 leading-tight mt-1">{doc.bankingRequirement}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <StickyNote size={14} className="text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Practical Note</span>
                      <p className="text-[11px] text-slate-600 italic leading-relaxed">{doc.practicalNote}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Term Selector */}
      {showSelector && (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Incoterms® 2020 Term Selection</div>
          <div className="flex flex-wrap justify-center gap-2">
            {terms.map(term => (
              <button
                key={term}
                onClick={() => {
                  setSelectedTerm(term);
                  setExpandedDoc(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-black transition-all border ${
                  selectedTerm === term 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sea-only Warning */}
      <AnimatePresence>
        {termData.isSeaOnly && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4 text-amber-800"
          >
            <AlertTriangle size={24} className="flex-shrink-0" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Maritime Advisory</span>
              <p className="text-xs font-bold leading-tight">Sea & inland waterway transport only. Avoid for multimodal or air freight.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Table */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Seller Column */}
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm h-fit">
          <div className="bg-[#0C447C] p-4 text-white">
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Rules A1–A10</div>
            <h4 className="text-sm font-black uppercase tracking-widest">Seller's Documents</h4>
          </div>
          <div className="divide-y divide-slate-100">
            {termData.sellerDocs.map(doc => <DocRow key={doc.name} doc={doc} />)}
          </div>
        </div>

        {/* Buyer Column */}
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm h-fit">
          <div className="bg-[#791F1F] p-4 text-white">
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Rules B1–B10</div>
            <h4 className="text-sm font-black uppercase tracking-widest">Buyer's Documents</h4>
          </div>
          <div className="divide-y divide-slate-100">
            {termData.buyerDocs.map(doc => <DocRow key={doc.name} doc={doc} />)}
          </div>
        </div>
      </div>

      {/* Guidance Note */}
      <div className="p-6 bg-slate-900 rounded-[2rem] relative overflow-hidden group">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="text-blue-400" size={18} />
            <span className="text-xs font-black uppercase text-blue-400 tracking-widest">Incoterms® 2020 · {selectedTerm} Guidance</span>
          </div>
          <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
            {termData.note}
          </p>
        </div>
      </div>

      {/* Reference Legend */}
      <div className="pt-8 border-t border-slate-200">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 text-center">Global Trade Reference Framework</h4>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Incoterms® 2020</span>
            </div>
            <p className="text-[10px] text-blue-700/70 font-medium leading-relaxed">
              International Chamber of Commerce (ICC). Rules for the Use of Domestic and International Trade Terms. Articles A1–A10 / B1–B10.
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-600" />
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">UCP 600 (2007)</span>
            </div>
            <p className="text-[10px] text-amber-700/70 font-medium leading-relaxed">
              Uniform Customs and Practice for Documentary Credits. ICC Pub No. 600. Articles 14–28 governing document compliance.
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">ISBP 745 (2013)</span>
            </div>
            <p className="text-[10px] text-emerald-700/70 font-medium leading-relaxed">
              International Standard Banking Practice. ICC Pub No. 745. Granular paragraph guidance for LC document examination.
            </p>
          </div>
        </div>
      </div>

      {/* Final References Citation Section */}
      {showBibliography && (
        <section className="bg-slate-50 rounded-[3rem] p-10 md:p-16 space-y-12 mt-12">
          <div className="space-y-4 text-center">
              <div className="inline-block px-4 py-1.5 bg-white rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">Legal Documentation Bibliography</div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Academic & Global <span className="text-slate-400">Standards</span></h3>
          </div>
          
          <div className="grid gap-8 max-w-4xl mx-auto">
            {[
              {
                id: 1,
                citation: "International Chamber of Commerce (ICC). (2020). Incoterms® 2020: ICC Rules for the Use of Domestic and International Trade Terms. ICC Services, Paris.",
                notes: ["Articles A1–A10 and B1–B10 for each term", "Guidance Notes per term (EXW, FCA, DDP)"]
              },
              {
                id: 2,
                citation: "International Chamber of Commerce (ICC). (2007). Uniform Customs and Practice for Documentary Credits (UCP 600). ICC Publication No. 600. ICC Services, Paris.",
                notes: ["Key articles used: 14 (compliance), 18 (invoice), 19 (multimodal), 20 (B/L), 28 (insurance)"]
              },
              {
                id: 3,
                citation: "International Chamber of Commerce (ICC). (2013). International Standard Banking Practice for the Examination of Documents under UCP 600 (ISBP 745). ICC Publication No. 745. ICC Services, Paris.",
                notes: ["Key paragraphs used: A (general), C (invoice), E (transport documents), K (insurance)"]
              }
            ].map((ref) => (
              <div key={ref.id} className="flex gap-8 group">
                 <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-black text-sm group-hover:border-slate-900 group-hover:text-slate-900 transition-colors">
                   {ref.id}
                 </div>
                 <div className="space-y-3">
                    <p className="text-sm text-slate-700 font-bold leading-relaxed">{ref.citation}</p>
                    <div className="space-y-1">
                      {ref.notes.map((note, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <span className="text-xs font-medium">{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
