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
  const {customersArray} = request.body; // Expecting an array of customer objects in the request body

  // Validate that we actually received an array
  if (!Array.isArray(customersArray)) {
    return response.status(400).json({ message: "Invalid input. Expected an array of customers." });
  }

  try {
    const updatePromises = customersArray.map(async (customer: ICustomer) => {
      try {
        // Ensure the _id is converted to ObjectId
        const id = new mongoose.Types.ObjectId(customer._id);

        // Destructure to exclude _id, account_creation_date, and last_logged_in
        const { account_creation_date, last_logged_in, _id, ...updateData } = customer;

        return userModel.findByIdAndUpdate(id, updateData, {
          new: true, // Returns the updated document
          runValidators: true, // Ensures model validation runs
        });
      } catch (error) {
        console.error(`Failed to update customer with _id ${customer._id}:`, error.message);
        return null; // Handle failure for individual customers
      }
    });

    const updatedCustomers = await Promise.all(updatePromises);

    response.status(200).json({
      message: "Customers updated successfully",
      data: updatedCustomers.filter(Boolean), // Remove any null results from failed updates
    });
  } catch (error) {
    console.error("Error updating customers:", error.message || error);
    response.status(500).json({
      message: "Failed to update customers",
      error: error.message || error,
    });
  }
};

export default UpdateCustomers;
