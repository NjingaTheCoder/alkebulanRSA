
import { Request, Response } from "express";
import crypto from 'crypto';
import { forgotPasswordModel } from '../model/forgot_password_schema';

const secretKey = process.env.SECRET || 'kingkoffie';

const DestoryForgotPasswordTokenController = async ( request : Request , response : Response) => {

    
    const {token , _csrf} =  request.body;
    try {

        // Check if token and salt are provided
        if (!token) {
            return response.status(400).send({ error: 'Token and salt are required' });
        }

        // Hash password using bcrypt
        const hashedToken = crypto.createHmac('sha256', secretKey).update(token).digest('hex');
        const forgotPassword = await forgotPasswordModel.deleteOne({token:hashedToken})

        // Check if token was found and deleted
        if (forgotPassword.deletedCount > 0) {

            if (global.gc) {
                global.gc();
            } else {
                console.warn('Garbage collection is not exposed. Run with --expose-gc');
            }

             return response.status(200).send({ message: 'Token Successfully Deleted' });
        } else {
                 return response.status(404).send({ error: 'Token not found' });
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

export default DestoryForgotPasswordTokenController;
