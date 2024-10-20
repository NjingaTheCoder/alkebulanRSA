import { Request, Response } from 'express';
import { orderModel } from '../model/order_schema'; // Import your order model
import { IOrder } from '../interface&Objects/IOrder'; // Import the interfaces

const GetAllOrder = async (req: Request, res: Response) => {

  try {
    // Find the order where 'checkOutObject.orderId' matches the passed orderId
    const order: Array<IOrder> | null = await orderModel.find();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(`Error fetching order: ${error}`);
    return res.status(500).json({ message: 'Error fetching order' });
  }
}

export default GetAllOrder;
