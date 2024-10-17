import { Request , Response } from "express";
import { userModel } from "../model/user_schema";

interface ICustomer {
    _id: string;
    name: string;
    surname: string;
    gender: string;
    email_address: string;
    phone_number: string;
    password: string;
    account_creation_date: Date;
    last_logged_in: Date;
    __v: number;
}

const UpdateCustomers = async (request : Request , response : Response) => {

    const customersArray = request.body; // Expecting an array of customer objects in the request body

    try {
      const updatePromises = customersArray.map(async (customer : ICustomer) => {
        // Update each customer based on _id
        return userModel.findByIdAndUpdate(customer._id, customer, {
          new: true, // Returns the updated document
          runValidators: true, // Ensures that model validation is run
        });
      });
  
      // Wait for all updates to be completed
      const updatedCustomers = await Promise.all(updatePromises);
  
      response.status(200).json({
        message: 'Customers updated successfully',
        data: updatedCustomers,
      });
    } catch (error) {
      response.status(500).json({ message: 'Failed to update customers', error });
    }


}

export default UpdateCustomers;
