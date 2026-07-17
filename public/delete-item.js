fetch("/items")

.then(response => response.json())

.then(items => {


const container = document.getElementById("items-container");



items.forEach(item => {



const card = document.createElement("div");


card.className = "product";



card.innerHTML = `

<h3>${item.name}</h3>

<p>
${item.price} جنيه
</p>

<p>
${item.type}
</p>


<button class="delete-button">

حذف

</button>


`;



card.querySelector(".delete-button")
.onclick = async function(){


const confirmDelete = confirm(
"هل تريد حذف هذا العنصر؟"
);



if(confirmDelete){


await fetch("/delete-item", {

method:"DELETE",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

name:item.name

})

});



alert("تم الحذف");


location.reload();


}


};



container.appendChild(card);



});


});