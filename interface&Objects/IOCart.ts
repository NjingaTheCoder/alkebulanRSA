export interface ICart{
    products_in_the_cart: string[],
    quantities: number[],
    total_price: number

}

export const OCart : ICart = {

    products_in_the_cart : [],
    quantities : [],
    total_price: 0.00,
}