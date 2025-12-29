
import React from 'react';
import { BusinessProfile } from '../types';
import { Phone, Globe, MapPin, Star, ExternalLink, Info, User, Mail } from 'lucide-react';

interface BusinessCardProps {
  profile: BusinessProfile;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ profile }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition leading-tight">
            {profile.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-bold text-slate-700">{profile.rating || 'N/A'}</span>
            <span className="text-xs text-slate-400 font-medium">Rating</span>
          </div>
        </div>
        {profile.mapUrl && (
          <a
            href={profile.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-600 transition ml-2"
            title="View on Google Maps"
          >
            <ExternalLink size={20} />
          </a>
        )}
      </div>

      <div className="space-y-3 text-sm text-slate-600 flex-1">
        {profile.about && (
          <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
            <Info size={18} className="text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-slate-700 italic leading-relaxed">{profile.about}</p>
          </div>
        )}

        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{profile.address || 'Address not listed'}</span>
        </div>

        {profile.phone && (
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-slate-400 shrink-0" />
            <a href={`tel:${profile.phone}`} className="hover:text-indigo-600 hover:underline">
              {profile.phone}
            </a>
          </div>
        )}

        {profile.email && (
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-slate-400 shrink-0" />
            <a href={`mailto:${profile.email}`} className="hover:text-indigo-600 hover:underline truncate">
              {profile.email}
            </a>
          </div>
        )}

        {profile.owner && (
          <div className="flex items-center gap-3">
            <User size={18} className="text-slate-400 shrink-0" />
            <span className="text-slate-700 font-medium">Owner/Manager: {profile.owner}</span>
          </div>
        )}

        {profile.website && (
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-slate-400 shrink-0" />
            <a
              href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 hover:underline truncate"
            >
              {profile.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </a>
          </div>
        )}
      </div>

      {profile.mapUrl && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          <a
            href={profile.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all font-semibold shadow-sm"
          >
            <MapPin size={16} />
            View Directions
          </a>
        </div>
      )}
    </div>
  );
};

export default BusinessCard;
