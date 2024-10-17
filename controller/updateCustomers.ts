import { Request, Response } from "express";
import { userModel } from "../model/user_schema";
import mongoose from "mongoose";

interface ICustomer {
    _id: mongoose.Schema.Types.ObjectId,
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

  // Validate that we actually received an array
  if (!Array.isArray(customersArray)) {
    return response.status(400).json({ message: "Invalid input. Expected an array of customers." });
  }

  try {
    const updatePromises = customersArray.map(async (customer: ICustomer) => {
      // Ensure each object contains the _id field
      if (!customer._id) {
        throw new Error(`Customer with missing _id: ${JSON.stringify(customer)}`);
      }

      // Update each customer based on _id
      return userModel.findByIdAndUpdate(customer._id, customer, {
        new: true, // Returns the updated document
        runValidators: true, // Ensures model validation runs
      });
    });

    // Wait for all updates to complete
    const updatedCustomers = await Promise.all(updatePromises);

    response.status(200).json({
      message: "Customers updated successfully",
      data: updatedCustomers,
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
