import { Response , Request } from "express";
import { userModel } from '../model/user_schema';
import sessionModel from "../model/session_schema";
import bcrypt from 'bcrypt';


const SignInController =  async ( request : Request ,  response : Response) => {

    
  
    const {email , password ,  _csrf} = request.body;

    try {
        const user = await userModel.findOne({ email_address: email });
    
        if (!user) {
          return response.status(401).send({ error: 'Invalid email or password' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          return response.status(401).send({ error: 'Invalid email or password' });
        }

        const deletedSession = await sessionModel.findOneAndDelete({ 'session.userData.userEmail': email });

        if (!deletedSession) {
          return { message: 'Session not found for the provided email.' };
        }    

        //object for storing user data
        request.session.userData = {

            isAuthenticated : true,
            forgotPassword : false,
            userID : user._id,
            userEmail : user.email_address,
            userName : user.name,
            userSurname : user.surname,
            userPhoneNumber : user.phone_number, 
            csrfToken :  _csrf

        }


        // Get current date
        const currentDate = new Date();
        const last_logged_date = currentDate.toISOString();
        //update last loggin date
        await user.updateOne({last_logged_in:last_logged_date});


         // Save session and return success
        request.session.save((err) => {
          if (err) {
            console.error('Error saving session:', err);
            return response.status(500).send({ error: 'Session error' });
          }
          console.log('Session data after login:', request.session);
          response.status(200).send({ message: 'Login successful' });
        });
      } catch (error) {
        console.error('Error during login:', error);
        response.status(500).send({ error: 'Internal server error' });
      }

}

export default SignInController;
