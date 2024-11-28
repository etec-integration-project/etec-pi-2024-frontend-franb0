document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

const baseUrl = '/api';

function fetchProducts() {
    fetch(`${baseUrl}/products`) // Fixed missing backticks
        .then(response => response.json())
        .then(products => {
            const productsDiv = document.getElementById("product-list");

            products.forEach(product => {
                getProductRating(product.id).then(rating => {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');
    
                    productDiv.innerHTML = `
                        <img src="${product.image_url}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>Price: $${product.price.toFixed(2)}</p>
                        <p>Rating: ${rating}⭐</p>
                        <div class="options">
                            <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
                            <button onclick="addRating('${product.id}', '${product.name}')">Rate Product</button>
                        </div>
                    `; // Fixed missing backticks and corrected string formatting
    
                    productsDiv.appendChild(productDiv);
                });
            });
        })
        .catch(error => alert(error));
}

function fetchCartProducts(cartID) {
    fetch(`${baseUrl}/products`) // Fixed missing backticks
        .then(response => response.json())
        .then(products => {
            const productsDiv = document.getElementById(`dialog-list-${cartID}`);

            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');

                productDiv.innerHTML = `
                    <img src="${product.image_url}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <div class="options">
                        <button onclick="addToDialogCart('cartForm-${cartID}', '${JSON.stringify(product).replace(/"/g, '&quot;')}')">Add to Cart</button>
                    </div>
                `; // Fixed missing backticks and corrected string formatting

                productsDiv.appendChild(productDiv);
            });
        })
        .catch(error => alert(error));
}

function addToDialogCart(formID, productString) {
    const cartForm = document.getElementById(formID);
    const cartLabel = cartForm.querySelectorAll('label');
    const product = JSON.parse(productString);

    let hasText = Array.from(cartLabel).some(element => 
        element.textContent.includes(product.name)
    );

    if (hasText) {
        const cartInput = cartForm.getElementById(`${formID}-${product.name.replace(/\s+/g, '_')}`);

        console.log(cartInput);

        cartInput.value = cartInput.value + 1;
    } else {
        const newDiv = document.createElement('div');

        newDiv.innerHTML = `
            <label for="${product.name}">${product.name} - $${product.price}</label>
            <span>Quantity:</span>
            <input type="number" value="1" id="${formID}-${product.name.replace(/\s+/g, '_')}" name="${product.name}" required>
            <br>`;

        cartForm.appendChild(newDiv);
    }
}

function getProductRating(id) {
    return fetch(`${baseUrl}/rating/${id}`) // Fixed missing backticks
        .then(response => response.json())
        .then(data => {
            if (data.rating) {
                return data.rating;
            } else {
                return 0;
            }
        })
        .catch(error => {
            alert(error);
            return 0;
        });
}

function addRating(productId, productName) {
    const rating = parseInt(prompt(`Please rate ${productName} from 1 to 5:`)); // Fixed missing backticks
    
    if (rating >= 1 && rating <= 5) {
        fetch(`${baseUrl}/rate/${productId}`, { // Fixed missing backticks
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating: rating })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                alert(data.error);
            }
        })
        .catch(error => alert(error));
    } else {
        alert("Invalid rating. Please enter a number between 1 and 5.");
    }
}

function openDialog(type) {
    const dialog = type === 'login' ? document.getElementById('loginDialog') : 
                   type === 'register' ? document.getElementById('registerDialog') : 
                   document.getElementById('supportDialog');
    dialog.showModal();
}

function closeDialog(type) {
    const dialog = type === 'login' ? document.getElementById('loginDialog') : 
                   type === 'register' ? document.getElementById('registerDialog') : 
                   document.getElementById('supportDialog');
    dialog.close();
}

function logout() {
    fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            location.reload();
        }
    })
    .catch(error => {
        console.error('Logout failed:', error);
    });
}

function openCartDialog(cartId) {
    const dialog = document.getElementById(cartId);
    dialog.showModal();
}

function closeCartDialog(cartId) {
    const dialog = document.getElementById(cartId);
    dialog.close();
}

