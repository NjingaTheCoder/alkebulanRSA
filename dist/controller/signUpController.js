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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_schema_1 = require("../model/user_schema");
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailHostUser = process.env.EMAIL_HOST_USER;
const emailHostPassword = process.env.EMAIL_HOST_PASSWORD;
// Setup email transporter
const transporter = nodemailer_1.default.createTransport({
    host: emailHost,
    port: +emailPort,
    secure: false,
    auth: {
        user: emailHostUser,
        pass: emailHostPassword,
    },
});
//================================function for handling signing up=======================================
//==================================================================================================
const SignUpController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructure the body
    const { name, surname, email, phoneNumber, gender, password, _csrf } = request.body;
    console.log(request.body);
    // Validate required fields
    if (!name || !surname || !email || !phoneNumber || !gender || !password) {
        return response.status(400).send({ error: 'All fields are required' });
    }
    // Hash password using bcrypt
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // Get current date
    const currentDate = new Date();
    const account_creation_date = currentDate.toISOString();
    const last_logged_in = account_creation_date;
    try {
        // Create a model for saving data to MongoDB
        const user = new user_schema_1.userModel({
            name,
            surname,
            gender,
            email_address: email,
            phone_number: phoneNumber,
            password: hashedPassword,
            account_creation_date,
            last_logged_in,
        });
        // Save data into a database
        yield user.save();
        console.log('Data saved into database');
        sendWelcomeEmail(name);
        response.status(200).send({ message: 'User saved into the database' });
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
const sendWelcomeEmail = (userName, email) => {
    const welcomeHtml = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center;">
        <img src="https://i.imgur.com/PA5VTwK.png" alt="Scentor Logo" style="width: 100px; height: auto;" />
      </div>
      <h2>Welcome to Alkebulan, ${userName}! 🎉</h2>
      <p>We're thrilled to have you onboard in our little corner of the internet! Whether you're here for a new wardrobe, the latest tech, or that quirky gadget you never knew you needed, we’ve got it all.</p>
      
      <h3>Here's what you can expect:</h3>
      <ul>
        <li>Hot deals served fresh!</li>
        <li>Curated picks just for you (we like to think we're pretty good matchmakers).</li>
        <li>Super speedy shipping 🚀!</li>
      </ul>
  
      <p>So, go ahead and start filling that cart. We promise, your shopping journey with us will be smoother than a new pair of silk socks.</p>
  
      <p>Got questions? We’re always here for you – just drop us a line.</p>
  
      <p>Happy shopping!<br/>
      The Alkebulan Ya Batho Team 😊</p>
    </div>
    `;
    transporter.sendMail({
        from: 'Alkebulan <alkebulanyabatho@gmail.com>',
        to: `${email}`,
        subject: 'Welcome to Alkebulan – Let the Shopping Begin! 🛒',
        html: welcomeHtml,
    }, (error, info) => {
        if (error) {
            console.error(`Error sending email: ${error.message}`);
        }
        else {
            console.log(`Welcome email sent: ${info.response}`);
        }
    });
};
exports.default = SignUpController;
