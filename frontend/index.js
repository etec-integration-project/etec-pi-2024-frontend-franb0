// Base URL of the Flask API (adjust as per your Flask server address)
const baseUrl = 'http://localhost:3003'; // Your Flask server URL

// Function to register a new user
function register() {
    const name = prompt("Enter your name:");
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");

    fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            alert('Registration successful!');
            console.log('User registered:', data);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to log in a user
function login() {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");

    fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            alert('Login successful!');
            console.log('User logged in:', data);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to add items to the shopping cart
function addToCart(productName, productPrice) {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // Create a new list item for the product
    const listItem = document.createElement('li');
    listItem.textContent = `${productName} - $${productPrice.toFixed(2)}`;

    // Add the item to the cart
    cartItems.appendChild(listItem);

    // Update the total price
    const currentTotal = parseFloat(cartTotal.textContent);
    const newTotal = currentTotal + productPrice;
    cartTotal.textContent = newTotal.toFixed(2);
}
