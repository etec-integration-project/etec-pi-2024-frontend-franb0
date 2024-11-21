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

function login() {
    fetch('/api/session-data')
        .then(response => response.json())
        .then(data => {
            const username = data.name;
            const userGreeting = document.getElementById('user-greeting');
            const greetingMessage = document.createElement('p');
            const logoutButton = document.createElement('button');
            logoutButton.classList.add('auth-btn');
            logoutButton.textContent = 'Logout';
            logoutButton.addEventListener('click', logout);

            if (username) {
                greetingMessage.textContent = `${username}`; // Fixed missing backticks
            }

            userGreeting.appendChild(greetingMessage);
            userGreeting.appendChild(logoutButton);
        })
        .catch(error => {
            console.error("Error fetching session data:", error);
        });
}

function submitForm(type) {
    const form = type === 'login' ? document.getElementById('loginForm') : 
                 type === 'register' ? document.getElementById('registerForm') : 
                 document.getElementById('supportForm');
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const endpoint = type === 'login' ? `${baseUrl}/login` : 
                     type === 'register' ? `${baseUrl}/register` : 
                     `${baseUrl}/support`; // Fixed missing backticks

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} successful: ${JSON.stringify(data)}`); // Fixed missing backticks
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

    listItems.forEach((li, index) => {
        const textContent = li.textContent;
        const [productName, productPrice] = textContent.split(' - $');
        
        products[index + 1] = {
            name: productName.trim(),
            price: parseFloat(productPrice.trim())
        };
    });

    console.log(products);

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
