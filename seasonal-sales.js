console.log("seasonal-sales.js");

let productsArray;
let categoriesArray;
let compiledArray = [];

// ****** Load Data From Product JSON ****** //
function loadProducts() {
	var loader = new XMLHttpRequest();
  var inputData;

    loader.addEventListener("load", function (event) {
      	console.log("products - messages loaded successfully");
      	inputData = JSON.parse(this.responseText);
        productsArray = inputData.products;
      	console.log("productsArray", productsArray);

        loadCategories();

    });

    loader.addEventListener("error", function (event) {
    	console.log("dataFailed", event);
    });

    loader.open("GET", "products.json");
	  loader.send();
};


// ****** Load Data from Categories JSON ****** //
function loadCategories() {
	var loader = new XMLHttpRequest();
  var inputData;

    loader.addEventListener("load", function (event) {

    console.log("categories - messages loaded successfully");
    inputData = JSON.parse(this.responseText);
    categoriesArray = inputData.categories;

    console.log("categoriesArray", categoriesArray);

    compileArray();

    console.log("discount-selector value", document.getElementById("discount-selector").value);

      });

    loader.addEventListener("error", function (event) {
        	console.log("dataFailed", event);
    });

    loader.open("GET", "categories.json");
	loader.send();

};

// ****** Call Data Load Functions ****** //
loadProducts();




// ****** Event Listener for Discount Choice ****** //
document.getElementById("discount-selector").addEventListener("input", (event) => {
	console.log("event", event);
  applyDiscount();


});



// ****** Compile Product Array to Print ****** //
function compileArray() {

  console.log("compileArray triggered");


  productsArray.forEach(function (element) {

  var printProductObject = {};
  var currentCategory;

  console.log("element.category_id", element.category_id);

  function findCategory(ident){
    return ident.id == element.category_id;
  };

  currentCategory = categoriesArray.find(findCategory);
  console.log("currentCategory", currentCategory);

  printProductObject.id = element.id;
  printProductObject.name = element.name;
  printProductObject.price = element.price;
  printProductObject.department = currentCategory.name;
  printProductObject.season_discount = currentCategory.season_discount;
  printProductObject.discount = currentCategory.discount;
  
  console.log("printProductObject", printProductObject);

  compiledArray.push(printProductObject);
});

  console.log("compiledArray at end", compiledArray);

  applyDiscount();
};

// ****** Determine Which Discount to Apply ****** //
function applyDiscount() {
  var seasonDiscount = document.getElementById("discount-selector").value;

  printToDom(discountCalc(seasonDiscount));

  // switch(seasonDiscount) {
  //   case "Blank":
  //     printToDom(discountCalc(seasonDiscount));
  //     break;
  //   case "Winter":

  //   case "Autumn":
  //   case "Spring":     
  // };

  function discountCalc(season) {
    var printObj = {};
    var newArray = [];
    
    compiledArray.forEach(function(element) {
      
      console.log("newArray before", newArray);
      printObj.id = element.id;
      printObj.name = element.name;
      printObj.department = element.department;
      if (element.season_discount == season) {
        printObj.price = (element.price - (element.price * element.discount)).toFixed(2);
      } else {
        printObj.price = element.price;
      }
      console.log("printObj", printObj);
      newArray.push(printObj);
      printObj = {};
      console.log("newArray", newArray);
    });

    console.log("newArray done", newArray);
    return newArray;
  };

};

// ****** Print to Dom ****** //
function printToDom(arrayToPrint) {

  document.getElementById("print-products").innerHTML = `<div class="prod-row"><div class="prod-div">Product</div>
                                                        <div class="dept-div">Department</div>
                                                        <div class="price-div">Price</div></div>`;

  arrayToPrint.forEach((element) => {
      var prodRowColor;

      if (element.id % 2 == 0) {
        prodRowColor = "prod-row-white";
      } else {
        prodRowColor = "prod-row-gray";
      }

      // switch 
      document.getElementById("print-products").innerHTML += `<div class="${prodRowColor}"><div class="prod-div">${element.name}</div>
                                                        <div class="dept-div">${element.department}</div>
                                                        <div class="price-div">${element.price}</div></div>`;

  });

};


// Your job is to build a web page that lists all of the products, the name of the department it's in, and the price. Additionally, put a <select> element at the top of the page that contains all possible values of the season_discount key in the categories file. As soon as you select one of the seasons, all prices on the page should immediately be discounted by the corresponding percentage.

// For example, when Spring is chosen, all products in the corresponding Household category should have their prices updated with a 15% discount off the base price.

// The two JSON representations above should be in two files: products.json, and categories.json. You should load both files via XHRs and store the contents in two different JavaScript variables in your code.`