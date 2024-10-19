import { Request, Response } from "express";
import { productModel } from "../model/product_schema"; // Assuming you have a product model
import { IProduct } from "../interface&Objects/IOProdcut";

const UpdateProductDetails = async (request: Request, response: Response) => {
  const { productsArray } = request.body; // Expecting an array of products with the updated fields

  // Validate that we actually received an array
  if (!Array.isArray(productsArray)) {
    return response.status(400).json({ message: "Invalid input. Expected an array of products." });
  }

  try {
    // Map through each product and perform updates
    const updatePromises = productsArray.map(async (product: IProduct) => {
      try {
        // Destructure the relevant fields from the request body
        const { _id, name, availability, images, price, category, filterOption, discount } = product;

        // Find the current product in the database
        const existingProduct = await productModel.findOne({ _id: _id });

        // Proceed only if the product exists
        if (existingProduct) {
          // Update the product details in the database
          const updatedProduct = await productModel.findOneAndUpdate(
            { _id: _id },  // Query by the product's ID
            {
              $set: {
                name: name,
                availability: availability,
                images: images,
                price: price,
                category: category,
                filterOption: filterOption,
                "discount.discountState": discount?.discountState,
                "discount.discountAmount": discount?.discountAmount,
              },
            },
            { new: true, runValidators: true }
          );

          return updatedProduct;
        }

        return null; // If no product found, return null
      } catch (error) {
        console.error(`Failed to update product with id ${product._id}:`, error);
        return null; // Handle failure for individual products
      }
    });

    // Wait for all update operations to complete
    const updatedProducts = await Promise.all(updatePromises);

    response.status(200).json({
      message: "Products updated successfully",
      data: updatedProducts.filter(Boolean), // Filter out any null results from failed updates
    });
  } catch (error) {
    console.error("Error updating products:", error);
    response.status(500).json({
      message: "Failed to update products",
      error: error,
    });
  }
};

export default UpdateProductDetails;
