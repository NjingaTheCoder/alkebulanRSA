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
const nodemailer_1 = __importDefault(require("nodemailer"));
// Environment variables for email configuration
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailHostUser = process.env.EMAIL_HOST_USER;
const emailHostPassword = process.env.EMAIL_HOST_PASSWORD;
const secretKey = process.env.SECRET || "koffieking";
// Set up email transporter
const transporter = nodemailer_1.default.createTransport({
    host: emailHost,
    port: emailPort,
    secure: false,
    auth: {
        user: emailHostUser,
        pass: emailHostPassword,
    },
});
// Controller for handling product question email
const sendProductQuestionEmailController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, question, model } = request.body;
    try {
        if (email && name && question && model) {
            // Compose HTML for the product question email
            const productQuestionHtml = `<p>
        Dear Support Team,
        <br/>
        <br/>
        A new product question has been submitted by <strong>${name}</strong>.
        <br/>
        <br/>
        For product model number <strong>${model}</strong>.
        <br/>
        <br/>
        <strong>Question:</strong> ${question}
        <br/>
        <br/>
        Please respond to the customer at the following email address: <a href="mailto:${email}">${email}</a>.
        <br/>
        <br/>
        Best regards,
        <br/>
        The Product Team
      </p>`;
            // Send the email
            transporter.sendMail({
                from: 'Product Support <support@yourcompany.com>',
                to: `tetelomaake@gmail.com`,
                subject: `New Product Question from ${name}`,
                html: productQuestionHtml,
            });
            return response.status(200).send({ message: "Product question has been sent successfully." });
        }
        else {
            return response.status(400).send({ error: "Missing required fields: name, email, or question." });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error sending product question email:", error.message);
            return response.status(500).send({ error: error.message });
        }
        else {
            console.error("Unexpected error:", error);
            return response.status(500).send({ error: "Unexpected error occurred." });
        }
    }
});
exports.default = sendProductQuestionEmailController;
