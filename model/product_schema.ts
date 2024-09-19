import Mongoose , {Schema} from "mongoose";

const descriptionSchema = new Mongoose.Schema({

          shortDescription: {
            type: String,
            required : true
          },
          longDescription:{
            type: String,
            required : true
          }
});

const sizeAndCapacitySchema = new  Mongoose.Schema({

    coverageArea: {
        type: String,
        required : true
    },
    specialFeature: {
        type: String,
        required : true
    }
});

const discountSchema = new Mongoose.Schema({

    discountState: {
        type: Boolean,
        required : true
    },
    discountAmount: {
        type: Number,
        required : true
    }

});

const productShema = new Mongoose.Schema({

        name : {
            type:String,
            required:true
        },
        price : {
            type:Number,
            required:true
        },
        currency : {
            type:String,
            required:true
        },
        category : {
            type:String,
            required:true
        },
        model : {
            type:String,
            required:true
        },
        filterOption : {
            type:String,
            required:true
        },
        description : {
            type: descriptionSchema,
            required:true
        },
        features:{
            type:Array,
            required : true,
        },
        ratings: {
            type: Array,
            required:true
        },
    
        sizeAndCapacity: {
            type : sizeAndCapacitySchema,
            required : true
        },
        images : {
            type:String,
            require:true
        },
        availability: {
            type : Number,
            require : false
        },
        discount : {
            type : discountSchema,
            required : true
        }

});

export const productModel = Mongoose.model('product' , productShema);
export const bestSellerProductModel = Mongoose.model('best_seller_product' , productShema);

