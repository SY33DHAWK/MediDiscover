import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SearchResult, searchMedicines } from "../services/geminiService";
import { motion } from "motion/react";
import { Pill, Search, AlertCircle, Loader2 } from "lucide-react";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;
    
    let isMounted = true;
    setLoading(true);
    setError("");

    searchMedicines(query)
      .then((data) => {
        if (isMounted) {
          setResults(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Failed to fetch search results. Please try again.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [query]);

  if (!query) {
    return (
      <div className="text-center py-20">
        <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-700">Enter a search query</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Search Results</h1>
        <p className="text-slate-600">Showing results for <span className="font-semibold text-indigo-600">"{query}"</span></p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          <p className="text-slate-500 font-medium">Searching global database...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-4">
          <AlertCircle className="h-6 w-6 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-700 mb-2">No results found</h2>
          <p className="text-slate-500">Try searching for a different medicine, brand, or symptom.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="space-y-4"
        >
          {results.map((result, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <Link
                to={`/medicine/${encodeURIComponent(result.name)}`}
                className="block bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {result.name}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        result.type === 'Generic' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {result.type}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{result.description}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-indigo-50 transition-colors">
                    <Pill className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
