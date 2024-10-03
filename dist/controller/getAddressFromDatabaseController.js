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
const address_schema_1 = require("../model/address_schema");
const GetAddressFromDatabaseController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const addressObject = yield address_schema_1.addressModel.findOne({ email: (_a = request.session.userData) === null || _a === void 0 ? void 0 : _a.userEmail });
    if (addressObject) {
        return response.status(200).send({ addressObject: addressObject });
    }
    else {
        return response.status(401).send({ message: 'No address found' });
    }
});
exports.default = GetAddressFromDatabaseController;
