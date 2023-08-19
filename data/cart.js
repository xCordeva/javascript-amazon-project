export let cart = [{
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity:2
},
];

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