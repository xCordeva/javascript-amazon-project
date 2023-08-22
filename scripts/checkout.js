import { products } from "../data/products.js";
import { cart, removeFromCart, checkQuantity,updateQuantityBySave, checkCartPrice } from "../data/cart.js";


let checkoutHTML ='';

cart.forEach((cartItem)=>{
    const productId = cartItem.productId;
    let matchingItem;
    
    products.forEach((product)=>{
        if(product.id === productId){
            matchingItem = product
        }
    })
    checkCartPrice()

    checkoutHTML+= `
        <div class="cart-item-container js-container-${matchingItem.id}">
            <div class="delivery-date">
            Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
            <img class="product-image"
                src="${matchingItem.image}">

            <div class="cart-item-details">
                <div class="product-name">
                ${matchingItem.name}
                </div>
                <div class="product-price">
                $${(matchingItem.priceCents /100).toFixed(2)}
                </div>
                <div class="product-quantity">
                <span>
                    Quantity: <span class="quantity-label js-quantity-span js-quantity-span-${matchingItem.id}">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-button js-update-button-${matchingItem.id}" data-product-id="${matchingItem.id}">
                    Update
                </span>
                <input class= "alt-quantity js-quantity-button-${matchingItem.id}" type="number" id="quantity" name="quantity" min="1" max="10">
                <span class="save-quantity-link link-primary js-save-button-${matchingItem.id}">
                    Save
                </span>
                <span class="delete-quantity-link link-primary js-delete-button" data-product-id="${matchingItem.id}">
                    Delete
                </span>
                </div>
            </div>

            <div class="delivery-options">
                <div class="delivery-options-title">
                Choose a delivery option:
                </div>
                <div class="delivery-option">
                <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingItem.id}">
                <div>
                    <div class="delivery-option-date">
                    Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                    FREE Shipping
                    </div>
                </div>
                </div>
                <div class="delivery-option">
                <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingItem.id}">
                <div>
                    <div class="delivery-option-date">
                    Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                    $4.99 - Shipping
                    </div>
                </div>
                </div>
                <div class="delivery-option">
                <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingItem.id}">
                <div>
                    <div class="delivery-option-date">
                    Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                    $9.99 - Shipping
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    `
})
if (cart.length !=0){
    document.querySelector('.order-summary').innerHTML= checkoutHTML
    document.querySelectorAll(`.js-delete-button`)
        .forEach((link) => {
            link.addEventListener('click', ()=>{
                const {productId} = link.dataset
                removeFromCart(productId)
                const container = document.querySelector(`.js-container-${productId}`)
                container.remove()
            })
        })
}else{
    emptyCartMessage()
}
function emptyCartMessage(){
    const emptyCart = document.querySelector('.js-cart-empty')
    emptyCart.style.display = 'block';
}



document.querySelectorAll('.js-update-button').forEach((link)=>{
    link.addEventListener('click', ()=>{
        const {productId} = link.dataset
        const saveButton = document.querySelector(`.js-save-button-${productId}`)
        const newQuantity = document.querySelector(`.js-quantity-button-${productId}`)
        const updateButton = document.querySelector(`.js-update-button-${productId}`)
        const quantitySpan = document.querySelector(`.js-quantity-span-${productId}`)
        updateButton.style.display = 'none';
        quantitySpan.style.display = 'none';
        saveButton.style.display = 'inline';
        newQuantity.style.display = 'inline';


        saveButton.addEventListener('click', ()=>{
            
            const newQuantityValue = Number(newQuantity.value)
            if (newQuantityValue <=0){
                alert('Quantity is not Valid, please choose a number above 0');
                return;
            }
            updateQuantityBySave(productId, newQuantityValue)
            quantitySpan.innerHTML = `${newQuantityValue}`
            updateButton.style.display = 'inline';
            quantitySpan.style.display = 'inline';
            saveButton.style.display = 'none';
            newQuantity.style.display = 'none';
        })
        const handleEnterKey = (event) => {
            if (event.key === 'Enter') {
                const newQuantityValue = Number(newQuantity.value);
                updateQuantityBySave(productId, newQuantityValue);
                quantitySpan.innerHTML = `${newQuantityValue}`;
                updateButton.style.display = 'inline';
                quantitySpan.style.display = 'inline';
                saveButton.style.display = 'none';
                newQuantity.style.display = 'none';
                document.removeEventListener('keydown', handleEnterKey);
            }
        };
        document.addEventListener('keydown', handleEnterKey);
    })
    
})
    
const totalCartQuantity = checkQuantity()
document.querySelector('.return-to-home-link').innerHTML= `${totalCartQuantity} items`
document.querySelector('.js-order-summary-items').innerHTML= totalCartQuantity
const totalCartPrice = checkCartPrice()
document.querySelector('.js-items-price').innerHTML = `$${totalCartPrice}`