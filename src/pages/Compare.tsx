import React, { useState } from "react";
import { compareMedicines } from "../services/geminiService";
import { motion } from "motion/react";
import { ArrowRightLeft, Search, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Compare() {
  const [med1, setMed1] = useState("");
  const [med2, setMed2] = useState("");
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!med1.trim() || !med2.trim()) return;

    setLoading(true);
    setError("");
    setComparison(null);

    try {
      const result = await compareMedicines(med1, med2);
      if (result) {
        setComparison(result);
      } else {
        setError("Could not generate comparison. Please try again.");
      }
    } catch (err) {
      setError("Failed to compare medicines.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Compare Medicines</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Not sure which medicine to take? Compare two medicines side-by-side to understand their differences, uses, and side effects.
        </p>
      </div>

      <form onSubmit={handleCompare} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-12">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="First medicine (e.g., Paracetamol)"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
              value={med1}
              onChange={(e) => setMed1(e.target.value)}
              required
            />
          </div>
          
          <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 flex-shrink-0">
            <ArrowRightLeft className="h-6 w-6" />
          </div>

          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Second medicine (e.g., Ibuprofen)"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
              value={med2}
              onChange={(e) => setMed2(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={loading || !med1.trim() || !med2.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Comparing...
              </>
            ) : (
              "Compare Now"
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center justify-center gap-4 mb-12">
          <AlertCircle className="h-6 w-6 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 text-center">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-indigo-600" />
              Summary
            </h2>
            <p className="text-lg text-indigo-800 leading-relaxed max-w-3xl mx-auto">
              {comparison.summary}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-6">
              <div className="font-bold text-slate-500 uppercase tracking-wider text-sm">Feature</div>
              <div className="font-extrabold text-xl text-indigo-600 text-center">{comparison.medicine1}</div>
              <div className="font-extrabold text-xl text-indigo-600 text-center">{comparison.medicine2}</div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {comparison.comparisonPoints.map((point: any, index: number) => (
                <div key={index} className="grid grid-cols-3 p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="font-semibold text-slate-800 pr-4">{point.feature}</div>
                  <div className="text-slate-600 text-center px-4">{point.med1Value}</div>
                  <div className="text-slate-600 text-center px-4">{point.med2Value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
