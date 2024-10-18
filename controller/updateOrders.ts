import { Request, Response } from "express";
import { orderModel } from './../model/order_schema';

const UpdateOrderStatusAndTrackingCode = async (request: Request, response: Response) => {
  const { ordersArray } = request.body; // Expecting an array of orders with status and tracking code

  // Validate that we actually received an array
  if (!Array.isArray(ordersArray)) {
    return response.status(400).json({ message: "Invalid input. Expected an array of orders." });
  }

  try {
    const updatePromises = ordersArray.map(async (order: any) => {
      try {
        // Destructure the relevant fields from the request body
        const { id, checkOutObject: { orderStatus }, trackingCode } = order;

        // Update only the orderStatus and trackingCode for the given id
        return await orderModel.findOneAndUpdate(
          { id },  // Query by id (not _id or checkOutObject.id)
          {
            $set: {
              "checkOutObject.orderStatus": orderStatus,
              trackingCode: trackingCode,
            },
          },
          { new: true, runValidators: true }
        );
      } catch (error) {
        console.error(`Failed to update order with id ${order.id}:`, error);
        return null; // Handle failure for individual orders
      }
    });

    const updatedOrders = await Promise.all(updatePromises);

    response.status(200).json({
      message: "Orders updated successfully",
      data: updatedOrders.filter(Boolean), // Filter out any null results from failed updates
    });
  } catch (error) {
    console.error("Error updating orders:", error);
    response.status(500).json({
      message: "Failed to update orders",
      error: error,
    });
  }
};

export default UpdateOrderStatusAndTrackingCode;
