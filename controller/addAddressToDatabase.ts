import { Request , Response } from "express";
import { addressModel } from '../model/address_schema';


const AddAddressToDatabase = async (request : Request , response : Response) => {

    
    const {name , surname , address , apartment ,  city , country , province , postalCode , phoneNumber, setDefault} = request.body;
    
    let updated = false;
    let newAddressArray : Array<{}> = [] ;
    let updatedPosition = 0;
    let addressArray : Array<{}> = [] ;
    const addressObject = await addressModel.findOne({email :  request.session.userData?.userEmail});

    try{

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

        if(addressObject){




            //map for checking if the address being used is the same
            const updatedAddress = addressObject.addressDetails.map((address , index) => {


                if(address.phoneNumber === addressData.phoneNumber){


                    updated = true;
                    updatedPosition = index;
                    return addressData;
                }

                return address;
                
        });

        //function for setting all to false and the right one to true
        const  setFalseAndTrue = (position : number) => {
            if(addressData.setDefault.toLowerCase() === 'true'){
               newAddressArray =  addressArray.map((address , index) => {
                    if (index === position) {
                        return { ...address, setDefault: true };  // Set the selected address to true
                    } else {
                        return { ...address, setDefault: false };  // Set all other addresses to false
                    }
                });
            }else{
                newAddressArray =  addressArray;
            }
        }

        if(updated){
            addressArray = updatedAddress;
            setFalseAndTrue(updatedPosition);
        }else{

            addressArray = [...addressObject.addressDetails , addressData];
            setFalseAndTrue(addressArray.length - 1);
        }

        
        const updateAddress = await addressObject.updateOne({addressDetails : newAddressArray})
      
            response.status(200).send({ message: 'Address successfully saved' });

        }else{
            const saveAddressDetails = new addressModel({
                email :  request.session.userData?.userEmail,
                addressDetails : [
                    addressData
                ]
            })

            saveAddressDetails.save();
            response.status(200).send({ message: 'Address successfully saved' });
        }
    }catch (error){

        if (error instanceof Error) {

            console.error('Error saving data:', error.message);
            response.status(500).send({ error: error.message });
          } else {

            console.error('Unexpected error:', error);
            response.status(500).send({ error: 'Unexpected error' });
          }
    }


}

export default AddAddressToDatabase;
