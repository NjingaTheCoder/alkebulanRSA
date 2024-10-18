import { Request, Response } from "express";
import { orderModel } from "../model/order_schema";

const DeleteOrderIdByValue = async (req: Request, res: Response) => {
  const { orderId } = req.body; // The value of the ID you're targeting

  try {
    // Find the document where `id` matches the provided value and unset `id`
    const updatedOrder = await orderModel.findOneAndUpdate(
      { id: orderId }, // Search for the document where `id` matches `idValue`
      {
        $unset: { id: 1 } // Remove the `id` field
      },
      { new: true } // Return the updated document after the field has been removed
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found with the provided id' });
    }

    res.status(200).json({ message: 'id field deleted successfully', updatedOrder });
  } catch (err) {
    console.error('Error deleting id:', err);
    res.status(500).json({ error: 'Failed to delete id' });
  }
};

export default DeleteOrderIdByValue;
