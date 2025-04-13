import { RealEstateApi } from './types';

// Real estate data provider integrations
export const dataProviders: Record<string, RealEstateApi> = {
  zillow: {
    name: 'Zillow API',
    endpoints: {
      propertyDetails: '/api/zillow/property',
      propertySearch: '/api/zillow/search',
      propertyValuation: '/api/zillow/valuation',
    },
    webhooks: {
      propertyUpdates: '/api/webhooks/zillow/property-updates',
      marketUpdates: '/api/webhooks/zillow/market-updates',
    },
  },
  realtor: {
    name: 'Realtor.com API',
    endpoints: {
      propertyDetails: '/api/realtor/property',
      propertySearch: '/api/realtor/search',
      marketTrends: '/api/realtor/trends',
    },
    webhooks: {
      listingUpdates: '/api/webhooks/realtor/listing-updates',
    },
  },
  mls: {
    name: 'MLS Integration',
    endpoints: {
      propertySearch: '/api/mls/search',
      listingDetails: '/api/mls/listing',
      agentDirectory: '/api/mls/agents',
    },
    webhooks: {
      listingUpdates: '/api/webhooks/mls/listing-updates',
      priceUpdates: '/api/webhooks/mls/price-updates',
    },
  },
};

// API rate limiting and caching configuration
export const apiConfig = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  cache: {
    ttl: 5 * 60, // 5 minutes cache
    maxSize: 100, // maximum 100 items in cache
  },
};

// Webhook event types
export const webhookEvents = {
  PROPERTY_LISTED: 'property.listed',
  PROPERTY_UPDATED: 'property.updated',
  PROPERTY_SOLD: 'property.sold',
  PRICE_CHANGED: 'price.changed',
  MARKET_UPDATE: 'market.update',
};

// API error types
export const apiErrors = {
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  INVALID_API_KEY: 'invalid_api_key',
  RESOURCE_NOT_FOUND: 'resource_not_found',
  INTEGRATION_ERROR: 'integration_error',
};
