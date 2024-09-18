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
const address_schema_1 = require("../model/address_schema");
const DeleteAddressFromDatabaseController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { phoneNumber } = request.body;
    const isAuth = ((_a = request.session.userData) === null || _a === void 0 ? void 0 : _a.isAuthenticated) || false;
    if (isAuth) {
        try {
            const addressObject = yield address_schema_1.addressModel.findOne({ email: (_b = request.session.userData) === null || _b === void 0 ? void 0 : _b.userEmail });
            if (addressObject) {
                // Find the index of the address to remove
                const addressIndex = addressObject.addressDetails.findIndex(address => address.phoneNumber === phoneNumber);
                if (addressIndex !== -1) {
                    // Remove the address from the array
                    addressObject.addressDetails.splice(addressIndex, 1);
                    // Save the updated address list back to the database
                    yield addressObject.save();
                    return response.status(200).send({
                        message: 'Address deleted successfully',
                        updatedAddressList: addressObject.addressDetails
                    });
                }
                else {
                    return response.status(404).send({ message: 'Address not found' });
                }
            }
            else {
                return response.status(404).send({ message: 'User has no addresses' });
            }
        }
        catch (error) {
            console.error('Error deleting address:', error);
            return response.status(500).send({ message: 'An error occurred while deleting the address' });
        }
    }
    else {
        return response.status(401).send({ message: 'User is not authenticated' });
    }
});
exports.default = DeleteAddressFromDatabaseController;
