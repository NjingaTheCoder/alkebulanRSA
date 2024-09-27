import { Request , Response } from "express";
import { productModel } from "../model/product_schema";

const GetOneProductFromDatabaseController = async (request :Request , response : Response) => {

    const {model} = request.body;

    const csrfToken  = request.session?.userData?.csrfToken;


    if (!csrfToken) {
      return response.status(400).json({ message: `Oops! It looks like you're not signed in. Please sign in to proceed.` });
    }


    try{

        const requestedProduct = await productModel.findOne({model : model})
        response.status(200).send({model : requestedProduct});
    }catch (error) {

        if (error instanceof Error) {

            console.error('Error saving data:', error.message);
            response.status(500).send({ error: error.message });
          } else {

            console.error('Unexpected error:', error);
            response.status(500).send({ error: 'Unexpected error' });
          }
    }

}

export default GetOneProductFromDatabaseController;
