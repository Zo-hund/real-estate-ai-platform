export class InstagramClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async searchPosts(query: string, options: { limit?: number } = {}) {
    const response = await fetch(
      `https://graph.instagram.com/v12.0/tags/${encodeURIComponent(query)}/media?limit=${options.limit || 50}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    return response.json();
  }

  async getPostDetails(mediaId: string) {
    const response = await fetch(
      `https://graph.instagram.com/v12.0/${mediaId}?fields=id,caption,media_type,media_url,timestamp,location`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    return response.json();
  }
}
