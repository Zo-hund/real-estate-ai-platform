import axios from 'axios';

// Real estate data providers
export const dataProviders = {
  zillow: {
    name: 'Zillow API',
    baseUrl: 'https://api.zillow.com/v2',
    endpoints: {
      propertyDetails: '/property',
      propertySearch: '/search',
      propertyValuation: '/valuation',
      propertyInsights: '/insights',
    },
  },
  realtor: {
    name: 'Realtor.com API',
    baseUrl: 'https://api.realtor.com/v2',
    endpoints: {
      propertySearch: '/properties',
      marketTrends: '/trends',
      neighborhoods: '/neighborhoods',
    },
  },
  mls: {
    name: 'MLS Data',
    baseUrl: process.env.MLS_API_URL,
    endpoints: {
      listings: '/listings',
      agents: '/agents',
      offices: '/offices',
    },
  },
  redfin: {
    name: 'Redfin API',
    baseUrl: 'https://api.redfin.com/v1',
    endpoints: {
      propertySearch: '/search',
      marketInsights: '/insights',
      estimates: '/estimates',
    },
  },
  trulia: {
    name: 'Trulia API',
    baseUrl: 'https://api.trulia.com/v2',
    endpoints: {
      properties: '/properties',
      neighborhoods: '/neighborhoods',
      stats: '/statistics',
    },
  },
  propertyShark: {
    name: 'PropertyShark API',
    baseUrl: 'https://api.propertyshark.com/v1',
    endpoints: {
      propertyData: '/property',
      ownershipHistory: '/history',
      marketAnalysis: '/analysis',
    },
  },
  loopnet: {
    name: 'LoopNet API',
    baseUrl: 'https://api.loopnet.com/v1',
    endpoints: {
      commercialProperties: '/properties',
      marketReports: '/reports',
      analytics: '/analytics',
    },
  },
};

// Data provider API clients
export class RealEstateDataProvider {
  private apiKey: string;
  private provider: any;

  constructor(providerName: string, apiKey: string) {
    this.apiKey = apiKey;
    this.provider = dataProviders[providerName];

    if (!this.provider) {
      throw new Error(`Provider ${providerName} not supported`);
    }
  }

  async searchProperties(params: any) {
    const endpoint = this.provider.endpoints.propertySearch;
    return this.makeRequest('GET', endpoint, params);
  }

  async getPropertyDetails(propertyId: string) {
    const endpoint = this.provider.endpoints.propertyDetails;
    return this.makeRequest('GET', `${endpoint}/${propertyId}`);
  }

  async getMarketTrends(location: string) {
    const endpoint = this.provider.endpoints.marketTrends;
    return this.makeRequest('GET', endpoint, { location });
  }

  private async makeRequest(method: string, endpoint: string, params?: any) {
    try {
      const response = await axios({
        method,
        url: `${this.provider.baseUrl}${endpoint}`,
        params,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error making request to ${this.provider.name}:`, error);
      throw error;
    }
  }
}
