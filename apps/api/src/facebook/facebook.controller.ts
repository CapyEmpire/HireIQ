import { Controller, Get, Query } from '@nestjs/common';
import { FacebookService } from './facebook.service';

@Controller('facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  @Get('posts')
  async getPosts(@Query('outputPath') outputPath?: string) {
    return this.facebookService.retrieveAndSavePosts(outputPath);
  }
  
  @Get('posts-data')
  async getPostsData() {
    return this.facebookService.getPosts();
  }
}