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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookController = void 0;
const common_1 = require("@nestjs/common");
const facebook_service_1 = require("./facebook.service");
let FacebookController = class FacebookController {
    facebookService;
    constructor(facebookService) {
        this.facebookService = facebookService;
    }
    async getPosts(outputPath) {
        return this.facebookService.retrieveAndSavePosts(outputPath);
    }
    async getPostsData() {
        return this.facebookService.getPosts();
    }
};
exports.FacebookController = FacebookController;
__decorate([
    (0, common_1.Get)('posts'),
    __param(0, (0, common_1.Query)('outputPath')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacebookController.prototype, "getPosts", null);
__decorate([
    (0, common_1.Get)('posts-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FacebookController.prototype, "getPostsData", null);
exports.FacebookController = FacebookController = __decorate([
    (0, common_1.Controller)('facebook'),
    __metadata("design:paramtypes", [facebook_service_1.FacebookService])
], FacebookController);
//# sourceMappingURL=facebook.controller.js.map