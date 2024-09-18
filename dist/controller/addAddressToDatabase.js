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
const AddAddressToDatabase = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { name, surname, address, apartment, city, country, province, postalCode, phoneNumber, setDefault } = request.body;
    let updated = false;
    let newAddressArray = [];
    let updatedPosition = 0;
    let addressArray = [];
    const addressObject = yield address_schema_1.addressModel.findOne({ email: (_a = request.session.userData) === null || _a === void 0 ? void 0 : _a.userEmail });
    try {
        const addressData = {
            name,
            surname,
            address,
            apartment,
            city,
            country,
            province,
            postalCode,
            phoneNumber,
            setDefault,
        };
        if (addressObject) {
            //map for checking if the address being used is the same
            const updatedAddress = addressObject.addressDetails.map((address, index) => {
                if (address.phoneNumber === addressData.phoneNumber) {
                    updated = true;
                    updatedPosition = index;
                    return addressData;
                }
                return address;
            });
            //function for setting all to false and the right one to true
            const setFalseAndTrue = (position) => {
                if (addressData.setDefault.toLowerCase() === 'true') {
                    newAddressArray = addressArray.map((address, index) => {
                        if (index === position) {
                            return Object.assign(Object.assign({}, address), { setDefault: true }); // Set the selected address to true
                        }
                        else {
                            return Object.assign(Object.assign({}, address), { setDefault: false }); // Set all other addresses to false
                        }
                    });
                }
                else {
                    newAddressArray = addressArray;
                }
            };
            if (updated) {
                addressArray = updatedAddress;
                setFalseAndTrue(updatedPosition);
            }
            else {
                addressArray = [...addressObject.addressDetails, addressData];
                setFalseAndTrue(addressArray.length - 1);
            }
            const updateAddress = yield addressObject.updateOne({ addressDetails: newAddressArray });
            response.status(200).send({ message: 'Address successfully saved' });
        }
        else {
            const saveAddressDetails = new address_schema_1.addressModel({
                email: (_b = request.session.userData) === null || _b === void 0 ? void 0 : _b.userEmail,
                addressDetails: [
                    addressData
                ]
            });
            saveAddressDetails.save();
            response.status(200).send({ message: 'Address successfully saved' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error saving data:', error.message);
            response.status(500).send({ error: error.message });
        }
        else {
            console.error('Unexpected error:', error);
            response.status(500).send({ error: 'Unexpected error' });
        }
    }
});
exports.default = AddAddressToDatabase;
