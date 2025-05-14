import { FacebookAuthService } from './facebook-auth.service';
export declare class FacebookService {
    private readonly authService;
    private cachedPosts;
    constructor(authService: FacebookAuthService);
    retrieveAndSavePosts(outputPath?: string): Promise<{
        success: boolean;
        result: string;
        posts?: any[];
    }>;
    getPosts(): Promise<{
        posts: any[];
    }>;
}
//# sourceMappingURL=facebook.service.d.ts.map