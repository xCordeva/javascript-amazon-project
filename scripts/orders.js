import { products } from "../data/products.js";
import { checkQuantity,reAddToCart } from "./cart.js";
import { orders } from "./checkout.js";


const ordersGrid = document.querySelector('.orders-grid');


orders.forEach((order, orderIndex)=>{

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
                <button class="buy-again-button button-primary" data-product-id="${matchingItem.id}">
                    <div class="buy-again js-buy-again">
                        <img class="buy-again-icon" src="images/icons/buy-again.png">
                        <span class="buy-again-message">Buy it again</span>
                    </div>
                    <span class="buy-again-success js-buy-again-success">
                        ✓ Added
                    </span>
                </button>
            </div>

            <div class="product-actions">
                <a href="tracking.html">
                    <button class="track-package-button button-secondary" data-product-id="${matchingItem.id}">
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


const buyAgainButton = document.querySelectorAll('.buy-again-button')
buyAgainButton.forEach((button)=>{
    button.addEventListener('click', (event)=>{

        const productId = event.currentTarget.getAttribute('data-product-id');
        buyAgain(productId, button)

    })
})


function buyAgain(productId, button){
    const orderContainer = button.closest('.order-container')
    if(orderContainer){
        const currentOrderIndex = Array.from(ordersGrid.querySelectorAll('.order-container')).indexOf(orderContainer)
        if(currentOrderIndex !== -1){
            
            const order = orders[currentOrderIndex]
 
            const selectedItem = order.orderCart.find((item)=> item.productId === productId)

            const quantity = selectedItem.quantity

            reAddToCart(productId, quantity)

            addIcon(button)

            //Update the cart quantity after adding buyAgain action
            iconCartQuantity()
        }
    }
}

// function to change text on button from buy again to added when an item is clicked

function addIcon(button) {
    const removeBuyAgain = button.querySelector('.js-buy-again');
    const added = button.querySelector('.js-buy-again-success');
    added.style.display = 'block';
    removeBuyAgain.style.display = 'none';
    startIconTimeout(added, removeBuyAgain);
}

// a seprate function to restart the timer every time the button is clicked
let addedIconTimeId;
function startIconTimeout(added, removeBuyAgain) {
    clearTimeout(addedIconTimeId);
    added.style.display = 'block';
    removeBuyAgain.style.display = 'none';
    addedIconTimeId = setTimeout(() => {
        added.style.display = 'none';
        removeBuyAgain.style.display = 'flex';
    }, 1000);
}


// tracking button functionality

let trackingItem= JSON.parse(localStorage.getItem('trackingItem')) || []
const trackingPackageButton = document.querySelectorAll('.track-package-button')
trackingPackageButton.forEach((button)=>{
    button.addEventListener('click', (event)=>{
        let trackingItem= []
        const productId = event.currentTarget.getAttribute('data-product-id');
        const orderContainer = button.closest('.order-container')
        if(orderContainer){
            const currentOrderIndex = Array.from(ordersGrid.querySelectorAll('.order-container')).indexOf(orderContainer)
            if(currentOrderIndex !== -1){
                
                const order = orders[currentOrderIndex]

                const selectedItem = order.orderCart.find((item)=> item.productId === productId) 

                const selectedItemDeliveryDay = order.deliveryDates.find((item)=> item.Id.substring(8) === productId).deliveryDay 
                trackingItem.push({
                    'productId': selectedItem.productId,
                    'quantity': selectedItem.quantity,
                    'deliveryDay': selectedItemDeliveryDay,
                    'orderDate': order.orderDate
                } )

                localStorage.setItem('trackingItem',JSON.stringify(trackingItem))
            }
        }
    })
})


// showing cart quantity in the icon 
function iconCartQuantity(){
    const totalCartQuantity = checkQuantity()
    document.querySelector('.js-cart-quantity').innerHTML= `${totalCartQuantity}`
}
iconCartQuantity()