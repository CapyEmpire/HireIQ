import { FacebookService } from './facebook.service';
export declare class FacebookController {
    private readonly facebookService;
    constructor(facebookService: FacebookService);
    getPosts(outputPath?: string): Promise<{
        success: boolean;
        result: string;
        posts?: any[];
    }>;
    getPostsData(): Promise<{
        posts: any[];
    }>;
}
//# sourceMappingURL=facebook.controller.d.ts.map