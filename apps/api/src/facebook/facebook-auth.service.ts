import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as http from 'http';
import * as querystring from 'querystring';
import axios from 'axios';
import * as child_process from 'child_process';

@Injectable()
export class FacebookAuthService {
  private appId: string;
  private appSecret: string;
  private redirectUri: string;
  private port: number;

  constructor(private configService: ConfigService) {
    this.appId = process.env.FACEBOOK_APP_ID;
    this.appSecret = process.env.FACEBOOK_APP_SECRET;
    this.port = 0;

    if (!this.appId || !this.appSecret) {
      console.error('FACEBOOK_APP_ID and FACEBOOK_APP_SECRET must be set as environment variables');
    }
  }

  /**
   * Authenticate with Facebook and get access token
   * @returns Access token or null if authentication fails
   */
  async login(): Promise<string | null> {
    try {
      // Step 1: Get authorization code via browser
      const authCode = await this.getAuthCode();
      if (!authCode) {
        console.error('Failed to get authorization code');
        return null;
      }

      // Step 2: Exchange auth code for access token
      return this.exchangeCodeForToken(authCode);
    } catch (error) {
      console.error('Facebook authentication failed:', error);
      return null;
    }
  }

  private async getAuthCode(): Promise<string | null> {
    return new Promise((resolve) => {
      let code: string | null = null;
      let error: string | null = null;

      // Create a server to handle the callback
      const server = http.createServer((req, res) => {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const query = querystring.parse(urlObj.search.substring(1));

        if (query.code) {
          code = query.code as string;
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
        } else if (query.error) {
          error = query.error as string;
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
        } else {
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

        // Close the server after handling the request
        server.close();
      });

      // Start the server on a random available port
      server.listen(this.port, () => {
        // Get the actual port assigned by the OS
        const actualPort = (server.address() as any).port;
        this.redirectUri = `http://localhost:${actualPort}/callback`;
        
        console.log(`Server listening on port ${actualPort}`);

        // Construct the authorization URL with the dynamic port
        const authUrl = 
          `https://www.facebook.com/v22.0/dialog/oauth` +
          `?client_id=${this.appId}` +
          `&redirect_uri=${this.redirectUri}` +
          `&scope=user_posts`;

        console.log(`\nAuthorization URL: ${authUrl}`);
        console.log(`Redirect URI configured: ${this.redirectUri}`);
        console.log('Make sure this redirect URI is configured in your Facebook App settings.');

        // Open browser for user to authenticate
        console.log('\nOpening browser for Facebook authentication...');
        
        // Use child_process instead of the open package
        try {
          const platform = process.platform;
          let command;
          
          if (platform === 'win32') {
            command = `start "${authUrl}"`;
          } else if (platform === 'darwin') {
            command = `open "${authUrl}"`;
          } else {
            command = `xdg-open "${authUrl}"`;
          }
          
          child_process.exec(command, (error) => {
            if (error) {
              console.error('Error opening browser:', error);
              console.log('Please copy and paste the following URL into your browser:');
              console.log(authUrl);
            }
          });
        } catch (err) {
          console.error('Error opening browser:', err);
          console.log('Please copy and paste the following URL into your browser:');
          console.log(authUrl);
        }
      });

      // Set a timeout to close the server if no response is received
      const timeout = setTimeout(() => {
        server.close();
        console.log('Authentication timed out. Please try again.');
        resolve(null);
      }, 120000); // 2 minutes

      // When the server closes, resolve the promise with the code
      server.on('close', () => {
        clearTimeout(timeout);
        resolve(code);
      });
    });
  }

  private async exchangeCodeForToken(authCode: string): Promise<string | null> {
    console.log('Exchanging authorization code for access token...');

    try {
      const response = await axios.get('https://graph.facebook.com/v22.0/oauth/access_token', {
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
        
        // Print token expiration if available
        if (tokenData.expires_in) {
          console.log(`Token expires in: ${tokenData.expires_in} seconds`);
        }
        
        return tokenData.access_token;
      } else {
        console.error('Error exchanging code for token:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Exception during token exchange:', error);
      return null;
    }
  }
}
