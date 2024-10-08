"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_schema_1 = require("../model/review_schema");
const GetReviewFromDatabaseController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewObject = yield review_schema_1.ReviewModel.find();
    if (reviewObject) {
        return response.status(200).send({ reviewObject: reviewObject });
    }
    else {
        return response.status(401).send({ message: 'No reviews found' });
    }
});
exports.default = GetReviewFromDatabaseController;
