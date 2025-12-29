
export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  mapUrl?: string;
  about?: string;
  owner?: string;
  email?: string;
}

export interface SearchState {
  category: string;
  region: string;
  isLoading: boolean;
  results: BusinessProfile[];
  error: string | null;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
}
