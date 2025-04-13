import { ZillowProvider } from './zillow';
import { RealtorProvider } from './realtor';
import { MLSProvider } from './mls';
import { RedfinProvider } from './redfin';
import { TruliaProvider } from './trulia';

export interface PropertyListing {
  id: string;
  source: string;
  url: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: number;
  yearBuilt?: number;
  propertyType: string;
  description: string;
  features: string[];
  images: string[];
  latitude: number;
  longitude: number;
  zestimate?: number;
  rentZestimate?: number;
  taxAssessment?: number;
  lastSold?: {
    date: Date;
    price: number;
  };
  schools?: Array<{
    name: string;
    rating: number;
    distance: number;
    type: string;
  }>;
  walkScore?: number;
  transitScore?: number;
  crimeScore?: number;
}

export class DataProviderIntegration {
  private zillowProvider: ZillowProvider;
  private realtorProvider: RealtorProvider;
  private mlsProvider: MLSProvider;
  private redfinProvider: RedfinProvider;
  private truliaProvider: TruliaProvider;

  constructor() {
    this.zillowProvider = new ZillowProvider();
    this.realtorProvider = new RealtorProvider();
    this.mlsProvider = new MLSProvider();
    this.redfinProvider = new RedfinProvider();
    this.truliaProvider = new TruliaProvider();
  }

  async searchProperties(criteria: {
    location: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    minSqft?: number;
    maxSqft?: number;
    keywords?: string[];
  }): Promise<PropertyListing[]> {
    const results = await Promise.allSettled([
      this.zillowProvider.search(criteria),
      this.realtorProvider.search(criteria),
      this.mlsProvider.search(criteria),
      this.redfinProvider.search(criteria),
      this.truliaProvider.search(criteria),
    ]);

    const listings: PropertyListing[] = [];
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        listings.push(...result.value);
      }
    });

    return listings;
  }

  async getPropertyDetails(propertyId: string, source: string): Promise<PropertyListing | null> {
    switch (source) {
      case 'zillow':
        return this.zillowProvider.getDetails(propertyId);
      case 'realtor':
        return this.realtorProvider.getDetails(propertyId);
      case 'mls':
        return this.mlsProvider.getDetails(propertyId);
      case 'redfin':
        return this.redfinProvider.getDetails(propertyId);
      case 'trulia':
        return this.truliaProvider.getDetails(propertyId);
      default:
        return null;
    }
  }

  async getMarketTrends(location: string): Promise<{
    medianPrice: number;
    priceHistory: Array<{ date: Date; price: number }>;
    inventory: number;
    daysOnMarket: number;
    pricePerSqft: number;
  }> {
    const [zillow, realtor, redfin] = await Promise.all([
      this.zillowProvider.getMarketTrends(location),
      this.realtorProvider.getMarketTrends(location),
      this.redfinProvider.getMarketTrends(location),
    ]);

    // Aggregate and average the data from different sources
    return {
      medianPrice: (zillow.medianPrice + realtor.medianPrice + redfin.medianPrice) / 3,
      priceHistory: [...zillow.priceHistory, ...realtor.priceHistory, ...redfin.priceHistory],
      inventory: Math.round((zillow.inventory + realtor.inventory + redfin.inventory) / 3),
      daysOnMarket: Math.round((zillow.daysOnMarket + realtor.daysOnMarket + redfin.daysOnMarket) / 3),
      pricePerSqft: (zillow.pricePerSqft + realtor.pricePerSqft + redfin.pricePerSqft) / 3,
    };
  }
}
