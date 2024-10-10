
import { Request, Response} from 'express';
import bcrypt from 'bcrypt';
import { userModel } from '../model/user_schema';
import nodemailer, { TransportOptions , SentMessageInfo} from 'nodemailer';
import { URL } from 'url';

const emailHost: string | undefined = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailHostUser = process.env.EMAIL_HOST_USER;
const emailHostPassword = process.env.EMAIL_HOST_PASSWORD;

// Setup email transporter
const transporter = nodemailer.createTransport({
  host: emailHost,
  port: +emailPort!,
  secure: false, 
  auth: {
    user: emailHostUser,
    pass: emailHostPassword,
  },
} as TransportOptions);


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
            sendWelcomeEmail(name,email);
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




const sendWelcomeEmail = (userName: string, email: string): void => {
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
    }, (error: Error | null, info: SentMessageInfo) => {
      if (error) {
        console.error(`Error sending email: ${error.message}`);
      } else {
        console.log(`Welcome email sent: ${info.response}`);
      }
    });
  };
  

export default SignUpController;

