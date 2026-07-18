console.log("products.js loaded");

fetch("/items")
.then(response => response.json())
.then(items => {

    const products = items.filter(item => item.type === "product");


    