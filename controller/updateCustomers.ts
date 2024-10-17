import { Request, Response } from "express";
import { userModel } from "../model/user_schema";
import mongoose from "mongoose";

interface ICustomer {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  surname: string;
  gender: string;
  email_address: string;
  phone_number: string;
  password: string;
  account_creation_date: Date;
  last_logged_in: Date;
  __v?: number; // Optional, as it is managed by MongoDB
}

const UpdateCustomers = async (request: Request, response: Response) => {
  const customersArray: ICustomer[] = request.body; // Expecting an array of customer objects in the request body

  console.log(customersArray)
  // Validate that we actually received an array
  if (!Array.isArray(customersArray)) {
    return response.status(400).json({ message: "Invalid input. Expected an array of customers." });
  }

  try {
    const updatePromises = customersArray.map(async (customer: ICustomer) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(customer._id)) {
          throw new Error(`Invalid _id: ${customer._id}`);
        }
        const id = new mongoose.Types.ObjectId(customer._id);
        return await userModel.findByIdAndUpdate(id, customer, {
          new: true, // Returns the updated document
          runValidators: true, // Ensures model validation runs
        });
      } catch (error) {
        console.error(`Failed to update customer with _id ${customer._id}:`, error);
        return null; // Handle failure for individual customers
      }
    });

    const updatedCustomers = await Promise.all(updatePromises);

    response.status(200).json({
      message: "Customers updated successfully",
      data: updatedCustomers.filter(Boolean), // Remove any null results from failed updates
    });
  } catch (error) {
    console.error("Error updating customers:", error);
    response.status(500).json({
      message: "Failed to update customers",
      error: error,
    });
  }
};

export default UpdateCustomers;
