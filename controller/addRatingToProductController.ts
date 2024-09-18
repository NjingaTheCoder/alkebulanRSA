import { Request , Response } from "express";
import { productModel } from "../model/product_schema";
import { IProduct } from "../interface&Objects/IOProdcut";
import { parse } from "dotenv";

const addRatingToProductController = async (request :Request , response : Response) => {
    
    const {ratings , model} = request.body;

    try{
            const saveProductDetails = await productModel.findOne({model : model});  

            if(saveProductDetails){

                await saveProductDetails.updateOne({ratings : [...saveProductDetails?.ratings , parseInt(ratings)]});
            }

            response.status(200).send({ message: 'Product successfully updated' })
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

export default addRatingToProductController;
