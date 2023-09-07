import { products } from "../data/products.js";
import { checkQuantity } from "../data/cart.js";
import { orders } from "./checkout.js";


const ordersGrid = document.querySelector('.orders-grid');

orders.forEach((order)=>{

  const orderHTML = [];

  order.orderCart.forEach((cartItem)=>{

    const productId = cartItem.productId;
    const matchingItem = products.find((product) => product.id === productId);
    
    if(matchingItem){
      
      const addDeliveryDate = order.deliveryDates.find((date)=> date.Id.substring(8) === matchingItem.id)
      
      matchingItem.deliveryDay = addDeliveryDate.deliveryDay
    }

    orderHTML.push(`
            
            <div class="product-image-container">
                <img src="${matchingItem.image}">
            </div>

            <div class="product-details">
                <div class="product-name">
                    ${matchingItem.name}
                </div>
                <div class="product-delivery-date">
                    Arriving on: ${matchingItem.deliveryDay}
                </div>
                <div class="product-quantity">
                    Quantity: ${cartItem.quantity}
                </div>
                <button class="buy-again-button button-primary">
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                </button>
            </div>

            <div class="product-actions">
                <a href="tracking.html">
                    <button class="track-package-button button-secondary">
                        Track package
                    </button>
                </a>
            </div>

        `);
    });

    const orderHeaderHTML = `
            <div class="order-container">
            <div class="order-header">
                <div class="order-header-left-section">
                    <div class="order-date">
                        <div class="order-header-label">Order Placed:</div>
                        <div>${order.orderDate}</div>
                    </div>
                    <div class="order-total">
                    <div class="order-header-label">Total:</div>
                    <div>$${order.totalOrderCost}</div>
                    </div>
                </div>
                <div class="order-header-right-section">
                    <div class="order-header-label">Order ID:</div>
                    <div>b6b6c212-d30e-4d4a-805d-90b52ce6b37d</div>
                </div>
            </div>

    `;
    // generating html content into orders-grid each order has one header
    // added the div this way because it was much easier 
    ordersGrid.innerHTML += orderHeaderHTML +`<div class="order-details-grid">` +  orderHTML.join('') + `</div>` +`</div>`
})

// showing cart quantity in the icon 
const totalCartQuantity = checkQuantity()
document.querySelector('.js-cart-quantity').innerHTML= `${totalCartQuantity}`

