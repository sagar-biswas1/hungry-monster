const button = document.getElementById("submit-btn");
let orderedProductsArray = [];

button.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("meal-items").innerHTML = "";
  document.getElementById("error-message").innerHTML = "";
  document.getElementById("product-info").innerHTML = "";
  const inputValue = document.getElementById("input-value").value;

  if (inputValue.length > 0) {
    document.getElementById("spinner").classList.remove("d-none");
    getMealData(inputValue);
  } else {
    document.getElementById("error-message").innerHTML =
      "<p class='text-center p-3 bg-danger'><b>Please enter a meal name...</b></p>";
  }
});

//function for passing url for data fetching based on different input

const getMealData = (mealName) => {
  // mealName='o'
  // mealName='asdas'
  if (mealName.length === 1) {
    mealCardDiv(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${mealName}`
    );
  } else {
    mealCardDiv(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
    );
  }
};

//function for data fetching
const fetchedData = async (url) => {
  const response = await fetch(url);

  const data = await response.json();
  
  return data;
};

//function for displaying all product by search after fetching data
const mealCardDiv = (url) => {
  //console.log(url);
  //https://www.themealdb.com/api/json/v1/1/search.php?f=a

// fetch(url).then((res)=>res.json()).then(data=>{

//ekahne apni9 kaaj kore dekhiyen


//console.log(data)
// }).catch()


  fetchedData(url)
    .then((data) => {

  
      //turn of spinner
      document.getElementById("spinner").classList.add("d-none");

      data.meals.forEach((element) => {
        //console.log(element)

        const mealSets = document.getElementById("meal-items");
        const { strMeal, strMealThumb } = element;

        const mealDiv = document.createElement("div");
        mealDiv.className = "col m-auto";
        let mealCard = ` <div class="m-3" style="cursor: pointer" onclick='singleMealData("${strMeal}")'>
          <div class="card h-100">
            <img
              src="${strMealThumb}"
              class="card-img-top img-fluid" style=""
            />
            <div class="card-footer text-center">
               <h6 class="card-title">${strMeal}</h6>
            </div>
                 <button class='btn btn-info btn-sm mt-2' >See details</button>
          </div>

     
        </div>`;
        mealDiv.innerHTML = mealCard;

        mealSets.appendChild(mealDiv);
      });
    })
    .catch((err) => {
      errorMessage();
    });
};

//function for single product description
const singleMealData = (itemName) => {
  window.scrollTo(0, 40);
  fetchedData(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${itemName}`
  ).then((data) => {
    const singleMealInfo = data.meals[0];
    const { strMeal, strMealThumb, idMeal } = singleMealInfo;
    const singleMealDiv = document.getElementById("product-info");
    singleMealDiv.innerHTML = `
 <div class="card m-auto" style="width: 20rem">
   <img
     src="${strMealThumb}"
     class="card-img-top"
    />
   <div class="card-body">
     <h5 class="card-title">${strMeal}</h5>
     <p><b>Ingredients</b></p>
     <ul id="ingredient-list"></ul>
   </div>
   <button class='btn btn-primary btn-sm' onclick='addToCart(${idMeal})'>Add to cart</button>
 </div>`;

    //onclick='addToCart(${idMeal})
    const list = document.getElementById("ingredient-list");


    for (let i = 1; i <= 20; i++) {
      let ingredientKey = "strIngredient" + i;
      let ingredient = singleMealInfo[ingredientKey];
      //ingredient="Water",

      let quantityKey = "strMeasure" + i;

      let quantity = singleMealInfo[quantityKey];

      //quantity='3 tbs'

      let listItem = quantity + " " + ingredient;
      const li = document.createElement("li");
      // li.innerText = listItem;
      //list.appendChild(li);

      //the code in the below is optional
      if (listItem.length > 2 && listItem.indexOf("null null") != 0) {
        li.innerText = listItem;
        list.appendChild(li);
      }
    }
  });
};

//function for adding product to cart
/*let orderedProductsArray = [
  {
  strMeal: "somthing",
  strMealThumb: "dfsdfs",
  idMeal: 2,
  quantity:1,
},{
  strMeal: "somthing",
  strMealThumb: "dfsdfs",
  idMeal: 2,
  quantity:1,
};
  
]*/
const addToCart = (productId) => {



  const isMealInArray = orderedProductsArray.find((p) => p.idMeal == productId);

  console.log("hhhhhhhhhiiiiiiiiii", isMealInArray);

  if (isMealInArray !== undefined) {
    isMealInArray.quantity++;
    updateCart();
  } else {



    fetchedData(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${productId}`
    ).then((data) => {
      const { strMeal, strMealThumb, idMeal } = data.meals[0];


    
      orderedProductsArray = [
        ...orderedProductsArray,
        { strMeal, strMealThumb, idMeal, quantity: 1 },
      ];

      updateCart();
      console.log("hello", orderedProductsArray);
    });
  }
};

function updateCart() {
  document.getElementById("cartCount").innerText = orderedProductsArray.length;

  const cartDiv = document.getElementById("cartProducts");
  cartDiv.innerHTML = "";

  orderedProductsArray.map((p) => {
    const mealDiv = document.createElement("div");

    mealDiv.classList.add("card", "mb-3");
    mealDiv.style.maxWidth = "540px";

    mealDiv.innerHTML = `
  <div class="row g-0">
    <div class="col-md-4">
      <img src='${p.strMealThumb}' class="img-fluid rounded rounded-circle p-3" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body mt-3">
        <h5 class="card-title"> ${p.strMeal}</h5>
 <p>Quantity: ${p.quantity}</p>
      </div>

    </div>
  </div>
`;

    cartDiv.appendChild(mealDiv);
  });
}

// //function for displaying error message.
const errorMessage = () => {
  const inputValue = document.getElementById("input-value").value;
  const errorMessageDiv = document.getElementById("error-message");
  document.getElementById("product-info").innerHTML = "";

  errorMessageDiv.innerHTML = ` <div class="card m-auto p-5 bg-warning" style="width: 18rem">
          <h5 class="card-title">Dear Sir/Ma'am,</h5>
          <p class="card-text">
            Your search --<b>${inputValue}</b>-- did not match any of our set meal. Please enter a
            correct name.
          </p>
        </div>`;
};
