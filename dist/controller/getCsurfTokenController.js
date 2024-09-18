"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCsurfTokenController = void 0;
const GetCsurfTokenController = (request, response) => {
    response.status(200).send({ csrfToken: request.csrfToken() });
};
exports.GetCsurfTokenController = GetCsurfTokenController;
