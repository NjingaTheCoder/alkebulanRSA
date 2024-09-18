import { Request , Response } from "express";
import { addressModel } from '../model/address_schema';

const DeleteAddressFromDatabaseController = async ( request : Request , response : Response) => {

    const { phoneNumber } = request.body;
    const isAuth = request.session.userData?.isAuthenticated || false;

    if (isAuth) {
        try {
            const addressObject = await addressModel.findOne({ email: request.session.userData?.userEmail });

            if (addressObject) {
                // Find the index of the address to remove
                const addressIndex = addressObject.addressDetails.findIndex(address => address.phoneNumber === phoneNumber);

                if (addressIndex !== -1) {
                    // Remove the address from the array
                    addressObject.addressDetails.splice(addressIndex, 1);

                    // Save the updated address list back to the database
                    await addressObject.save();

                    return response.status(200).send({
                        message: 'Address deleted successfully',
                        updatedAddressList: addressObject.addressDetails
                    });
                } else {
                    return response.status(404).send({ message: 'Address not found' });
                }
            } else {
                return response.status(404).send({ message: 'User has no addresses' });
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            return response.status(500).send({ message: 'An error occurred while deleting the address' });
        }
    } else {
        return response.status(401).send({ message: 'User is not authenticated' });
    }
}

export default DeleteAddressFromDatabaseController;
