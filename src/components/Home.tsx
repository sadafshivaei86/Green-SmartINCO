import { motion } from 'motion/react';
import { ArrowRight, Globe, ShieldCheck, Leaf, FileText, Ship, Truck, Package, Clock } from 'lucide-react';

interface HomeProps {
  onStartWizard: () => void;
}

export default function Home({ onStartWizard }: HomeProps) {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=1920" 
            alt="Cargo Ship at Sea"
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/30 backdrop-blur-md">
              <ShieldCheck size={14} />
              Incoterms® 2020 Compliant
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
              Navigate Trade <br />
              <span className="text-emerald-500">Without Risk.</span>
            </h1>
            <p className="text-slate-300 text-xl max-w-lg leading-relaxed font-medium">
              The world's smartest AI-driven Incoterms advisor. Quantify liability, track carbon footprints, and master global logistics in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStartWizard}
                className="group px-8 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95"
              >
                Start Free Analysis
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </button>
              <button className="px-8 py-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-lg transition-all backdrop-blur-md border border-white/10">
                View Enterprise Solutions
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block relative"
          >
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl relative z-10 overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <Globe size={150} />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">01</div>
                    <div>
                      <div className="text-white font-bold">Select Your Role</div>
                      <div className="text-slate-400 text-sm">Buyer or Seller perspective</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">02</div>
                    <div>
                      <div className="text-white font-bold">Quantify Impact</div>
                      <div className="text-slate-400 text-sm">Risk Scores & CO2 Data</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">03</div>
                    <div>
                      <div className="text-white font-bold">Generate Docs</div>
                      <div className="text-slate-400 text-sm">Automated legal checklists</div>
                    </div>
                  </div>
                </div>
             </div>
             {/* Decorative Elements */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[80px]" />
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-[60px]" />
          </motion.div>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem label="Active Users" value="12,000+" />
          <StatItem label="Ports Covered" value="450+" />
          <StatItem label="Compliance Accuracy" value="99.9%" />
          <StatItem label="CO2 Reduced" value="4.2M Tons" />
        </div>
      </section>

      {/* Features Detail */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 max-w-3xl mx-auto mb-24">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading flex flex-col">
              Beyond Static Charts.
              <span className="text-emerald-600">Dynamic Intelligence.</span>
            </h2>
            <p className="text-slate-600 text-xl font-medium leading-relaxed">
              Why settle for an old-fashioned PDF? SmartINCO provides real-time risk assessment and sustainability data for the modern supply chain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-20 items-center">
             <div className="space-y-12">
                <FeatureBlock 
                  icon={<ShieldCheck className="text-emerald-600" size={32} />}
                  title="Risk-First Compliance"
                  description="We don't just tell you the term. We show you exactly where your liability starts and ends with visual risk mapping."
                />
                <FeatureBlock 
                  icon={<Leaf className="text-emerald-600" size={32} />}
                  title="Sustainability Scoring"
                  description="Choose Incoterms that empower you to select green carriers and reduce first-mile emissions."
                />
                <FeatureBlock 
                  icon={<FileText className="text-emerald-600" size={32} />}
                  title="Digital Documentation"
                  description="Every recommendation comes with a full checklist of required commercial and transport documents."
                />
             </div>
             <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200"
                  alt="Modern Logistics Hub"
                  className="rounded-[3rem] shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl space-y-4 max-w-[280px]">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <Clock size={20} />
                      </div>
                      <span className="font-bold text-slate-900">Real-time Analysis</span>
                   </div>
                   <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Takes less than 45 seconds to find the perfect term for your specific trade scenario.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
              <Ship size={400} className="absolute -top-40 -left-40" />
              <Package size={300} className="absolute -bottom-20 -right-20" />
           </div>
           
           <h3 className="text-4xl md:text-7xl font-black text-white tracking-widest uppercase">
              Ready to <span className="text-emerald-500">Scale?</span>
           </h3>
           <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Join thousands of SMEs and global exporters who rely on SmartINCO for their international logistics strategy.
           </p>
           <button 
             onClick={onStartWizard}
             className="px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-2xl transition-all shadow-2xl shadow-emerald-900 shadow-offset-y-10 hover:scale-105 active:scale-95 relative z-10"
           >
              Get Started Now
           </button>
        </div>
      </section>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center space-y-2">
      <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{value}</div>
      <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">{label}</div>
    </div>
  );
}

function FeatureBlock({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-6 group">
      <div className="flex-shrink-0 w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300">
        {icon}
      </div>
      <div className="space-y-2">
        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h4>
        <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
