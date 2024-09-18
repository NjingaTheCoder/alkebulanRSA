import { Response , Request } from "express";
import { forgotPasswordModel } from '../model/forgot_password_schema';
import crypto from 'crypto';


const secretKey = process.env.SECRET || 'kingkoffie';

const CheckResetTokenController = async ( request : Request , response : Response) => {

    const { token } =  request.body;
    try {

        // Check if token and salt are provided
        if (!token) {
            return response.status(400).send({ error: 'Token and salt are required' });
        }

        // Hash password using bcrypt
        const hashedToken = crypto.createHmac('sha256', secretKey).update(token).digest('hex');
        const forgotPassword = await forgotPasswordModel.findOne({token:hashedToken})

        // Check if token was found 
        if (forgotPassword) {
            response.status(200).send({tokenExist : true});
        }else{
            response.status(200).send({tokenExist : false});
        }
    }catch(error){

        if (error instanceof Error) {

            console.error('Error saving data:', error.message);
            response.status(500).send({ error: error.message });
        } else {

            console.error('Unexpected error:', error);
            response.status(500).send({ error: 'Unexpected error' });
        }
    }

}

export default CheckResetTokenController;
