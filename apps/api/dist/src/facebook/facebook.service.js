"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookService = void 0;
const common_1 = require("@nestjs/common");
const facebook_auth_service_1 = require("./facebook-auth.service");
const facebook_posts_service_1 = require("./facebook-posts.service");
let FacebookService = class FacebookService {
    authService;
    cachedPosts = [];
    constructor(authService) {
        this.authService = authService;
    }
    async retrieveAndSavePosts(outputPath) {
        try {
            console.log('Starting Facebook authentication...');
            const accessToken = await this.authService.login();
            if (!accessToken) {
                return { success: false, result: 'Failed to authenticate with Facebook' };
            }
            console.log('Authentication successful!');
            console.log('Retrieving posts...');
            const postsService = new facebook_posts_service_1.FacebookPostsService(accessToken);
            const posts = await postsService.getUserPosts();
            if (!posts || posts.length === 0) {
                return { success: false, result: 'No posts found or failed to retrieve posts' };
            }
            console.log(`Retrieved ${posts.length} posts.`);
            this.cachedPosts = posts;
            console.log('Saving posts to JSON...');
            const savedPath = postsService.savePostsToJson(posts, outputPath);
            return { success: true, result: savedPath, posts };
        }
        catch (error) {
            console.error('Error in Facebook service:', error);
            return {
                success: false,
                result: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
    async getPosts() {
        if (this.cachedPosts.length === 0) {
            const result = await this.retrieveAndSavePosts();
            return { posts: result.posts || [] };
        }
        return { posts: this.cachedPosts };
    }
};
exports.FacebookService = FacebookService;
exports.FacebookService = FacebookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [facebook_auth_service_1.FacebookAuthService])
], FacebookService);
//# sourceMappingURL=facebook.service.js.map