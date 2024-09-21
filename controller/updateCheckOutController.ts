import { Request , Response } from "express";
import { checkOut } from "../model/check_out_schema";
import axios from "axios";



const UpdateCheckOutController = async  (request : Request , response : Response) => {

    const {userId, transactionId ,  _csrf} = request.body;

    try {

        const checkOutObject =  await checkOut.findOne({userId : userId});

        if(checkOutObject){
    
               // Find the document by ID and update the paymentDetails.transactionId field
        const updatedOrder = await checkOut.findByIdAndUpdate(
            userId,
            {
              $set: { 'paymentDetails.transactionId': transactionId } // Use dot notation to target the nested field
            },
            { new: true } // Return the updated document
          );
    
          if(updatedOrder){
    
            response.status(200).send({updatedOrder});
          }
        }
    
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', {
                message: error.message,
                code: error.code,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : null,
            });
        } else {
            console.error('Unexpected error:', error);
        }
      response.status(500).json({ message: 'Failed to update transaction Id' });
    }


}

export default UpdateCheckOutController;
