import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Shield, Info, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { LEGAL_DATA, type LegalDoc, type LegalRef } from '../data/legalFramework';

interface LegalComplianceProps {
  initialTerm?: string;
  showSelector?: boolean;
  showBibliography?: boolean;
}

export default function LegalCompliance({ 
  initialTerm = 'FCA', 
  showSelector = false, 
  showBibliography = false 
}: LegalComplianceProps) {
  const [selectedTerm, setSelectedTerm] = useState(initialTerm);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const termData = LEGAL_DATA[selectedTerm] || LEGAL_DATA['EXW'];
  const terms = Object.keys(LEGAL_DATA);

  const renderBadge = (ref: LegalRef) => {
    let colorClass = 'bg-slate-100 text-slate-500';
    if (ref.source === 'Incoterms 2020') colorClass = 'bg-blue-50 text-blue-600 border border-blue-100';
    if (ref.source === 'UCP 600') colorClass = 'bg-amber-50 text-amber-600 border border-amber-100';
    if (ref.source === 'ISBP 745') colorClass = 'bg-emerald-50 text-emerald-600 border border-emerald-100';

    return (
      <span key={`${ref.source}-${ref.article}`} className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold ${colorClass}`}>
        {ref.source} · {ref.article}
      </span>
    );
  };

  const DocRow = ({ doc }: { doc: LegalDoc; key?: string }) => {
    const isExpanded = expandedDoc === doc.name;
    return (
      <div className="border-b border-slate-50 last:border-0">
        <button
          onClick={() => setExpandedDoc(isExpanded ? null : doc.name)}
          className="w-full p-4 flex flex-col gap-2 text-left hover:bg-slate-50/50 transition-colors group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">{doc.name}</span>
                <div className="flex gap-1">
                  {doc.refs.map(renderBadge)}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic font-medium">
                {doc.description}
              </p>
            </div>
            {isExpanded ? <ChevronUp size={16} className="text-slate-300" /> : <ChevronDown size={16} className="text-slate-300 group-hover:text-slate-400" />}
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-slate-50/80"
            >
              <div className="p-5 space-y-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Legal Basis</span>
                    <p className="text-xs font-bold text-slate-700">{doc.legalBasis}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Letter of Credit</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${doc.isLCRequired ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                        {doc.isLCRequired ? 'Required for Presentation' : 'Optional / Non-standard'}
                      </span>
                    </div>
                  </div>
                </div>

                {doc.bankingRequirement && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Banking Requirement</span>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {doc.bankingRequirement}
                    </p>
                  </div>
                )}

                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1 block">Practical Note</span>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">
                    {doc.practicalNote}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* Term Selector */}
      {showSelector && (
        <div className="space-y-4">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Jurisdictional Term Selector</div>
          <div className="flex flex-wrap gap-2">
            {terms.map(term => (
              <button
                key={term}
                onClick={() => {
                  setSelectedTerm(term);
                  setExpandedDoc(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all border ${
                  selectedTerm === term 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Shield size={20} />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-800">Maritime Directive</div>
              <p className="text-xs text-blue-700 font-bold">This term is strictly for Sea and Inland Waterway transport only.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Table */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Seller Column */}
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
          <div className="bg-[#0C447C] p-4 text-white">
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">A1 — A10 Responsibilities</div>
            <h4 className="text-sm font-black uppercase tracking-widest">Seller's Documents</h4>
          </div>
          <div className="divide-y divide-slate-50">
            {termData.sellerDocs.map(doc => <DocRow key={doc.name} doc={doc} />)}
          </div>
        </div>

        {/* Buyer Column */}
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
          <div className="bg-[#791F1F] p-4 text-white">
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">B1 — B10 Responsibilities</div>
            <h4 className="text-sm font-black uppercase tracking-widest">Buyer's Documents</h4>
          </div>
          <div className="divide-y divide-slate-50">
            {termData.buyerDocs.map(doc => <DocRow key={doc.name} doc={doc} />)}
          </div>
        </div>
      </div>

      {/* Guidance Note */}
      <div className="p-6 bg-slate-900 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
          <BookOpen size={100} className="text-white" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <Info className="text-emerald-500" size={20} />
            <span className="text-xs font-black uppercase text-emerald-500 tracking-widest">ICC Guidance Note</span>
          </div>
          <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
            {termData.note}
          </p>
        </div>
      </div>

      {/* Reference Legend */}
      <div className="pt-10 border-t border-slate-100">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Incoterms® 2020</h5>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              ICC (2020), Article A1–A10 / B1–B10 structure defining precise risk and cost transfer points.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900">UCP 600</h5>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              ICC (2007), Articles 14–28. International standard for documentary credits and bank examination.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900">ISBP 745</h5>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              ICC (2013), document-specific paragraphs providing granular guidance on data entry and signatures.
            </p>
          </div>
        </div>
      </div>

      {/* Final References Citation Section */}
      {showBibliography && (
        <section className="bg-slate-50 rounded-[3rem] p-10 md:p-16 space-y-12">
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
