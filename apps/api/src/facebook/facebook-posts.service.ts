import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
  permalink_url?: string;
  attachments?: any;
}

@Injectable()
export class FacebookPostsService {
  private apiVersion = 'v22.0';
  private baseUrl: string;

  constructor(private readonly accessToken: string) {
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  /**
   * Retrieve posts from the user's Facebook account
   * @param limit Maximum number of posts to retrieve
   * @returns Array of Facebook posts or null if retrieval fails
   */
  async getUserPosts(limit = 100): Promise<FacebookPost[] | null> {
    try {
      console.log('Retrieving posts from Facebook...');
      
      const endpoint = `${this.baseUrl}/me/posts`;
      const params = {
        access_token: this.accessToken,
        limit: limit,
        fields: 'id,message,created_time,permalink_url,attachments'
      };
      
      const posts: FacebookPost[] = [];
      let nextUrl = endpoint;
      
      // Paginate through results
      while (nextUrl && posts.length < limit) {
        const response = await axios.get(nextUrl, { params });
        
        if (response.status !== 200) {
          break;
        }
        
        const data = response.data;
        posts.push(...(data.data || []));
        
        // Get next page URL if available
        nextUrl = data.paging?.next;
        
        // Clear params as they're included in the next_url
        if (nextUrl) {
          params.access_token = undefined;
          params.limit = undefined;
          params.fields = undefined;
        }
      }
      
      return posts.slice(0, limit);
    } catch (error) {
      console.error('Failed to retrieve Facebook posts:', error);
      return null;
    }
  }

  /**
   * Save posts to a JSON file
   * @param posts Array of Facebook posts
   * @param outputPath Optional path to save the JSON file
   * @returns Path to the saved file
   */
  savePostsToJson(posts: FacebookPost[], outputPath?: string): string {
    if (!outputPath) {
      // Create a filename with timestamp if not provided
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const dir = path.join(process.cwd(), 'data');
      
      // Ensure directory exists
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      outputPath = path.join(dir, `facebook_posts_${timestamp}.json`);
    }
    
    try {
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
      console.log(`Posts saved to ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Failed to save posts to JSON:', error);
      throw error;
    }
  }
}