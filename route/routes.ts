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


const csurfProtection = csurf({cookie : {httpOnly:true}})
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


//================================route get up csurf===============================================
routes.get(`${signUp}` , csurfProtection , GetCsurfTokenController);

//================================Router to handle signing up=======================================
routes.post(`${signUp}` , csurfProtection , SignUpController);

//================================//Route for handing signing in=======================================
routes.post(`${signIn}`, csurfProtection ,SignInController);

//================================//function for checking if user is Authenticated and the return session data basck=======================================
routes.get(`${getSession}`, CheckAuthAndReturnSession);

//================================//function for checking if user is Authenticated=======================================
routes.get(`${checkAuth}` , CheckAuth);

//================================//function for sending the password reset email=======================================
routes.post(`${resetEmail}` , csurfProtection , PasswordResetController );

//================================//Route for checking if reset token exist=======================================
routes.post(`${checkUpdatePassword}` , CheckResetTokenController);

//================================//Route for updating user password =======================================
routes.patch(`${updatePassword}` , csurfProtection , UpdatePasswordController);

//================================//Route for destory forgot password token=======================================
routes.post(`${destroyResetToken}` , DestoryForgotPasswordTokenController);

//================================//Route for signing out=======================================
routes.get(`${logOut}` , SignOutController);

//================================//Route for aading address to database=======================================
routes.post(`${addressDetail}` , csurfProtection , AddAddressToDatabase);

//================================//Route for deleting an address from the database================================
routes.post(`${addressDetail}/delete` , DeleteAddressFromDatabaseController);

//================================//function for get all the addresss=======================================
routes.get(`${addressDetail}` , GetAddressFromDatabaseController);


//================================//Route for aading product to database=======================================
routes.post(`${product}` , AddProductToDatabaseController);

//================================//Route for aading best seller product to database=======================================
routes.post(`${bestSellerProduct}` , addBestSellerProductToDatabaseController);

//================================//function for get all the products=======================================
routes.get(`${product}` , GetProductsFromDatabaseController);

//================================//function for get all the best seller products=======================================
routes.get(`${bestSellerProduct}` , GetBestSellerProductsFromDatabaseController);


//================================//Route for aading product to database=======================================
routes.post(`${singleProduct}` , GetOneProductFromDatabaseController);

//================================//Route for aading product cart to database=======================================
routes.post(`${cart}` , AddCartToDatabaseController);


//================================//Route for getting cart size=======================================
routes.post(`${cartSize}`  , GetCartSizeFromDatabaseController);

//================================//Route for getting user cart=======================================
routes.post(`${cartSize}/all`  , GetCartFromDatabase);


//================================//Route for deleting an cart items from the database================================
routes.post(`${cartSize}/delete` , DeleteCartItemFromDatabaseController);


//================================//Route for posting review data to the database=======================================
routes.post(`${review}` , csurfProtection  , addReviewToDatabaseController);

//================================//Route for posting review data to the database=======================================
routes.post(`${review}/rating-update` , csurfProtection  , addRatingToProductController);


//================================//Route for sending product question email=======================================
routes.post(`${review}/question` , csurfProtection  , sendProductQuestionEmailController);

//================================//Route for posting review data to the database=======================================
routes.get(`${review}` ,  GetReviewFromDatabaseController);

routes.post(`${checkOut}`,csurfProtection , createCheckout);

routes.post(`${checkOut}/get-check-out`,csurfProtection , GetCheckOutFromDatabaseController);

routes.put(`${checkOut}/status`, updateOrderStatus);

routes.get(`${checkOut}/orders`, getOrdersByUser);

// Route for updating payment detail
routes.post(`${checkOut}/update-payment-details`, csurfProtection, UpdateCheckOutController );

// Route for subscribing to the newsletter
routes.post(`${subscribe}`, csurfProtection, subscribeEmail);

// Route for unsubscribing from the newsletter
routes.post(`${subscribe}/un`, unsubscribeEmail);

// Route for handling yoco payment
routes.post(`${yocoPayment}`, csurfProtection , YocoPayment);

// Route for handling yoco payment webhook
routes.post(`${yocoPaymentWebHook}`,  YocoPaymentWebHook);

// Route for handling yoco payment creating a webhook
routes.post(`${yocoPaymentWebHook}/create`, csurfProtection ,YocoCreateWebHook);

// Route for handling order
routes.post(`${order}`, GetOrderController);



export default routes;

