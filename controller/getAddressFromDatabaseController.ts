import { Request , Response } from "express";
import { addressModel } from '../model/address_schema';

const GetAddressFromDatabaseController = async ( request : Request , response : Response) => {

    const addressObject = await addressModel.findOne({email :  request.session.userData?.userEmail});
    if (addressObject) {
        return response.status(200).send({ addressObject : addressObject});
    } else {
        return response.status(401).send({ message: 'No address found' });
    }
}

export default GetAddressFromDatabaseController;
