import Mongoose, { Schema } from "mongoose";



const addressSchema = new Mongoose.Schema({
    
    email : {
        type:String,
        required:true,
        unique:true
    },
    addressDetails :{
        type : Array,
        required : true,

    }

}
)

export const addressModel = Mongoose.model('address' , addressSchema);