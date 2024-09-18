import Mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

let connectionString  =  process.env.CONNECTION_STRING || '';


const connectToDatabase = async () => {
    try{
        await Mongoose.connect(connectionString ,{
            dbName: 'Scentor',
          });
        return true;
    }catch(error) {
        return false;
    }

}

export {connectionString , connectToDatabase};
