import { products } from "../data/products.js";

export let cart = JSON.parse(localStorage.getItem('cart'));
if(!cart){
    cart=[]
}

function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart))
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

export function reAddToCart(productId, quantity){
    let matchingItem;

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

export function checkQuantity(){
    let totalCartQuantity=0;
    cart.forEach((item)=>{
        totalCartQuantity+= item.quantity        
    });
    localStorage.setItem('cartNum', totalCartQuantity);
    
    return totalCartQuantity
}

export function checkCartPrice(){
    let totalCartPrice = 0;
    cart.forEach((item)=>{
        const productId = item.productId
        const matchingItem = products.find((product) => productId === product.id);
        if (matchingItem)
            {
                totalCartPrice+= matchingItem.priceCents*item.quantity /100
            }
        });
        return totalCartPrice.toFixed(2);
}

export function updateQuantityBySave(productId, newQuantityValue){
    let matchingItems;
    cart.forEach((item)=>{
        if(item.productId === productId){
            matchingItems = item;
        }
        
    })
    matchingItems.quantity = newQuantityValue
    saveToStorage()
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
    checkQuantity();    
}

export function clearCart(){
    cart = [];
    saveToStorage();
    checkQuantity(); 
}