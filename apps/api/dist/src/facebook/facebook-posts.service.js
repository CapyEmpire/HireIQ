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
exports.FacebookPostsService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
let FacebookPostsService = class FacebookPostsService {
    accessToken;
    apiVersion = 'v22.0';
    baseUrl;
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
    }
    async getUserPosts(limit = 100) {
        try {
            console.log('Retrieving posts from Facebook...');
            const endpoint = `${this.baseUrl}/me/posts`;
            const params = {
                access_token: this.accessToken,
                limit: limit,
                fields: 'id,message,created_time,permalink_url,attachments'
            };
            const posts = [];
            let nextUrl = endpoint;
            while (nextUrl && posts.length < limit) {
                const response = await axios_1.default.get(nextUrl, { params });
                if (response.status !== 200) {
                    break;
                }
                const data = response.data;
                posts.push(...(data.data || []));
                nextUrl = data.paging?.next;
                if (nextUrl) {
                    params.access_token = undefined;
                    params.limit = undefined;
                    params.fields = undefined;
                }
            }
            return posts.slice(0, limit);
        }
        catch (error) {
            console.error('Failed to retrieve Facebook posts:', error);
            return null;
        }
    }
    savePostsToJson(posts, outputPath) {
        if (!outputPath) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const dir = path.join(process.cwd(), 'data');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            outputPath = path.join(dir, `facebook_posts_${timestamp}.json`);
        }
        try {
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
            console.log(`Posts saved to ${outputPath}`);
            return outputPath;
        }
        catch (error) {
            console.error('Failed to save posts to JSON:', error);
            throw error;
        }
    }
};
exports.FacebookPostsService = FacebookPostsService;
exports.FacebookPostsService = FacebookPostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], FacebookPostsService);
//# sourceMappingURL=facebook-posts.service.js.map