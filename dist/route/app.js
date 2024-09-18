"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csurf_1 = __importDefault(require("csurf"));
const express_1 = __importDefault(require("express"));
const csurfProtection = (0, csurf_1.default)({ cookie: { httpOnly: true } });
const routes = express_1.default.Router();
routes.get();
