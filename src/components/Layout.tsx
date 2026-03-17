import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Search, Pill, Activity, ShieldAlert } from "lucide-react";

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-indigo-600">
            <Pill className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">MediDiscover</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicines, brands, or symptoms..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <nav className="flex items-center gap-6">
            <Link to="/compare" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Compare
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <Pill className="h-6 w-6 text-indigo-400" />
              <span className="font-bold text-xl tracking-tight">MediDiscover</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 px-4 py-2 rounded-full">
              <ShieldAlert className="h-4 w-4" />
              <span>Information is educational only. Always consult a doctor.</span>
            </div>
          </div>
          <div className="mt-8 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Global Medicine Discovery System. Not a replacement for professional medical advice.
          </div>
        </div>
      </footer>
    </div>
  );
}
