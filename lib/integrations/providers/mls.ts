import { SearchCriteria } from '.';

export class MLSProvider {
  private apiKey: string;
  private baseUrl = 'https://api.mls.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getPropertyDetails(propertyId: string) {
    const response = await fetch(
      `${this.baseUrl}/properties/${propertyId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.json();
  }

  async searchProperties(criteria: SearchCriteria) {
    const queryParams = new URLSearchParams({
      location: criteria.location,
      ...(criteria.minPrice && { minPrice: criteria.minPrice.toString() }),
      ...(criteria.maxPrice && { maxPrice: criteria.maxPrice.toString() }),
      ...(criteria.bedrooms && { bedrooms: criteria.bedrooms.toString() }),
      ...(criteria.bathrooms && { bathrooms: criteria.bathrooms.toString() }),
      ...(criteria.propertyType && { propertyType: criteria.propertyType }),
    });

    const response = await fetch(
      `${this.baseUrl}/properties/search?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.json();
  }

  async getMarketTrends(location: string) {
    const response = await fetch(
      `${this.baseUrl}/market-trends?location=${encodeURIComponent(location)}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.json();
  }

  async getAgentDirectory(location: string) {
    const response = await fetch(
      `${this.baseUrl}/agents?location=${encodeURIComponent(location)}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.json();
  }
}
