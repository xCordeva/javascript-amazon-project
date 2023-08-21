export let cart = JSON.parse(localStorage.getItem('cart'));
if(!cart){
    cart=[]
}

function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart))
    localStorage.setItem('cartNum', JSON.stringify(cart.quantity))
}

export function removeFromCart(productId) {
    let newCart=[]
    cart.forEach((item)=>{
        if(item.productId !== productId){
            newCart.push(item)       
        }
    })
    cart = newCart;
    saveToStorage();
    checkQuantity()
}

export function checkQuantity(){
    let totalCartQuantity=0;
    cart.forEach((item)=>{
        totalCartQuantity+= item.quantity        
    });
    localStorage.setItem('cartNum', totalCartQuantity);
    return totalCartQuantity
}


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
        }saveToStorage()
}