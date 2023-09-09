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
        <div class="progress-label-preparing current-status">
            Preparing
        </div>
        <div class="progress-label-shipped">
            Shipped
        </div>
        <div class="progress-label-delivered">
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

// making the tracking bar active
const progressBar = document.querySelector('.progress-bar')

const preparingStatus = document.querySelector('.progress-label-preparing')
const shippedStatus = document.querySelector('.progress-label-shipped')
const deliveredStatus = document.querySelector('.progress-label-delivered')

// adding todays date to use in claculating width
const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

// days unitl delivery calculated based on what today is
const daysUntilDelivery = (new Date(trackingItem[0].deliveryDay) - new Date(today)) / (1000 * 60 * 60 * 24);

// days to delivery calculated based on what day the order was made
const totalDaysToDelivery = (new Date(trackingItem[0].deliveryDay) - new Date(trackingItem[0].orderDate)) / (1000 * 60 * 60 * 24);


const progressPercentage = ((totalDaysToDelivery - daysUntilDelivery) / totalDaysToDelivery) * 100;

// statements to change the width of the bar with the percentage & to change the color of the status based on that width
if(progressPercentage === 0){

    progressBar.style.width = `10%`

}
else if(progressPercentage >= 50 && progressPercentage < 100){

    preparingStatus.classList.remove('current-status')
    shippedStatus.classList.add('current-status')
    progressBar.style.width = `${progressPercentage}%`

}
else if(progressPercentage === 100){

    preparingStatus.classList.remove('current-status')
    shippedStatus.classList.remove('current-status')
    deliveredStatus.classList.add('current-status')
    progressBar.style.width = `${progressPercentage}%`

}