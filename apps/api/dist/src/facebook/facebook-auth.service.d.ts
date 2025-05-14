import { ConfigService } from '@nestjs/config';
export declare class FacebookAuthService {
    private configService;
    private appId;
    private appSecret;
    private redirectUri;
    private port;
    constructor(configService: ConfigService);
    login(): Promise<string | null>;
    private getAuthCode;
    private exchangeCodeForToken;
}
//# sourceMappingURL=facebook-auth.service.d.ts.map