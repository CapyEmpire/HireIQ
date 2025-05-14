"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const http = __importStar(require("http"));
const querystring = __importStar(require("querystring"));
const axios_1 = __importDefault(require("axios"));
const child_process = __importStar(require("child_process"));
let FacebookAuthService = class FacebookAuthService {
    configService;
    appId;
    appSecret;
    redirectUri;
    port;
    constructor(configService) {
        this.configService = configService;
        this.appId = process.env.FACEBOOK_APP_ID;
        this.appSecret = process.env.FACEBOOK_APP_SECRET;
        this.port = 0;
        if (!this.appId || !this.appSecret) {
            console.error('FACEBOOK_APP_ID and FACEBOOK_APP_SECRET must be set as environment variables');
        }
    }
    async login() {
        try {
            const authCode = await this.getAuthCode();
            if (!authCode) {
                console.error('Failed to get authorization code');
                return null;
            }
            return this.exchangeCodeForToken(authCode);
        }
        catch (error) {
            console.error('Facebook authentication failed:', error);
            return null;
        }
    }
    async getAuthCode() {
        return new Promise((resolve) => {
            let code = null;
            let error = null;
            const server = http.createServer((req, res) => {
                const urlObj = new URL(req.url, `http://${req.headers.host}`);
                const query = querystring.parse(urlObj.search.substring(1));
                if (query.code) {
                    code = query.code;
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`
            <html>
              <head>
                <title>Authentication Successful</title>
                <style>
                  body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                  .success { color: green; }
                  .container { max-width: 600px; margin: 0 auto; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1 class="success">Authentication Successful!</h1>
                  <p>You have successfully authenticated with Facebook.</p>
                  <p>You can close this window and return to the application.</p>
                </div>
              </body>
            </html>
          `);
                }
                else if (query.error) {
                    error = query.error;
                    const errorReason = query.error_reason || 'Unknown';
                    const errorDesc = query.error_description || 'No description provided';
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end(`
            <html>
              <head>
                <title>Authentication Failed</title>
                <style>
                  body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                  .error { color: red; }
                  .container { max-width: 600px; margin: 0 auto; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1 class="error">Authentication Failed</h1>
                  <p>Error: ${query.error}</p>
                  <p>Reason: ${errorReason}</p>
                  <p>Description: ${errorDesc}</p>
                  <p>Please close this window and try again.</p>
                </div>
              </body>
            </html>
          `);
                }
                else {
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end(`
            <html>
              <head>
                <title>Authentication Failed</title>
                <style>
                  body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                  .error { color: red; }
                  .container { max-width: 600px; margin: 0 auto; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1 class="error">Authentication Failed</h1>
                  <p>No authorization code received.</p>
                  <p>Please close this window and try again.</p>
                </div>
              </body>
            </html>
          `);
                }
                server.close();
            });
            server.listen(this.port, () => {
                const actualPort = server.address().port;
                this.redirectUri = `http://localhost:${actualPort}/callback`;
                console.log(`Server listening on port ${actualPort}`);
                const authUrl = `https://www.facebook.com/v22.0/dialog/oauth` +
                    `?client_id=${this.appId}` +
                    `&redirect_uri=${this.redirectUri}` +
                    `&scope=user_posts`;
                console.log(`\nAuthorization URL: ${authUrl}`);
                console.log(`Redirect URI configured: ${this.redirectUri}`);
                console.log('Make sure this redirect URI is configured in your Facebook App settings.');
                console.log('\nOpening browser for Facebook authentication...');
                try {
                    const platform = process.platform;
                    let command;
                    if (platform === 'win32') {
                        command = `start "${authUrl}"`;
                    }
                    else if (platform === 'darwin') {
                        command = `open "${authUrl}"`;
                    }
                    else {
                        command = `xdg-open "${authUrl}"`;
                    }
                    child_process.exec(command, (error) => {
                        if (error) {
                            console.error('Error opening browser:', error);
                            console.log('Please copy and paste the following URL into your browser:');
                            console.log(authUrl);
                        }
                    });
                }
                catch (err) {
                    console.error('Error opening browser:', err);
                    console.log('Please copy and paste the following URL into your browser:');
                    console.log(authUrl);
                }
            });
            const timeout = setTimeout(() => {
                server.close();
                console.log('Authentication timed out. Please try again.');
                resolve(null);
            }, 120000);
            server.on('close', () => {
                clearTimeout(timeout);
                resolve(code);
            });
        });
    }
    async exchangeCodeForToken(authCode) {
        console.log('Exchanging authorization code for access token...');
        try {
            const response = await axios_1.default.get('https://graph.facebook.com/v22.0/oauth/access_token', {
                params: {
                    client_id: this.appId,
                    client_secret: this.appSecret,
                    redirect_uri: this.redirectUri,
                    code: authCode
                }
            });
            if (response.status === 200) {
                const tokenData = response.data;
                console.log('Successfully obtained access token.');
                if (tokenData.expires_in) {
                    console.log(`Token expires in: ${tokenData.expires_in} seconds`);
                }
                return tokenData.access_token;
            }
            else {
                console.error('Error exchanging code for token:', response.data);
                return null;
            }
        }
        catch (error) {
            console.error('Exception during token exchange:', error);
            return null;
        }
    }
};
exports.FacebookAuthService = FacebookAuthService;
exports.FacebookAuthService = FacebookAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FacebookAuthService);
//# sourceMappingURL=facebook-auth.service.js.map