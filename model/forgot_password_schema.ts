import Mongoose, { Schema } from "mongoose";



const forgotPasswordSchema = new Mongoose.Schema({
    
    
    token : {
        type:String,
        require:true
    },
    email_address : {
        type:String,
        required:true,
        unique:true
    },
    token_expiry_date : {
        type : String,
        required : true
    }
}
)

export const forgotPasswordModel = Mongoose.model('forgot_password_token' , forgotPasswordSchema);