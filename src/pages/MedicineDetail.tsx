import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MedicineDetails, getMedicineDetails } from "../services/geminiService";
import { motion } from "motion/react";
import {
  Pill, AlertTriangle, CheckCircle2, Info, Clock, Activity,
  Stethoscope, Globe, ShieldAlert, Loader2, UserCheck, UserX, UserMinus, Baby
} from "lucide-react";

export default function MedicineDetail() {
  const { name } = useParams<{ name: string }>();
  const [details, setDetails] = useState<MedicineDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!name) return;
    
    let isMounted = true;
    setLoading(true);
    setError("");

    getMedicineDetails(name)
      .then((data) => {
        if (isMounted) {
          if (data) {
            setDetails(data);
          } else {
            setError("Could not find detailed information for this medicine.");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Failed to fetch medicine details. Please try again.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [name]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
        <p className="text-xl text-slate-600 font-medium">Analyzing global medical data...</p>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-slate-800 mb-4">{error || "Medicine not found"}</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium text-lg underline underline-offset-4">
          Return to search
        </Link>
      </div>
    );
  }

  const renderSuitabilityIcon = (isSuitable: boolean) => {
    return isSuitable ? (
      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
    ) : (
      <UserX className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-20"
    >
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -z-10 opacity-50"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{details.medicineName}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${
                details.prescriptionType === 'OTC' ? 'bg-emerald-100 text-emerald-700' :
                details.prescriptionType === 'Prescription' ? 'bg-rose-100 text-rose-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {details.prescriptionType}
              </span>
            </div>
            
            <div className="space-y-2 text-lg text-slate-600">
              <p><span className="font-semibold text-slate-800">Generic Name:</span> {details.genericName}</p>
              <p><span className="font-semibold text-slate-800">Drug Class:</span> {details.drugClass}</p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm w-full md:w-auto">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-500" />
              Manufacturers
            </h3>
            <ul className="space-y-1 text-slate-600">
              {details.manufacturers.slice(0, 3).map((m, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                  {m}
                </li>
              ))}
              {details.manufacturers.length > 3 && (
                <li className="text-slate-400 italic text-xs mt-1">+{details.manufacturers.length - 3} more</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4">
        <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-800">Medical Disclaimer</h4>
          <p className="text-amber-700 text-sm mt-1">
            This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Conditions Treated */}
          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Activity className="h-6 w-6 text-indigo-500" />
              Conditions Treated
            </h2>
            <div className="flex flex-wrap gap-3">
              {details.conditionsTreated.map((condition, i) => (
                <span key={i} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-medium border border-indigo-100">
                  {condition}
                </span>
              ))}
            </div>
          </section>

          {/* Dosage & Usage */}
          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Clock className="h-6 w-6 text-indigo-500" />
              Dosage & Usage
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-slate-500" /> Adult Dosage
                </h3>
                <p className="text-slate-600">{details.dosage.adult}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Baby className="h-5 w-5 text-slate-500" /> Child Dosage
                </h3>
                <p className="text-slate-600">{details.dosage.child}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-slate-500" /> Frequency
                </h3>
                <p className="text-slate-600">{details.dosage.frequency}</p>
              </div>
              <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100">
                <h3 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500" /> Max Daily Dose
                </h3>
                <p className="text-rose-700 font-medium">{details.dosage.maxDailyDose}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-3">When to take:</h3>
              <ul className="space-y-2">
                {details.whenToTake.map((instruction, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Side Effects & Warnings */}
          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-rose-500" />
              Side Effects & Warnings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Common Side Effects</h3>
                <ul className="space-y-2">
                  {details.sideEffects.common.map((effect, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                      <span>{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-rose-800 mb-4 border-b border-rose-100 pb-2">Serious Side Effects</h3>
                <ul className="space-y-2">
                  {details.sideEffects.serious.map((effect, i) => (
                    <li key={i} className="flex items-start gap-2 text-rose-700">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-1" />
                      <span>{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 mb-3">Drug Interactions to Avoid:</h3>
                <div className="flex flex-wrap gap-2">
                  {details.drugInteractions.map((interaction, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                      {interaction}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-800 mb-3">Important Warnings:</h3>
                <ul className="space-y-2 bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                  {details.warnings.map((warning, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                      <Info className="h-5 w-5 text-rose-500 flex-shrink-0" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          
          {/* Suitability */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-indigo-500" />
              Who can take it?
            </h2>
            
            <ul className="space-y-4">
              <li className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-medium text-slate-700">Adults</span>
                {renderSuitabilityIcon(details.suitableFor.adults)}
              </li>
              <li className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-medium text-slate-700">Children</span>
                {renderSuitabilityIcon(details.suitableFor.children)}
              </li>
              <li className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-medium text-slate-700">Elderly</span>
                {renderSuitabilityIcon(details.suitableFor.elderly)}
              </li>
              <li className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-medium text-slate-700">Pregnancy</span>
                <span className={`text-sm font-bold px-2 py-1 rounded-md ${
                  details.suitableFor.pregnantWomen === 'Safe' ? 'bg-emerald-100 text-emerald-700' :
                  details.suitableFor.pregnantWomen === 'Avoid' ? 'bg-rose-100 text-rose-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {details.suitableFor.pregnantWomen}
                </span>
              </li>
            </ul>

            {details.suitableFor.specialConditions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Special Conditions</h3>
                <ul className="space-y-2">
                  {details.suitableFor.specialConditions.map((cond, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <Info className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      {cond}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Doctor Recommendations */}
          <section className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 shadow-sm">
            <h2 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-indigo-600" />
              Consult a Doctor
            </h2>
            <p className="text-sm text-indigo-700 mb-4">If symptoms persist, consult the following specialists:</p>
            
            <div className="space-y-3">
              {details.doctorRecommendation.map((rec, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-indigo-100 flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{rec.condition}</span>
                  <span className="font-semibold text-slate-800">{rec.doctorType}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Global Brands */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Pill className="h-5 w-5 text-indigo-500" />
              Global Brands
            </h2>
            
            <div className="space-y-4">
              {details.brands.map((brand, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-800">{brand.brandName}</h3>
                    <p className="text-xs text-slate-500">{brand.manufacturer}</p>
                  </div>
                  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                    {brand.country}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
}
