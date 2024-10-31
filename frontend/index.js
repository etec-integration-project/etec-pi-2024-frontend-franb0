const baseUrl = '/api';

function openDialog(type) {
    const dialog = type === 'login' ? document.getElementById('loginDialog') : document.getElementById('registerDialog');
    dialog.showModal();
}

function closeDialog(type) {
    const dialog = type === 'login' ? document.getElementById('loginDialog') : document.getElementById('registerDialog');
    dialog.close();
}

function submitForm(type) {
    const form = type === 'login' ? document.getElementById('loginForm') : document.getElementById('registerForm');
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const endpoint = type === 'login' ? `${baseUrl}/login` : `${baseUrl}/register`;

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
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} successful: ${JSON.stringify(data)}`);
        closeDialog(type);
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
}

function addToCart(productName, productPrice) {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    const listItem = document.createElement('li');
    listItem.textContent = `${productName} - $${productPrice.toFixed(2)}`;

    cartItems.appendChild(listItem);

    const currentTotal = parseFloat(cartTotal.textContent);
    const newTotal = currentTotal + productPrice;
    cartTotal.textContent = newTotal.toFixed(2);
}
