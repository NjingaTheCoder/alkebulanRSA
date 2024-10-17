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
const getCustomers_1 = __importDefault(require("../controller/getCustomers"));
const deleteCustomer_1 = __importDefault(require("../controller/deleteCustomer"));
const updateCustomers_1 = __importDefault(require("../controller/updateCustomers"));
const getAllOrders_1 = __importDefault(require("../controller/getAllOrders"));
const updateOrders_1 = __importDefault(require("../controller/updateOrders"));
const csurfProtection = (0, csurf_1.default)({
    cookie: {
        httpOnly: true,
        secure: true, // Ensure secure cookie over HTTPS
        sameSite: 'lax', // Required for cross-site requests
    },
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
const customer = process.env.CUSTOMER;
const routes = express_1.default.Router();
// Routes for handling CSRF token
routes.get(`${signUp}`, csurfProtection, getCsurfTokenController_1.GetCsurfTokenController);
routes.get(`${customer}`, csurfProtection, getCustomers_1.default);
routes.post(`${customer}/delete`, csurfProtection, deleteCustomer_1.default);
routes.post(`${customer}/update`, csurfProtection, updateCustomers_1.default);
// Routes for Sign Up and Sign In
routes.post(`${signUp}`, csurfProtection, signUpController_1.default);
routes.post(`${signIn}`, csurfProtection, signInController_1.default);
// Routes for Authentication
routes.get(`${getSession}`, checkAuthController_1.CheckAuthAndReturnSession);
routes.get(`${checkAuth}`, checkAuthController_1.CheckAuth);
// Password Reset Routes
routes.post(`${resetEmail}`, csurfProtection, passwordResetController_1.default);
routes.post(`${checkUpdatePassword}`, checkResetTokenController_1.default);
routes.patch(`${updatePassword}`, csurfProtection, updatePasswordController_1.default);
routes.post(`${destroyResetToken}`, destoryForgotPasswordTokenController_1.default);
// Sign Out Route
routes.get(`${logOut}`, signOutController_1.default);
// Address Management Routes
routes.post(`${addressDetail}`, addAddressToDatabase_1.default);
routes.post(`${addressDetail}/delete`, deleteAddressFromDatabaseController_1.default);
routes.get(`${addressDetail}`, getAddressFromDatabaseController_1.default);
// Product Management Routes
routes.post(`${product}`, addProductToDatabaseController_1.default);
routes.get(`${product}`, getProductsFromDatabaseController_1.default);
routes.post(`${singleProduct}`, getOneProductFromDatabaseController_1.default);
routes.post(`${bestSellerProduct}`, addBestSellerProductToDatabaseController_1.default);
routes.get(`${bestSellerProduct}`, getBestSellerProductsFromDatabaseController_1.default);
// Cart Management Routes
routes.post(`${cart}`, addCartToDatabaseController_1.default);
routes.post(`${cartSize}`, getCartSizeFromDatabaseController_1.default);
routes.post(`${cartSize}/all`, getCartFromDatabase_1.default);
routes.post(`${cartSize}/delete`, deleteCartItemFromDatabaseController_1.default);
// Review and Rating Routes
routes.post(`${review}`, csurfProtection, addReviewToDatabaseController_1.default);
routes.post(`${review}/rating-update`, csurfProtection, addRatingToProductController_1.default);
routes.post(`${review}/question`, csurfProtection, sendProductQuestionEmailController_1.default);
routes.get(`${review}`, getReviewFromDatabaseController_1.default);
// Checkout and Order Management Routes
routes.post(`${checkOut}`, csurfProtection, checkOutController_1.createCheckout);
routes.post(`${checkOut}/get-check-out`, csurfProtection, getCheckOutFromDatabaseController_1.default);
routes.put(`${checkOut}/status`, checkOutController_1.updateOrderStatus);
routes.get(`${checkOut}/orders`, checkOutController_1.getOrdersByUser);
routes.post(`${checkOut}/update-payment-details`, csurfProtection, updateCheckOutController_1.default);
// Newsletter Subscription Routes
routes.post(`${subscribe}`, addSubsriberTodatabaseController_1.subscribeEmail);
routes.post(`${subscribe}/un`, addSubsriberTodatabaseController_1.unsubscribeEmail);
// Yoco Payment Routes
routes.post(`${yocoPayment}`, csurfProtection, yocoPayment_1.default);
routes.post(`${yocoPaymentWebHook}`, yocoPaymentWebHook_1.default);
routes.post(`${yocoPaymentWebHook}/create`, csurfProtection, yocoCreateWebHook_1.default);
// Order Management Route
routes.post(`${order}`, getOrderController_1.default);
routes.get(`${order}/all`, csurfProtection, getAllOrders_1.default);
routes.post(`${order}/update`, csurfProtection, updateOrders_1.default);
exports.default = routes;
