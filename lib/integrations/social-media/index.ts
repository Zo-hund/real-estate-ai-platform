import { TwitterApi } from 'twitter-api-v2';
import { Client } from '@notionhq/client';
import { LinkedInClient } from './linkedin';
import { InstagramClient } from './instagram';

export interface SocialMediaPost {
  id: string;
  platform: string;
  content: string;
  media: string[];
  author: string;
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  propertyDetails?: {
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
    type?: string;
  };
  metadata: Record<string, any>;
}

export class SocialMediaIntegration {
  private twitterClient: TwitterApi;
  private notionClient: Client;
  private linkedinClient: LinkedInClient;
  private instagramClient: InstagramClient;

  constructor() {
    this.twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);
    this.notionClient = new Client({ auth: process.env.NOTION_API_KEY });
    this.linkedinClient = new LinkedInClient(process.env.LINKEDIN_ACCESS_TOKEN!);
    this.instagramClient = new InstagramClient(process.env.INSTAGRAM_ACCESS_TOKEN!);
  }

  async fetchRelevantPosts(query: string, options: { limit?: number; timeframe?: string } = {}) {
    const [twitterPosts, linkedinPosts, instagramPosts] = await Promise.all([
      this.fetchTwitterPosts(query, options),
      this.fetchLinkedInPosts(query, options),
      this.fetchInstagramPosts(query, options),
    ]);

    return [...twitterPosts, ...linkedinPosts, ...instagramPosts];
  }

  private async fetchTwitterPosts(query: string, options: { limit?: number } = {}): Promise<SocialMediaPost[]> {
    const tweets = await this.twitterClient.v2.search({
      query: `${query} -is:retweet`,
      max_results: options.limit || 100,
      'tweet.fields': ['created_at', 'geo', 'entities'],
      expansions: ['author_id', 'attachments.media_keys'],
    });

    return tweets.data.map(tweet => ({
      id: tweet.id,
      platform: 'twitter',
      content: tweet.text,
      media: tweet.attachments?.media_keys || [],
      author: tweet.author_id,
      timestamp: new Date(tweet.created_at!),
      location: tweet.geo?.coordinates,
      metadata: tweet,
    }));
  }

  private async fetchLinkedInPosts(query: string, options: { limit?: number } = {}): Promise<SocialMediaPost[]> {
    // Implementation for LinkedIn posts
    return [];
  }

  private async fetchInstagramPosts(query: string, options: { limit?: number } = {}): Promise<SocialMediaPost[]> {
    // Implementation for Instagram posts
    return [];
  }

  async extractPropertyDetails(post: SocialMediaPost) {
    const content = post.content.toLowerCase();
    
    // Extract basic property details using regex
    const priceMatch = content.match(/\$([\d,]+)/)?.[1];
    const bedroomsMatch = content.match(/(\d+)\s*bed/i)?.[1];
    const bathroomsMatch = content.match(/(\d+)\s*bath/i)?.[1];
    const sqftMatch = content.match(/(\d+)\s*sq\s*ft/i)?.[1];

    return {
      price: priceMatch ? parseFloat(priceMatch.replace(',', '')) : undefined,
      bedrooms: bedroomsMatch ? parseInt(bedroomsMatch) : undefined,
      bathrooms: bathroomsMatch ? parseInt(bathroomsMatch) : undefined,
      sqft: sqftMatch ? parseInt(sqftMatch) : undefined,
    };
  }
}
