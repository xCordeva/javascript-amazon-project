import { addToCart,checkQuantity,checkCartPrice } from '../data/cart.js';
import { products } from '../data/products.js';


let productsHTML= '';

products.forEach((product)=>{
    productsHTML += `
        <div class="product-container" data-product-id="${product.id}">
            <div class="product-image-container">
            <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
            ${product.name}
            </div>

            <div class="product-rating-container">
            <img class="product-rating-stars"
                src="images/ratings/rating-${product.rating.stars *10}.png">
            <div class="product-rating-count link-primary">
            ${product.rating.count}
            </div>
            </div>

            <div class="product-price">
            $${(product.priceCents /100).toFixed(2)}
            </div>

            <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
            </div>

            <div class="product-spacer"></div>

            <div class="added-to-cart js-added-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
            </div>

            <button class="add-to-cart-button button-primary js-add-cart" data-product-id="${product.id}">
            Add to Cart
            </button>
        </div>`
})

let storedQuantity = parseInt(localStorage.getItem('cartNum'))
document.querySelector('.js-cart-quantity').innerHTML = storedQuantity;


export function updateCartQuantity(){
    storedQuantity = checkQuantity()
    document.querySelector('.js-cart-quantity').innerHTML = storedQuantity;
    return storedQuantity;
}


function startIconTimeout(addedIcon){
    clearTimeout(addedIconTimeId)
    addedIcon.style.opacity = '1';
    addedIconTimeId = setTimeout(()=>{
        addedIcon.style.opacity = '0';
        
    }, 1000)
} 


let addedIconTimeId;

document.querySelector('.js-product-grid').innerHTML= productsHTML;

document.querySelectorAll('.js-add-cart').forEach((button)=>{
    button.addEventListener('click', ()=>{
        
        const {productId} = button.dataset;
        const addedIcon = document.querySelector(`.js-added-${productId}`);
        addedIcon.style.opacity = '1';
        startIconTimeout(addedIcon)

        addToCart(productId)
        updateCartQuantity()
        checkCartPrice(productId)
    })
})


let searchInput = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');

// search when the search icon is clicked
searchButton.addEventListener('click', ()=>{
    search()
});
// search when enter key is clicked
searchInput.addEventListener('keydown', (event)=>{
    if(event.key === 'Enter'){
        search()
    }
});
// search when any key is typed in search bar this option makes the other two options useless now
searchInput.addEventListener('input', ()=>{
    search()
});

// function to perform the search by hiding all items that doesnt match the user search phrases
function search(){
    const searchPhrase = searchInput.value.trim().toLowerCase();

    //array to store product IDs that match the search phrase
    const matchingProductIds = [];

    products.forEach((product)=>{
      // Ensure product.keywords is defined and an array before using filter
      if(Array.isArray(product.keywords)){
        const matchingKeywords = product.keywords.filter((item)=>    item.toLowerCase().includes(searchPhrase)
        );

        if(matchingKeywords.length > 0){
            matchingProductIds.push(product.id);
        }
      }
    });

    // hide or show elements based on the matching IDs
    document.querySelectorAll('.product-container').forEach((element)=> {
      const productId = element.getAttribute('data-product-id');

      if(matchingProductIds.includes(productId)){
        element.classList.remove('hide-item');
      }else{
        element.classList.add('hide-item');
      }
    });
}