function showCarts(userId) {
    fetch(`/api/carts/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {}
    })
        .then(response => response.json())
        .then(carts => {
            const cartsList = document.getElementById('cartsList');
            
            carts.forEach(cart => {
                console.log(cart);

                const cartLi = document.createElement('div');
                const cartDialog = document.createElement('dialog');
                cartDialog.setAttribute('id', `cart-${cart.id}`);
                cartDialog.style.minWidth = "50vw";

                cartLi.innerHTML = `
                    <hr>
                    <h3>Cart id: ${cart.id}</h3>
                    <p>Date of purchase: ${cart.date_time}</p>
                    <button class="auth-btn" onclick='openCartDialog("cart-${cart.id}")'>Edit</button>
                `;

                console.log("Cart items raw: ", cart.content);

                const cartItems = JSON.parse(cart.content);

                console.log("Cart items parsed: ", cartItems);

                cartDialog.innerHTML = `
                    <form id="cartForm-${cart.id}" onsubmit="submitCartForm('cartForm-${cart.id}', '${cart.id}')">
                        <h2>Purchase Details</h2>
                        
                        <button class="auth-btn" type="submit">Update</button>
                        <button class="auth-btn" type="button" onclick="closeCartDialog('cart-${cart.id}')">Cancel</button>

                        ${Object.entries(cartItems).map(([key, item]) => `
                            <div>
                                <label for="${item.name}">${item.name} - $${item.price}</label>
                                <span>Quantity:</span>
                                <input type="number" value="${item.quantity}" id="cartForm-${cart.id}-${item.name.replace(/\s+/g, '_')}" name="${item.name}" required>
                                <br>
                            </div>
                            `).join("")}
                    </form>
                    <div class="product-list" id="dialog-list-${cart.id}"></div>
                `;

                fetchCartProducts(cart.id);

                cartsList.appendChild(cartLi);
                cartsList.appendChild(cartDialog);
            });
        })
        .catch(error => {
            console.log("Error fetching carts: ", error)
        });
}

function submitCartForm(cartFormId, cartId) {
    event.preventDefault();
    const cartForm = document.getElementById(cartFormId);
    const cartLabels = cartForm.querySelectorAll('label');
    const formData = {};

    cartLabels.forEach((label, index) => {
        const textContent = label.textContent;
        const [productName, productPrice] = textContent.split(' - $');
        const cartInput = cartForm.querySelector(`#${cartFormId}-${productName.replace(/\s+/g, '_')}`);
        const price = parseInt(cartInput.value, 10);

        if (price > 0) {
            formData[index + 1] = {
                name: productName.trim(),
                price: parseFloat(productPrice.trim()),
                quantity: price
            };
        }
    });

    fetch(`/api/update-cart/${cartId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        alert(data.content);
    })
    .catch(error => {
        console.error('Error sending data:', error);
    });
}

function login() {
    fetch('/api/session-data')
        .then(response => response.json())
        .then(data => {
            const username = data.name;
            const userId = data.user_id;
            const userGreeting = document.getElementById('user-greeting');
            const greetingMessage = document.createElement('p');
            const logoutButton = document.createElement('button');
            const cartsDiv = document.getElementById('userCarts');
            cartsDiv.innerHTML = `
                <h2>Past purchases</h2>
                <div id="cartsList"></div>
            `;
            logoutButton.classList.add('auth-btn');
            logoutButton.textContent = 'Logout';
            logoutButton.addEventListener('click', logout);

            if (username) {
                greetingMessage.textContent = `${username}`; // Fixed missing backticks
            }

            showCarts(userId);

            userGreeting.appendChild(greetingMessage);
            userGreeting.appendChild(logoutButton);
        })
        .catch(error => {
            console.error("Error fetching session data:", error);
        });
}

function submitForm(type) {
    const form = type === 'login' ? document.getElementById('loginForm') : (type === 'register' ? document.getElementById('registerForm') : document.getElementById('supportForm'));
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    
    const endpoint = type === 'login' ? `${baseUrl}/login` : 
    type === 'register' ? `${baseUrl}/register` : 
    `${baseUrl}/support`;

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} successful: ${JSON.stringify(data)}`);
        closeDialog(type);
        if (type === 'login') {
            login();
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
}

function addToCart(productName, productPrice) {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    const listItem = document.createElement('li');
    listItem.classList.add('product-list-item');
    listItem.textContent = `${productName} - $${productPrice.toFixed(2)}`; // Fixed missing backticks

    cartItems.appendChild(listItem);

    const currentTotal = parseFloat(cartTotal.textContent) || 0; // Added fallback to 0
    const newTotal = currentTotal + productPrice;
    cartTotal.textContent = newTotal.toFixed(2);
}

function buyCart() {
    const products = {};
    const listItems = document.querySelectorAll('.product-list-item');
    const cartTotal = document.getElementById('cart-total');
    const productCounts = {};

    listItems.forEach(li => {
        const textContent = li.textContent;
        const productName = textContent.split(' - $')[0].trim();

        if (productCounts[productName]) {
            productCounts[productName]++;
            li.remove();
        } else {
            productCounts[productName] = 1;
        }
    });

    const listItems2 = document.querySelectorAll('.product-list-item');

    listItems2.forEach((li, index) => {
        const textContent = li.textContent;
        const [productName, productPrice] = textContent.split(' - $');
        
        products[index + 1] = {
            name: productName.trim(),
            price: parseFloat(productPrice.trim()),
            quantity: productCounts[productName.trim()]
        };

        li.remove();
    });

    cartTotal.textContent = 0.00;

    fetch('/api/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(products)
    })
    .then(response => response.json())
    .then(data => {
        alert('Data sent successfully:', data);
        alert(data.message);
    })
    .catch(error => {
        console.error('Error sending data:', error);
    });
}
