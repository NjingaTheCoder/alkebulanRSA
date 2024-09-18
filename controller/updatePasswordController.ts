import { Request , Response } from "express";
import { userModel } from '../model/user_schema';
import { forgotPasswordModel } from '../model/forgot_password_schema';
import crypto from 'crypto';
import bcrypt from 'bcrypt';



const secretKey = process.env.SECRET || 'kingkoffie';

const UpdatePasswordController = async ( request : Request , response : Response) => {

    
    const {password , token , _csrf} =  request.body;
    try {

        // Check if token and salt are provided
        if (!token ) {
            return response.status(400).send({ error: 'Token and salt are required' });
        }

        // Hash password using bcrypt
        const hashedToken = crypto.createHmac('sha256', secretKey).update(token).digest('hex');
        const forgotPassword = await forgotPasswordModel.findOne({token:hashedToken})

        // Check if token was found 
        if (forgotPassword) {

            if (new Date(forgotPassword.token_expiry_date) > new Date()) {
                // The token is still valid

                // Hash password using bcrypt
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = await userModel.findOne({email_address: forgotPassword.email_address}).updateOne({password:hashedPassword});
                return response.status(200).send({ message: 'Password has successfully been update🎉' });
                
            } else {
                // The token has expired
                await forgotPasswordModel.deleteOne({token:hashedToken});
                return response.status(401).send({ error: 'Token has expired' });
            }
            
        } else {
            return response.status(404).send({ error: 'Token has expired' });
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

export default UpdatePasswordController;
