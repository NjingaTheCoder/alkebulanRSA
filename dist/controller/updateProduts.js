"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_schema_1 = require("../model/product_schema"); // Assuming you have a product model
const UpdateProductDetails = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { productsArray } = request.body; // Expecting an array of products with the updated fields
    // Validate that we actually received an array
    if (!Array.isArray(productsArray)) {
        return response.status(400).json({ message: "Invalid input. Expected an array of products." });
    }
    try {
        // Map through each product and perform updates
        const updatePromises = productsArray.map((product) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Destructure the relevant fields from the request body
                const { _id, name, availability, images, price, category, filterOption, discount } = product;
                // Find the current product in the database
                const existingProduct = yield product_schema_1.productModel.findOne({ _id: _id });
                // Proceed only if the product exists
                if (existingProduct) {
                    // Update the product details in the database
                    const updatedProduct = yield product_schema_1.productModel.findOneAndUpdate({ _id: _id }, // Query by the product's ID
                    {
                        $set: {
                            name: name,
                            availability: availability,
                            images: images,
                            price: price,
                            category: category,
                            filterOption: filterOption,
                            "discount.discountState": discount === null || discount === void 0 ? void 0 : discount.discountState,
                            "discount.discountAmount": discount === null || discount === void 0 ? void 0 : discount.discountAmount,
                        },
                    }, { new: true, runValidators: true });
                    return updatedProduct;
                }
                return null; // If no product found, return null
            }
            catch (error) {
                console.error(`Failed to update product with id ${product._id}:`, error);
                return null; // Handle failure for individual products
            }
        }));
        // Wait for all update operations to complete
        const updatedProducts = yield Promise.all(updatePromises);
        response.status(200).json({
            message: "Products updated successfully",
            data: updatedProducts.filter(Boolean), // Filter out any null results from failed updates
        });
    }
    catch (error) {
        console.error("Error updating products:", error);
        response.status(500).json({
            message: "Failed to update products",
            error: error,
        });
    }
});
exports.default = UpdateProductDetails;
