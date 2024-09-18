import { Request , Response } from "express";
import { bestSellerProductModel } from "../model/product_schema";
import { IProduct } from "../interface&Objects/IOProdcut";

const GetBestSellerProductsFromDatabaseController = async ( request : Request ,  response : Response) => {
    
    const productObject : IProduct[] = await bestSellerProductModel.find();
    if (productObject) {
        return response.status(200).send({ productObject : productObject });
    } else {
        return response.status(401).send({ message: 'No Product found' });
    }
}

export default GetBestSellerProductsFromDatabaseController;
