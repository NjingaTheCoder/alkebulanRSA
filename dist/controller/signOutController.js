"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignOutController = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to logout' });
        }
        res.clearCookie('connect.sid');
        res.status(200).send({ message: 'Logout successful' });
    });
};
exports.default = SignOutController;
