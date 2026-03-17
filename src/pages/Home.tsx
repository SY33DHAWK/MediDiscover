import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Activity, HeartPulse, Stethoscope, Pill, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const quickSearches = [
    { name: "Paracetamol", icon: Pill, color: "bg-blue-100 text-blue-600" },
    { name: "Headache", icon: Activity, color: "bg-rose-100 text-rose-600" },
    { name: "Diabetes", icon: HeartPulse, color: "bg-emerald-100 text-emerald-600" },
    { name: "Antibiotics", icon: Stethoscope, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center"
    >
      <div className="max-w-3xl w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Find the right <span className="text-indigo-600">medicine</span> fast.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Search any medicine globally. Understand usage, side effects, and know when to consult a doctor.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-32 py-5 border-2 border-slate-200 rounded-2xl text-lg shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            placeholder="Search by medicine, brand, or symptom..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
          >
            Search
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-12">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-6">Quick Searches</p>
          <div className="flex flex-wrap justify-center gap-4">
            {quickSearches.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(`/search?q=${encodeURIComponent(item.name)}`)}
                className="flex items-center gap-3 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md px-5 py-3 rounded-2xl transition-all group"
              >
                <div className={`p-2 rounded-xl ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-indigo-700">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
