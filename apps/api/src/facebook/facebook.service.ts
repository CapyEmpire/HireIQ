import { Injectable } from '@nestjs/common';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookPostsService } from './facebook-posts.service';

@Injectable()
export class FacebookService {
  private cachedPosts: any[] = [];

  constructor(private readonly authService: FacebookAuthService) {}

  /**
   * Main workflow: login to Facebook, retrieve posts, and save them to a JSON file
   * @param outputPath Optional path to save the JSON file
   * @returns Object with success status and message or file path
   */
  async retrieveAndSavePosts(outputPath?: string): Promise<{ success: boolean; result: string; posts?: any[] }> {
    try {
      // Step 1: Login to Facebook
      console.log('Starting Facebook authentication...');
      const accessToken = await this.authService.login();
      
      if (!accessToken) {
        return { success: false, result: 'Failed to authenticate with Facebook' };
      }
      
      console.log('Authentication successful!');
      
      // Step 2: Retrieve posts
      console.log('Retrieving posts...');
      const postsService = new FacebookPostsService(accessToken);
      const posts = await postsService.getUserPosts();
      
      if (!posts || posts.length === 0) {
        return { success: false, result: 'No posts found or failed to retrieve posts' };
      }
      
      console.log(`Retrieved ${posts.length} posts.`);
      
      // Cache the posts
      this.cachedPosts = posts;
      
      // Step 3: Save posts to JSON
      console.log('Saving posts to JSON...');
      const savedPath = postsService.savePostsToJson(posts, outputPath);
      
      return { success: true, result: savedPath, posts };
    } catch (error) {
      console.error('Error in Facebook service:', error);
      return { 
        success: false, 
        result: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
  
  /**
   * Get the cached posts or retrieve new ones if none are cached
   * @returns Object with posts array
   */
  async getPosts(): Promise<{ posts: any[] }> {
    if (this.cachedPosts.length === 0) {
      const result = await this.retrieveAndSavePosts();
      return { posts: result.posts || [] };
    }
    return { posts: this.cachedPosts };
  }
}