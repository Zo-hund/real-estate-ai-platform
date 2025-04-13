export interface RealEstateApi {
  name: string;
  endpoints: Record<string, string>;
  webhooks: Record<string, string>;
}

export interface PropertyData {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: string;
  status: 'active' | 'pending' | 'sold';
  listDate: string;
  lastUpdate: string;
  features: string[];
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface MarketData {
  region: string;
  medianPrice: number;
  inventory: number;
  daysOnMarket: number;
  pricePerSqft: number;
  marketTrend: 'up' | 'down' | 'stable';
  lastUpdate: string;
}

export interface WebhookEvent {
  type: string;
  timestamp: string;
  data: any;
  source: string;
}

export interface ApiMetrics {
  totalRequests: number;
  averageLatency: number;
  errorRate: number;
  activeIntegrations: number;
  requestsByEndpoint: Record<string, number>;
  errorsByType: Record<string, number>;
}
