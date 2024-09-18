import mongoose from "mongoose"

interface IDescription{


    shortDescription: string,
      longDescription:string
}

interface ISizeAndCapacity{
    coverageArea: string,
    specialFeature: string
}

interface IDiscount {
    discountState: {
        type: boolean
    },
    discountAmount: {
        type: number
    }
}

export interface IProduct{


    _id : mongoose.Schema.Types.ObjectId,
    name : string,
    price : number,
    currency : string,
    category : string,
    model : string,
    filterOption : string,
    description : IDescription,
    features:string[],
    ratings:number[],
    sizeAndCapacity: ISizeAndCapacity,
    images :string,
    availability: number,
    discount : IDiscount
}







