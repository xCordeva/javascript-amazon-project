export let cart = [];

export function addToCart(productId){
    let matchingItem;
        const quantitySelect  = document.querySelector(`.js-quantity-selector-${productId}`);
        let quantity = Number(quantitySelect.value);
        cart.forEach((item)=>{
            if(productId === item.productId){
                matchingItem = item;
            }
        }) 
        if (matchingItem){
            matchingItem.quantity += quantity
        }else {
            cart.push({
                productId,
                quantity
            })
        }
}