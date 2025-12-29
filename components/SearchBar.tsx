
import React, { useState } from 'react';
import { Search, MapPin, Building2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (category: string, region: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [category, setCategory] = useState('Homestays');
  const [region, setRegion] = useState('Bali, Indonesia');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && region) {
      onSearch(category, region);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-600 uppercase">Category</label>
        <div className="relative">
          <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Italian Restaurants"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-600 uppercase">Region</label>
        <div className="relative">
          <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g. Manhattan, NY"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition disabled:opacity-50 shadow-sm"
      >
        <Search size={18} />
        {isLoading ? 'Extracting...' : 'Extract Data'}
      </button>

      <div className="pt-2 text-[10px] text-slate-400 text-center italic">
        Powered by Gemini 2.5 Flash
      </div>
    </form>
  );
};

export default SearchBar;
