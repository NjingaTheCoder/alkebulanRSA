import csurf from 'csurf';
import { GetCsurfTokenController } from '../controller/getCsurfTokenController';
import SignUpController from '../controller/signUpController';
import SignInController from '../controller/signInController';
import PasswordResetController from '../controller/passwordResetController';
import { CheckAuth , CheckAuthAndReturnSession } from '../controller/checkAuthController';
import  express  from 'express';
import CheckResetTokenController from '../controller/checkResetTokenController';
import UpdatePasswordController from '../controller/updatePasswordController';
import DestoryForgotPasswordTokenController from '../controller/destoryForgotPasswordTokenController';
import SignOutController from '../controller/signOutController';
import AddAddressToDatabase from '../controller/addAddressToDatabase';
import DeleteAddressFromDatabaseController from '../controller/deleteAddressFromDatabaseController';
import GetAddressFromDatabaseController from '../controller/getAddressFromDatabaseController';
import AddProductToDatabaseController from '../controller/addProductToDatabaseController';
import GetProductsFromDatabaseController from '../controller/getProductsFromDatabaseController';
import GetOneProductFromDatabaseController from '../controller/getOneProductFromDatabaseController';
import AddCartToDatabaseController from '../controller/addCartToDatabaseController';
import GetCartSizeFromDatabaseController from '../controller/getCartSizeFromDatabaseController';
import addBestSellerProductToDatabaseController from '../controller/addBestSellerProductToDatabaseController';
import GetBestSellerProductsFromDatabaseController from '../controller/getBestSellerProductsFromDatabaseController';
import addReviewToDatabaseController from '../controller/addReviewToDatabaseController';
import addRatingToProductController from '../controller/addRatingToProductController';
import sendProductQuestionEmailController from '../controller/sendProductQuestionEmailController';
import GetReviewFromDatabaseController from '../controller/getReviewFromDatabaseController';
import GetCartFromDatabase from '../controller/getCartFromDatabase';
import DeleteCartItemFromDatabaseController from '../controller/deleteCartItemFromDatabaseController';
import { createCheckout, updateOrderStatus, getOrdersByUser  } from '../controller/checkOutController';
import { subscribeEmail , unsubscribeEmail } from '../controller/addSubsriberTodatabaseController';
import GetCheckOutFromDatabaseController from '../controller/getCheckOutFromDatabaseController';
import YocoPayment from '../controller/yocoPayment';
import YocoPaymentWebHook from '../controller/yocoPaymentWebHook';
import YocoCreateWebHook from '../controller/yocoCreateWebHook';
import UpdateCheckOutController from '../controller/updateCheckOutController';
import GetOrderController from '../controller/getOrderController';


const csurfProtection =  csurf({
    cookie: {
        httpOnly: true,
        secure: true,  // Ensure secure cookie over HTTPS
        sameSite: 'lax',  // Required for cross-site requests
        
    },
});

const signUp = process.env.SIGN_UP ;
const signIn = process.env.SIGN_IN ;
const getSession = process.env.GET_SESSION ;
const checkAuth = process.env.CHECK_AUTH ;
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
const yocoPaymentWebHook  = process.env.YOCO_PAYMENT_WEBHOOK;
const order = process.env.ORDER;

const routes = express.Router();

// Routes for handling CSRF token
routes.get(`${signUp}`, csurfProtection, GetCsurfTokenController);

// Routes for Sign Up and Sign In
routes.post(`${signUp}`, csurfProtection, SignUpController);
routes.post(`${signIn}`, csurfProtection , SignInController);

// Routes for Authentication
routes.get(`${getSession}`, CheckAuthAndReturnSession);
routes.get(`${checkAuth}`, CheckAuth);

// Password Reset Routes
routes.post(`${resetEmail}`, csurfProtection, PasswordResetController);
routes.post(`${checkUpdatePassword}`, CheckResetTokenController);
routes.patch(`${updatePassword}`, csurfProtection, UpdatePasswordController);
routes.post(`${destroyResetToken}`, DestoryForgotPasswordTokenController);

// Sign Out Route
routes.get(`${logOut}`, SignOutController);

// Address Management Routes
routes.post(`${addressDetail}`, csurfProtection, AddAddressToDatabase);
routes.post(`${addressDetail}/delete`, DeleteAddressFromDatabaseController);
routes.get(`${addressDetail}`, GetAddressFromDatabaseController);

// Product Management Routes
routes.post(`${product}`, AddProductToDatabaseController);
routes.get(`${product}`, GetProductsFromDatabaseController);
routes.post(`${singleProduct}`, GetOneProductFromDatabaseController);
routes.post(`${bestSellerProduct}`, addBestSellerProductToDatabaseController);
routes.get(`${bestSellerProduct}`, GetBestSellerProductsFromDatabaseController);

// Cart Management Routes
routes.post(`${cart}`, AddCartToDatabaseController);
routes.post(`${cartSize}`, GetCartSizeFromDatabaseController);
routes.post(`${cartSize}/all`, GetCartFromDatabase);
routes.post(`${cartSize}/delete`, DeleteCartItemFromDatabaseController);

// Review and Rating Routes
routes.post(`${review}`, csurfProtection, addReviewToDatabaseController);
routes.post(`${review}/rating-update`, csurfProtection, addRatingToProductController);
routes.post(`${review}/question`, csurfProtection, sendProductQuestionEmailController);
routes.get(`${review}`, GetReviewFromDatabaseController);

// Checkout and Order Management Routes
routes.post(`${checkOut}`, csurfProtection, createCheckout);
routes.post(`${checkOut}/get-check-out`, csurfProtection, GetCheckOutFromDatabaseController);
routes.put(`${checkOut}/status`, updateOrderStatus);
routes.get(`${checkOut}/orders`, getOrdersByUser);
routes.post(`${checkOut}/update-payment-details`, csurfProtection, UpdateCheckOutController);

// Newsletter Subscription Routes
routes.post(`${subscribe}`, csurfProtection, subscribeEmail);
routes.post(`${subscribe}/un`, unsubscribeEmail);

// Yoco Payment Routes
routes.post(`${yocoPayment}`, csurfProtection, YocoPayment);
routes.post(`${yocoPaymentWebHook}`, YocoPaymentWebHook);
routes.post(`${yocoPaymentWebHook}/create`, csurfProtection, YocoCreateWebHook);

// Order Management Route
routes.post(`${order}`, GetOrderController);



export default routes;

