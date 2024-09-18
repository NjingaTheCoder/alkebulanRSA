"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productShema = new mongoose_1.default.Schema({}, {
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    account_creation_date: {
        type: String,
        required: true
    },
    last_logged_in: {
        type: String,
        require: true
    },
    cart: {
        type: cartSchema,
        require: false
    }
});
1198.00,
;
"ZAR",
; // South African Rand
"Diffusers",
;
{
    shortDescription: "Artistry Meets Technology",
        longDescription;
    "Our latest diffuser merges the artisanal quality of a fine ceramic glazed shell with powerful nebulizing technology that can scent up to 1000 sq. ft. Experience a long-lasting, evenly distributed fragrance experience with this innovative cold-air diffusion technology. The Ambience disperses scents using filtered air rather than water or heat. The result: a cleaner, more consistent scent experience.";
}
ratings: 4.8, // Assuming a 5-star rating system
    features;
[
    "Nebulizing technology delivers pure, consistent home fragrance that doesn’t fade",
    "Ambient lighting feature",
    "Adjust scent intensity and create schedules using the AromaTech App"
],
    sizeAndCapacity;
{
    "coverageArea";
    "100 to 1000 sq. ft.",
        "ambientLighting";
    true;
}
images: [
    "url_to_image_1.jpg",
    "url_to_image_2.jpg"
],
    availability;
true, // Whether the product is in stock
    "createdAt";
"2024-08-15T00:00:00Z", // Date of entry
    "updatedAt";
"2024-08-15T00:00:00Z"; // Last update timestamp
;
