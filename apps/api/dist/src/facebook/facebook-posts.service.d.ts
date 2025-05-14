interface FacebookPost {
    id: string;
    message?: string;
    created_time: string;
    permalink_url?: string;
    attachments?: any;
}
export declare class FacebookPostsService {
    private readonly accessToken;
    private apiVersion;
    private baseUrl;
    constructor(accessToken: string);
    getUserPosts(limit?: number): Promise<FacebookPost[] | null>;
    savePostsToJson(posts: FacebookPost[], outputPath?: string): string;
}
export {};
//# sourceMappingURL=facebook-posts.service.d.ts.map