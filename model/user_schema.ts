import Mongoose, { Schema } from "mongoose";


const userSchema = new Mongoose.Schema({
    
    name : {
        type:String,
        required:true
    },
    surname : {
        type:String,
        required:true
    },
    gender : {
        type:String,
        required:true
    },
    email_address : {
        type:String,
        required:true,
        unique:true
    },
    phone_number:{
        type:String,
        required : true,
        unique:true
    },
    password : {
        type: String,
        required:true
    },

    account_creation_date : {
        type : String,
        required : true
    },
    last_logged_in : {
        type:String,
        require:true
    }
}
)

export const userModel = Mongoose.model('customer' , userSchema);