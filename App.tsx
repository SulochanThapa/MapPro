
import React, { useState, useEffect, useCallback } from 'react';
import { GeminiService } from './services/geminiService';
import { SearchState, BusinessProfile } from './types';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BusinessCard from './components/BusinessCard';
import Stats from './components/Stats';
import { Search, Loader2, Download, AlertCircle, MapPin, FileJson } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    category: 'Restaurants',
    region: 'San Francisco, CA',
    isLoading: false,
    results: [],
    error: null,
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log('Location access denied')
      );
    }
  }, []);

  const handleSearch = useCallback(async (category: string, region: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, category, region }));
    
    try {
      const service = new GeminiService();
      const { profiles } = await service.searchBusinesses(category, region, location?.lat, location?.lng);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        results: profiles,
        error: profiles.length === 0 ? "No specific business profiles could be extracted. Try refining your search." : null
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to fetch data. Please check your connection or try again later."
      }));
    }
  }, [location]);

  const exportToCSV = () => {
    if (state.results.length === 0) return;
    
    const headers = ["Name", "Address", "Phone", "Email", "Website", "About", "Owner", "Rating", "Map URL"];
    
    const escapeCSV = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = state.results.map(p => [
      escapeCSV(p.name),
      escapeCSV(p.address),
      escapeCSV(p.phone),
      escapeCSV(p.email),
      escapeCSV(p.website),
      escapeCSV(p.about),
      escapeCSV(p.owner),
      p.rating || '',
      escapeCSV(p.mapUrl)
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `businesses_${state.category.replace(/\s+/g, '_')}_${state.region.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    if (state.results.length === 0) return;
    
    const jsonString = JSON.stringify(state.results, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `businesses_${state.category.replace(/\s+/g, '_')}_${state.region.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <Header />
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r bg-white p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Business Finder</h2>
            <SearchBar onSearch={handleSearch} isLoading={state.isLoading} />
          </div>

          <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <MapPin size={16} />
              <span className="text-sm font-medium">Local Context</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Using Gemini 2.5 Flash with Google Maps Grounding to ensure accuracy and real-time validity of business details.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {state.isLoading ? 'Searching...' : `Results for "${state.category}"`}
                </h1>
                <p className="text-slate-500">{state.region}</p>
              </div>
              
              {state.results.length > 0 && !state.isLoading && (
                <div className="flex gap-2">
                  <button
                    onClick={exportToCSV}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm font-medium text-sm sm:text-base"
                    title="Export as CSV"
                  >
                    <Download size={18} />
                    CSV
                  </button>
                  <button
                    onClick={exportToJSON}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition shadow-sm font-medium text-sm sm:text-base"
                    title="Export as JSON"
                  >
                    <FileJson size={18} />
                    JSON
                  </button>
                </div>
              )}
            </div>

            {state.isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
                <p className="text-slate-500 animate-pulse">Extracting business profiles from Google Maps...</p>
              </div>
            ) : state.error ? (
              <div className="p-8 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-700">
                <AlertCircle size={24} />
                <p>{state.error}</p>
              </div>
            ) : state.results.length > 0 ? (
              <div className="space-y-8">
                <Stats results={state.results} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {state.results.map((profile) => (
                    <BusinessCard key={profile.id} profile={profile} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                <Search size={48} className="mb-4 opacity-20" />
                <p>Enter a category and region to start extracting profiles.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
