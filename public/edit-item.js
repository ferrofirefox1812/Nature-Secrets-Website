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


<button class="edit-button">
تعديل
</button>

`;



card.querySelector(".edit-button").onclick = function(){


container.innerHTML = `


<h2>تعديل ${item.name}</h2>


<input id="name"
value="${item.name}">


<br><br>


<input id="price"
value="${item.price}">


<br><br>


<input id="image"
value="${item.image || ""}"
placeholder="رابط الصورة">


<br><br>


<textarea id="description">

${item.description || ""}

</textarea>


<br><br>


<button id="save-button">
حفظ التعديل
</button>


`;



document.getElementById("save-button")
.onclick = async function(){


const updatedItem = {


type:item.type,


category:item.category,


name:document.getElementById("name").value,


price:document.getElementById("price").value,


image:document.getElementById("image").value,


description:document.getElementById("description").value


};



await fetch("/edit-item",{


method:"PUT",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({


oldName:item.name,


item:updatedItem


})


});



alert("تم التعديل");


location.reload();



};



};



container.appendChild(card);



});


});