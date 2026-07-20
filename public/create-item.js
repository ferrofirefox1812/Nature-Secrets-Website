const itemType = document.getElementById("item-type");
const categorySelect = document.getElementById("category-select");


itemType.addEventListener("change", () => {


const bundleTitle = document.getElementById("bundle-products-title");
const bundleContainer = document.getElementById("bundle-products-container");

const oldPriceTitle = document.getElementById("old-price-title");
const oldPriceInput = document.getElementById("item-old-price");



if(itemType.value === "offer"){

bundleTitle.style.display="block";
bundleContainer.style.display="block";


oldPriceTitle.style.display="block";
oldPriceInput.style.display="block";


loadBundleProducts();


}

else{


bundleTitle.style.display="none";
bundleContainer.style.display="none";


oldPriceTitle.style.display="none";
oldPriceInput.style.display="none";


}



categorySelect.innerHTML="";



if(itemType.value==="product"){


categorySelect.innerHTML=`

<option value="">اختر الفئة</option>
<option value="shampoo">الشامبو</option>
<option value="conditioner">البلسم</option>
<option value="styling-cream">كريم التصفيف</option>
<option value="hair-mask">حمام الكريم</option>
<option value="hair-lotion">لوشن التساقط والإنبات</option>
<option value="serum">السيروم</option>
<option value="skin-care">العناية بالبشرة</option>
<option value="brightening">منتجات التفتيح</option>
<option value="lip-care">مرطبات الشفاه</option>
<option value="face-serums">سيرومات البشرة والعين</option>
<option value="hand-foot-care">العناية باليد والقدم</option>
<option value="personal-care">العناية الشخصية</option>
<option value="soap">الصابون</option>
<option value="baby-products">منتجات الأطفال حديثي الولادة</option>
<option value="other">منتجات أخرى</option>

`;

}


else if(itemType.value==="offer"){


categorySelect.innerHTML=`

<option value="">اختر الفئة</option>
<option value="hair-loss-bundles">مجموعات علاج التساقط والقشرة والإنبات</option>
<option value="sensitive-skin-bundles">مجموعات العناية بالبشرة الحساسة والجافة والعادية</option>
<option value="oily-skin-bundles">مجموعات العناية بالبشرة الدهنية</option>
<option value="hair-care-bundles">مجموعات العناية بالشعر</option>
<option value="special-offers">العروض الخاصة</option>
<option value="optional-additions">الإضافات الاختيارية</option>

`;

}


});





document.getElementById("create-item-button")
.addEventListener("click", async ()=>{

const selectedProducts = [];

document.querySelectorAll(".bundle-product:checked").forEach(product => {

    selectedProducts.push(product.value);

});


const item = {

    type: itemType.value,

    category: categorySelect.value,

    name: document.getElementById("item-name").value,

    price: document.getElementById("item-price").value,

    oldPrice: document.getElementById("item-old-price").value,

    image: document.getElementById("item-image").value,

    description: document.getElementById("item-description").value,

    productsIncluded: selectedProducts

};



const response = await fetch("/create-item",{

    method:"POST",

    headers:{

        "Content-Type":"application/json"

    },

    body:JSON.stringify(item)

});



const result = await response.json();

alert(result.message);

});





async function loadBundleProducts(){


const response = await fetch("/items");


const items = await response.json();



const products = items.filter(item => item.type === "product");



const container = document.getElementById("bundle-products-container");


container.innerHTML = "";



products.forEach(product=>{


container.innerHTML += `

<div>

<input 
type="checkbox"
class="bundle-product"
value="${product.name}">

<label>

${product.name} - ${product.price} جنيه

</label>

</div>

`;

});


}


