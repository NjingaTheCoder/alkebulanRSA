
import { Request, Response} from 'express';
import bcrypt from 'bcrypt';
import { userModel } from '../model/user_schema';


//================================function for handling signing up=======================================
//==================================================================================================
const SignUpController = async ( request : Request , response : Response) => {
        // Destructure the body
        const { name, surname, email, phoneNumber, gender, password , _csrf } = request.body;

        console.log(request.body)
        // Validate required fields
        if (!name || !surname || !email || !phoneNumber || !gender || !password) {
            return response.status(400).send({ error: 'All fields are required' });
        }
        
        // Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get current date
        const currentDate = new Date();
        const account_creation_date = currentDate.toISOString();
        const last_logged_in = account_creation_date;

        try {
            // Create a model for saving data to MongoDB
            const user = new userModel({
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
            await user.save();

            console.log('Data saved into database');
            response.status(200).send({ message: 'User saved into the database' });

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

export default SignUpController;

