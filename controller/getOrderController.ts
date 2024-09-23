import { Request, Response } from 'express';
import { orderModel } from '../model/order_schema'; // Import your order model
import { IOrder } from '../interface&Objects/IOrder'; // Import the interfaces

const GetOrderController = async (req: Request, res: Response) => {
  const { userId , _csrf} = req.body; // Get the orderId from the request parameters

  try {
    // Find the order where 'checkOutObject.orderId' matches the passed orderId
    const order: IOrder | null = await orderModel.findOne({ 'checkOutObject.userId': userId }).exec();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(`Error fetching order: ${error}`);
    return res.status(500).json({ message: 'Error fetching order' });
  }
}

export default GetOrderController;
