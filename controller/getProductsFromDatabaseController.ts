import { Request , Response } from "express";
import { productModel } from "../model/product_schema";
import { IProduct } from "../interface&Objects/IOProdcut";

const GetProductsFromDatabaseController = async ( request : Request ,  response : Response) => {
    
    const productObject : IProduct[] = await productModel.find();
    if (productObject) {
        return response.status(200).send({ productObject : productObject });
    } else {
        return response.status(401).send({ message: 'No products found' });
    }
}

export default GetProductsFromDatabaseController;
