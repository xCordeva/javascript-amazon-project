import { products } from "../data/products.js";
import { checkQuantity } from "../data/cart.js";

const trackingItem = JSON.parse(localStorage.getItem('trackingItem'))

let trackingHTML = '';

trackingItem.forEach((item) => {

    const matchingItem = products.find((product)=> product.id === item.productId)

    trackingHTML = `
    <div class="delivery-date">
    Arriving on ${item.deliveryDay}
    </div>

    <div class="product-info">
    ${matchingItem.name}
    </div>

    <div class="product-info">
    Quantity: ${item.quantity}
    </div>

    <img class="product-image" src="${matchingItem.image}">

    <div class="progress-labels-container">
    <div class="progress-label">
    Preparing
    </div>
    <div class="progress-label current-status">
    Shipped
    </div>
    <div class="progress-label">
    Delivered
    </div>
    </div>

    <div class="progress-bar-container">
    <div class="progress-bar"></div>
    </div>
`
});



document.querySelector('.tracking-container').innerHTML = trackingHTML

// showing cart quantity in the icon 
const totalCartQuantity = checkQuantity()
document.querySelector('.js-cart-quantity').innerHTML= `${totalCartQuantity}`