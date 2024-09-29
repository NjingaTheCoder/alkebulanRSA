"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csurf_1 = __importDefault(require("csurf"));
const getCsurfTokenController_1 = require("../controller/getCsurfTokenController");
const signUpController_1 = __importDefault(require("../controller/signUpController"));
const signInController_1 = __importDefault(require("../controller/signInController"));
const passwordResetController_1 = __importDefault(require("../controller/passwordResetController"));
const checkAuthController_1 = require("../controller/checkAuthController");
const express_1 = __importDefault(require("express"));
const checkResetTokenController_1 = __importDefault(require("../controller/checkResetTokenController"));
const updatePasswordController_1 = __importDefault(require("../controller/updatePasswordController"));
const destoryForgotPasswordTokenController_1 = __importDefault(require("../controller/destoryForgotPasswordTokenController"));
const signOutController_1 = __importDefault(require("../controller/signOutController"));
const addAddressToDatabase_1 = __importDefault(require("../controller/addAddressToDatabase"));
const deleteAddressFromDatabaseController_1 = __importDefault(require("../controller/deleteAddressFromDatabaseController"));
const getAddressFromDatabaseController_1 = __importDefault(require("../controller/getAddressFromDatabaseController"));
const addProductToDatabaseController_1 = __importDefault(require("../controller/addProductToDatabaseController"));
const getProductsFromDatabaseController_1 = __importDefault(require("../controller/getProductsFromDatabaseController"));
const getOneProductFromDatabaseController_1 = __importDefault(require("../controller/getOneProductFromDatabaseController"));
const addCartToDatabaseController_1 = __importDefault(require("../controller/addCartToDatabaseController"));
const getCartSizeFromDatabaseController_1 = __importDefault(require("../controller/getCartSizeFromDatabaseController"));
const addBestSellerProductToDatabaseController_1 = __importDefault(require("../controller/addBestSellerProductToDatabaseController"));
const getBestSellerProductsFromDatabaseController_1 = __importDefault(require("../controller/getBestSellerProductsFromDatabaseController"));
const addReviewToDatabaseController_1 = __importDefault(require("../controller/addReviewToDatabaseController"));
const addRatingToProductController_1 = __importDefault(require("../controller/addRatingToProductController"));
const sendProductQuestionEmailController_1 = __importDefault(require("../controller/sendProductQuestionEmailController"));
const getReviewFromDatabaseController_1 = __importDefault(require("../controller/getReviewFromDatabaseController"));
const getCartFromDatabase_1 = __importDefault(require("../controller/getCartFromDatabase"));
const deleteCartItemFromDatabaseController_1 = __importDefault(require("../controller/deleteCartItemFromDatabaseController"));
const checkOutController_1 = require("../controller/checkOutController");
const addSubsriberTodatabaseController_1 = require("../controller/addSubsriberTodatabaseController");
const getCheckOutFromDatabaseController_1 = __importDefault(require("../controller/getCheckOutFromDatabaseController"));
const yocoPayment_1 = __importDefault(require("../controller/yocoPayment"));
const yocoPaymentWebHook_1 = __importDefault(require("../controller/yocoPaymentWebHook"));
const yocoCreateWebHook_1 = __importDefault(require("../controller/yocoCreateWebHook"));
const updateCheckOutController_1 = __importDefault(require("../controller/updateCheckOutController"));
const getOrderController_1 = __importDefault(require("../controller/getOrderController"));
const csurfProtection = (0, csurf_1.default)({
    cookie: {
        httpOnly: false, // Prevents JavaScript access to cookies
        secure: true, // Ensures cookies are sent over HTTPS (use this in production)
        sameSite: 'strict', // Helps prevent CSRF attacks by restricting cross-origin requests
    }
});
const signUp = process.env.SIGN_UP;
const signIn = process.env.SIGN_IN;
const getSession = process.env.GET_SESSION;
const checkAuth = process.env.CHECK_AUTH;
const resetEmail = process.env.RESET_PASSWORD;
const checkUpdatePassword = process.env.CHECK_UPDATE_PASSWORD;
const updatePassword = process.env.UPDATE_PASSWORD;
const destroyResetToken = process.env.DESTORY_RESET_PASSWORD;
const logOut = process.env.LOG_OUT;
const addressDetail = process.env.ADDRESS_DETAILS;
const product = process.env.PRODUCT;
const singleProduct = process.env.SINGLE_PRODUCT;
const cart = process.env.CART;
const cartSize = process.env.CART_SIZE;
const bestSellerProduct = process.env.BEST_SELLER_PRODUCT;
const review = process.env.REVIEW;
const checkOut = process.env.CHECK_OUT;
const subscribe = process.env.SUBSCRIBE;
const yocoPayment = process.env.YOCO_PAYMENT;
const yocoPaymentWebHook = process.env.YOCO_PAYMENT_WEBHOOK;
const order = process.env.ORDER;
const routes = express_1.default.Router();
//================================route get up csurf===============================================
routes.get(`${signUp}`, csurfProtection, getCsurfTokenController_1.GetCsurfTokenController);
//================================Router to handle signing up=======================================
routes.post(`${signUp}`, csurfProtection, signUpController_1.default);
//================================//Route for handing signing in=======================================
routes.post(`${signIn}`, csurfProtection, signInController_1.default);
//================================//function for checking if user is Authenticated and the return session data basck=======================================
routes.get(`${getSession}`, checkAuthController_1.CheckAuthAndReturnSession);
//================================//function for checking if user is Authenticated=======================================
routes.get(`${checkAuth}`, checkAuthController_1.CheckAuth);
//================================//function for sending the password reset email=======================================
routes.post(`${resetEmail}`, csurfProtection, passwordResetController_1.default);
//================================//Route for checking if reset token exist=======================================
routes.post(`${checkUpdatePassword}`, checkResetTokenController_1.default);
//================================//Route for updating user password =======================================
routes.patch(`${updatePassword}`, csurfProtection, updatePasswordController_1.default);
//================================//Route for destory forgot password token=======================================
routes.post(`${destroyResetToken}`, destoryForgotPasswordTokenController_1.default);
//================================//Route for signing out=======================================
routes.get(`${logOut}`, signOutController_1.default);
//================================//Route for aading address to database=======================================
routes.post(`${addressDetail}`, csurfProtection, addAddressToDatabase_1.default);
//================================//Route for deleting an address from the database================================
routes.post(`${addressDetail}/delete`, deleteAddressFromDatabaseController_1.default);
//================================//function for get all the addresss=======================================
routes.get(`${addressDetail}`, getAddressFromDatabaseController_1.default);
//================================//Route for aading product to database=======================================
routes.post(`${product}`, addProductToDatabaseController_1.default);
//================================//Route for aading best seller product to database=======================================
routes.post(`${bestSellerProduct}`, addBestSellerProductToDatabaseController_1.default);
//================================//function for get all the products=======================================
routes.get(`${product}`, getProductsFromDatabaseController_1.default);
//================================//function for get all the best seller products=======================================
routes.get(`${bestSellerProduct}`, getBestSellerProductsFromDatabaseController_1.default);
//================================//Route for aading product to database=======================================
routes.post(`${singleProduct}`, getOneProductFromDatabaseController_1.default);
//================================//Route for aading product cart to database=======================================
routes.post(`${cart}`, addCartToDatabaseController_1.default);
//================================//Route for getting cart size=======================================
routes.post(`${cartSize}`, getCartSizeFromDatabaseController_1.default);
//================================//Route for getting user cart=======================================
routes.post(`${cartSize}/all`, getCartFromDatabase_1.default);
//================================//Route for deleting an cart items from the database================================
routes.post(`${cartSize}/delete`, deleteCartItemFromDatabaseController_1.default);
//================================//Route for posting review data to the database=======================================
routes.post(`${review}`, csurfProtection, addReviewToDatabaseController_1.default);
//================================//Route for posting review data to the database=======================================
routes.post(`${review}/rating-update`, csurfProtection, addRatingToProductController_1.default);
//================================//Route for sending product question email=======================================
routes.post(`${review}/question`, csurfProtection, sendProductQuestionEmailController_1.default);
//================================//Route for posting review data to the database=======================================
routes.get(`${review}`, getReviewFromDatabaseController_1.default);
routes.post(`${checkOut}`, csurfProtection, checkOutController_1.createCheckout);
routes.post(`${checkOut}/get-check-out`, csurfProtection, getCheckOutFromDatabaseController_1.default);
routes.put(`${checkOut}/status`, checkOutController_1.updateOrderStatus);
routes.get(`${checkOut}/orders`, checkOutController_1.getOrdersByUser);
// Route for updating payment detail
routes.post(`${checkOut}/update-payment-details`, csurfProtection, updateCheckOutController_1.default);
// Route for subscribing to the newsletter
routes.post(`${subscribe}`, csurfProtection, addSubsriberTodatabaseController_1.subscribeEmail);
// Route for unsubscribing from the newsletter
routes.post(`${subscribe}/un`, addSubsriberTodatabaseController_1.unsubscribeEmail);
// Route for handling yoco payment
routes.post(`${yocoPayment}`, csurfProtection, yocoPayment_1.default);
// Route for handling yoco payment webhook
routes.post(`${yocoPaymentWebHook}`, yocoPaymentWebHook_1.default);
// Route for handling yoco payment creating a webhook
routes.post(`${yocoPaymentWebHook}/create`, csurfProtection, yocoCreateWebHook_1.default);
// Route for handling order
routes.post(`${order}`, getOrderController_1.default);
exports.default = routes;
