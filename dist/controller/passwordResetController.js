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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_schema_1 = require("../model/user_schema");
const nodemailer_1 = __importDefault(require("nodemailer"));
const forgot_password_schema_1 = require("../model/forgot_password_schema");
const crypto_1 = __importDefault(require("crypto"));
const url_1 = require("url");
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailHostUser = process.env.EMAIL_HOST_USER;
const emailHostPassword = process.env.EMAIL_HOST_PASSWORD;
const secretKey = process.env.SECRET || 'koffieking';
const resetRedirectLink = new url_1.URL(`http://localhost:5173/reset-password`);
//set up email transporter
const transporter = nodemailer_1.default.createTransport({
    host: emailHost,
    port: emailPort,
    secure: false,
    auth: {
        user: emailHostUser,
        pass: emailHostPassword,
    },
});
const PasswordResetController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, _csrf } = request.body;
    const user = yield user_schema_1.userModel.findOne({ email_address: email });
    try {
        if (user) {
            const keyToken = request.csrfToken();
            //html for reset password
            resetRedirectLink.searchParams.set('token', `${keyToken}`);
            const resetHtml = `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
              <!-- Logo -->
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://i.imgur.com/PA5VTwK.png" alt="Scentor Logo" style="width: 100px; height: auto;" />
              </div>
          
              <!-- Greeting -->
              <p style="font-size: 16px; line-height: 1.5;">
                Dear ${user === null || user === void 0 ? void 0 : user.name},
              </p>
          
              <!-- Main Content -->
              <p style="font-size: 16px; line-height: 1.5;">
                We received a request to reset the password for your Alkebulan shop account. If you made this request, please click the link below to reset your password:
              </p>
          
              <!-- Reset Button -->
              <div style="text-align: center; margin: 20px 0;">
                <a href="${resetRedirectLink.toString()}"
                  target="_blank"
                  style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                  Reset Password
                </a>
              </div>
          
              <!-- Additional Information -->
              <p style="font-size: 16px; line-height: 1.5;">
                If you did not request a password reset, please ignore this email. Your account remains secure.
              </p>
          
              <p style="font-size: 16px; line-height: 1.5;">
                For any further assistance, feel free to reach out to our support team.
              </p>
          
              <!-- Signature -->
              <p style="font-size: 16px; line-height: 1.5;">
                Best regards,<br/>
                Alkebulan Ya Batho Team
              </p>
            </div>
          `;
            // Get the current time
            const currentTime = new Date();
            // Add 15 minutes
            currentTime.setMinutes(currentTime.getMinutes() + 15);
            // Convert the updated time to ISO string
            const expiryDate = currentTime.toISOString();
            // Hash password using bcrypt
            const hashedToken = crypto_1.default.createHmac('sha256', secretKey).update(keyToken).digest('hex');
            const emailExists = yield forgot_password_schema_1.forgotPasswordModel.findOne({ email_address: email });
            if (emailExists) {
                const forgotPasswordToken = yield forgot_password_schema_1.forgotPasswordModel.deleteOne({ email_address: email });
            }
            const forgotPassword = new forgot_password_schema_1.forgotPasswordModel({
                token: hashedToken,
                email_address: email,
                token_expiry_date: expiryDate
            });
            yield forgotPassword.save();
            transporter.sendMail({
                from: 'Alkebulan <alkebulanyabatho@gmail.com>',
                to: `${email}`,
                subject: 'Password Reset Request for Your Alebulan Account',
                html: resetHtml
            });
            return response.status(200).send({ message: 'Reset password has been successfuly sent' });
        }
        else {
            return response.status(500).send({ error: 'User does not exist' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error saving data:', error.message);
            response.status(500).send({ error: error.message });
        }
        else {
            console.error('Unexpected error:', error);
            response.status(500).send({ error: 'Unexpected error' });
        }
    }
});
exports.default = PasswordResetController;
