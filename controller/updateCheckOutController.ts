import { Request , Response } from "express";
import { checkOut } from "../model/check_out_schema";

interface IPaymentDetails{

    
    method : string,
    transactionId : string
    status : string
    _id : string

}

const UpdateCheckOutController = async  (request : Request , response : Response) => {

    const {userId, method ,transactionId ,  status , _id , _csrf} = request.body;

    const checkOutObject =  await checkOut.findOne({userId : userId});
    const paymentDetails : IPaymentDetails = {

        method : method,
        transactionId : transactionId,
        status : status,
        _id: _id,
    }

    if(checkOutObject){

       await checkOutObject.updateOne({ paymentDetails : paymentDetails});
    }


}

export default UpdateCheckOutController;
