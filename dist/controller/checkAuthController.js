"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAuthAndReturnSession = exports.CheckAuth = void 0;
const CheckAuth = (request, response) => {
    var _a;
    const isAuth = ((_a = request.session.userData) === null || _a === void 0 ? void 0 : _a.isAuthenticated) || false;
    if (isAuth) {
        return response.status(200).send({ message: 'User is authenticated' });
    }
    else {
        return response.status(401).send({ message: 'User is not authenticated' });
    }
};
exports.CheckAuth = CheckAuth;
const CheckAuthAndReturnSession = (request, response) => {
    var _a, _b, _c, _d;
    const isAuth = ((_a = request.session.userData) === null || _a === void 0 ? void 0 : _a.isAuthenticated) || false;
    if (isAuth) {
        return response.status(200).send({ userSession: request.session.userData });
    }
    else {
        if (((_c = (_b = request.session) === null || _b === void 0 ? void 0 : _b.guestCart) === null || _c === void 0 ? void 0 : _c.userId) || false) {
            return response.status(210).send({ userSession: (_d = request.session.guestCart) === null || _d === void 0 ? void 0 : _d.userId });
        }
        return response.status(401).send({ message: 'User is not authenticated' });
    }
};
exports.CheckAuthAndReturnSession = CheckAuthAndReturnSession;
