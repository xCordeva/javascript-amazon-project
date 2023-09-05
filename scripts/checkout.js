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
                    name="delivery-option-${matchingItem.id}"
                    class="delivery-option-input"
                    id="option1-${matchingItem.id}"
                    data-shipping-cost="0"
                    data-product-id="${matchingItem.id}"
                    data-delivery-date="Tuesday, June 21">
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
                    name="delivery-option-${matchingItem.id}"
                    class="delivery-option-input"
                    id="option2-${matchingItem.id}"
                    data-shipping-cost="499"
                    data-product-id="${matchingItem.id}"
                    data-delivery-date="Wednesday, June 15">
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
                    name="delivery-option-${matchingItem.id}"
                    class="delivery-option-input"
                    id="option3-${matchingItem.id}"
                    data-shipping-cost="999"
                    data-product-id="${matchingItem.id}"
                    data-delivery-date="Monday, June 13">
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


/*function to check & return the last item in an array  */
function isLastItem(arr, item){
    const lastIndex = arr.length - 1;
    return arr.indexOf(item) === lastIndex
}

if (cart.length !=0){
    document.querySelector('.order-summary-cart-items').innerHTML= checkoutHTML
    document.querySelectorAll(`.js-delete-button`)
        .forEach((link) => {
            link.addEventListener('click', (item)=>{
                const {productId} = link.dataset
                removeFromCart(productId)
                const container = document.querySelector(`.js-container-${productId}`)
                container.remove()
                updatingPage()
                removeShippingCost(productId)
                /*checking if its the last item on the cart to display the message after removing it*/
                if(isLastItem(cart, item)){
                    emptyCartMessage()
                    updatingPage()
                }

            });
        });
}else{
    emptyCartMessage()
}

function emptyCartMessage(){
    const emptyCart = document.querySelector('.js-cart-empty')
    emptyCart.style.display = 'block';
}


const shippingCosts = {};

/* function to remove the shipping cost when removing an item from cart*/
function removeShippingCost(productId) {
    const storedShippingCost = shippingCosts[productId] || 0; // Get the stored shipping cost
    const totalShipping = parseInt(localStorage.getItem('shipping')) || 0;

    // Update the total shipping by subtracting the stored shipping cost
    const newTotalShipping = totalShipping - storedShippingCost;
    localStorage.setItem('shipping', newTotalShipping);
    document.querySelector('.js-shipping-price').innerHTML = `$${newTotalShipping / 100}`;
    // Remove the shipping cost entry for the product
    delete shippingCosts[productId];
    //delete the stored radio option
    localStorage.removeItem(`selected-${productId}`)
}


document.querySelectorAll('.delivery-option-input').forEach((input) => {
    input.addEventListener('change', () => {
        let { productId } = input.dataset;
        cart.forEach((item)=>{
            if(item.productId === productId){
                
                const shippingCost = parseInt(input.getAttribute('data-shipping-cost'), 10);
                

                if (input.checked) {
                    
                    if (shippingCosts[productId] !== shippingCost) {  // Check if the option has changed
                        const previousShippingCost = shippingCosts[productId] || 0;  // Get the previous cost
                        shippingCosts[productId] = shippingCost;
        
                        let totalShipping = parseInt(localStorage.getItem('shipping')) || 0;
                        totalShipping = totalShipping - previousShippingCost + shippingCost;
                        
                        document.querySelector('.js-shipping-price').innerHTML = `$${totalShipping / 100}`;
                        localStorage.setItem('shipping', totalShipping);
                        localStorage.setItem(`selected-${productId}`, input.id);
                        
                        changeDeliveryDate(input)
                        taxlessCalculationDsiplay()
                        taxCalculationDsiplay()
                        totalCost()
                    }
                } 
            }
            
        })
        
    });
});

// function to change the delivery date text for each item
function changeDeliveryDate(input){
    const deliveryDay = input.getAttribute('data-delivery-date')
    const parentContainer = input.closest('.cart-item-container');
    if(parentContainer){
        const deliveryDateElement = parentContainer.querySelector('.delivery-date')
        if(deliveryDateElement){
            deliveryDateElement.innerHTML = `Delivery date: ${deliveryDay}`
        }
    }
}



/* function to calculate and show the total without tax*/
function taxlessCalculationDsiplay(){
    const totalCartPrice = checkCartPrice()
    const shippingValue = localStorage.getItem('shipping');
    const formattedShippingValue = parseFloat(shippingValue) / 100;    
    const totalPriceWithShipping = (formattedShippingValue + parseFloat(totalCartPrice)).toFixed(2);
    document.querySelector('.js-total-before-tax').innerHTML = `$${totalPriceWithShipping}`
}

/* function to calculate and show the total including tax*/
function taxCalculationDsiplay(){
    const totalCartPrice = checkCartPrice()
    const shippingValue = localStorage.getItem('shipping');
    const formattedShippingValue = parseFloat(shippingValue) / 100;    
    const totalPriceWithShipping = (formattedShippingValue + parseFloat(totalCartPrice)).toFixed(2);
    const totalTax = (totalPriceWithShipping *0.1).toFixed(2)
    document.querySelector('.js-total-after-tax').innerHTML = `$${totalTax}`
}
/* function to calculate and show the order's total cost*/
function totalCost(){
    const totalCartPrice = checkCartPrice()
    const shippingValue = localStorage.getItem('shipping');
    const formattedShippingValue = parseFloat(shippingValue) / 100;    
    const totalPriceWithShipping = (formattedShippingValue + parseFloat(totalCartPrice)).toFixed(2);
    const totalTax = (totalPriceWithShipping *0.1).toFixed(2)
    document.querySelector('.js-total-order-cost').innerHTML = `$${(Number(totalTax) + Number(totalPriceWithShipping)).toFixed(2)}`
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
                       
            updatingPage()
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
                
                updatingPage()
            }
        };
        document.addEventListener('keydown', handleEnterKey);
    })
    
})



const checkBoxButton = document.querySelector('.paypal-checkbox')
const placeOrderButton = document.querySelector('.place-order-button')
const paymentOptionsSection = document.querySelector('.payment-options')

checkBoxButton.addEventListener('click', ()=>{
    if(checkBoxButton.checked){
        paymentOptionsSection.style.display = 'inline';
        placeOrderButton.style.display = 'none';
    }else{
        paymentOptionsSection.style.display = 'none';
        placeOrderButton.style.display = 'inline';
    }
    
})



/*function to update the page immediatly after actions*/
function updatingPage(){
    const totalCartQuantity = checkQuantity()
    document.querySelector('.return-to-home-link').innerHTML= `${totalCartQuantity} items`
    document.querySelector('.js-order-summary-items').innerHTML= totalCartQuantity
    const totalCartPrice = checkCartPrice()
    document.querySelector('.js-items-price').innerHTML = `$${totalCartPrice}`

    document.querySelector('.js-shipping-price').innerHTML = `$${localStorage.getItem('shipping') /100}`

    taxlessCalculationDsiplay()
    taxCalculationDsiplay()
    totalCost()
    
/* restoring the saved radio option*/
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.delivery-option-input').forEach((input) => {
            const { productId } = input.dataset;
            const storedOptionId = localStorage.getItem(`selected-${productId}`);
            
            if (storedOptionId === input.id) {
                input.checked = true;
                const storedShippingCost = parseInt(input.getAttribute('data-shipping-cost'), 10);
                shippingCosts[productId]= storedShippingCost
                changeDeliveryDate(input)
            }

        });
    });
}

updatingPage()