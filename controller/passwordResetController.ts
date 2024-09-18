import { Response , Request} from "express";
import { userModel } from '../model/user_schema';
import nodemailer , {TransportOptions} from 'nodemailer';
import { forgotPasswordModel } from '../model/forgot_password_schema';
import crypto from 'crypto';
import {URL} from 'url';

const emailHost : string | undefined = process.env.EMAIL_HOST ;
const emailPort = process.env.EMAIL_PORT ;
const emailHostUser = process.env.EMAIL_HOST_USER ;
const emailHostPassword = process.env.EMAIL_HOST_PASSWORD ;
const secretKey = process.env.SECRET || 'koffieking';
const resetRedirectLink = new URL(`http://localhost:5173/reset-password`);

//set up email transporter
const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: false, 
    auth: {
      user: emailHostUser,
      pass: emailHostPassword,
    },
  } as TransportOptions);



const PasswordResetController = async (request : Request , response : Response) => {


    
    const {email ,  _csrf } = request.body;

    const user = await userModel.findOne({email_address: email});

    try {
        
        if(user){
            const keyToken = request.csrfToken(); 

            //html for reset password
            resetRedirectLink.searchParams.set('token', `${keyToken}`);
            const resetHtml = `<p>
        
            Dear ${user?.name},
            <br/>
            <br/>
            We received a request to reset the password for your Scentor account. If you made this request, please click the link below to reset your password:
            <br/>
            <br/>
            <a href="${resetRedirectLink.toString()}"
            target="_blank"
            rel=""
            >
                Reset Password
            </a>
            <br/>
            <br/>
            If you did not request a password reset, please ignore this email. Your account remains secure.
            <br/>
            <br/>
            For any further assistance, feel free to reach out to our support team.
            <br/>
            <br/>
            Best regards,  
            <br/>
            The Scentor Team
        
        
            
            </p>`;

                // Get the current time
                const currentTime = new Date();

                // Add 15 minutes
                currentTime.setMinutes(currentTime.getMinutes() + 15);

                // Convert the updated time to ISO string
                const expiryDate = currentTime.toISOString();
        
                // Hash password using bcrypt
                const hashedToken =  crypto.createHmac('sha256', secretKey).update(keyToken).digest('hex');
    
                const emailExists = await forgotPasswordModel.findOne({email_address:email});
                if(emailExists){
                    const forgotPasswordToken = await forgotPasswordModel.deleteOne({email_address:email});
                }

                const forgotPassword = new forgotPasswordModel({
        
                    token: hashedToken,
                    email_address:email,
                    token_expiry_date : expiryDate
                });
        
                await forgotPassword.save();

                transporter.sendMail({
        
                    from:'Scentor <tetelomaake@gmail.com>',
                    to:`${email}`,
                    subject:'Password Reset Request for Your Scentor Account',
                    html:resetHtml
                });

                return response.status(200).send({ message: 'Reset password has been successfuly sent' });
        
            }else{
                return response.status(500).send({ error: 'User does not exist' });
            }
            
    } catch (error) {
        
        if (error instanceof Error) {

            console.error('Error saving data:', error.message);
            response.status(500).send({ error: error.message });
        } else {

            console.error('Unexpected error:', error);
            response.status(500).send({ error: 'Unexpected error' });
        }
    }
}

export default PasswordResetController;
