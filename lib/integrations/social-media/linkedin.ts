export class LinkedInClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async searchPosts(query: string, options: { limit?: number } = {}) {
    const response = await fetch(
      `https://api.linkedin.com/v2/posts?q=${encodeURIComponent(query)}&count=${options.limit || 50}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.json();
  }

  async getPostDetails(postId: string) {
    const response = await fetch(
      `https://api.linkedin.com/v2/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.json();
  }
}
