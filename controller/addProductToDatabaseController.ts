import { Request , Response } from "express";
import { productModel } from "../model/product_schema";
import { IProduct } from "../interface&Objects/IOProdcut";
import { parse } from "dotenv";

const AddProductToDatabaseController = async (request :Request , response : Response) => {
    
    const {name ,  price  , currency  ,  category , model , filterOption , shortDescription , longDescription , features ,ratings, coverageArea , specialFeature,  images , availability , discountState , discountAmount} = request.body;

    const featureArray = features?.split(',');

    const productObject : Omit<IProduct, '_id'>  = {
        name : name,
        price : parseFloat(price),
        currency : currency,
        category : category,
        model : model,
        filterOption : filterOption,
        description : {
            shortDescription: shortDescription,
            longDescription: longDescription,
        },
        features: featureArray ,
        ratings: [parseInt(ratings)],
        sizeAndCapacity: {
            coverageArea: coverageArea,
            specialFeature:  specialFeature,
        },
        images : images,
        availability: parseInt(availability),
        discount : {

            discountState : discountState,
            discountAmount : discountAmount,
        }
    }
    try{
            const saveProductDetails = new productModel(productObject);

            saveProductDetails.save();
            response.status(200).send({ message: 'Product successfully saved' })
    }catch (error){

        if (error instanceof Error) {

            console.error('Error saving data:', error.message);
            response.status(500).send({ error: error.message });
          } else {

            console.error('Unexpected error:', error);
            response.status(500).send({ error: 'Unexpected error' });
          }
    }


}

export default AddProductToDatabaseController;
