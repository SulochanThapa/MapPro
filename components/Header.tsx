
import React from 'react';
import { MapPin, Globe } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <Globe size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">MapPro</span>
      </div>
      <div className="hidden sm:flex items-center gap-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wider">
          <MapPin size={12} />
          Maps Grounded
        </div>
        <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 text-xs font-bold">
          AI
        </div>
      </div>
    </header>
  );
};

export default Header;
