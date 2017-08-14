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

// ****** Call Second JSON Loader ****** //
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

// ****** Call Function to Compile JSON Data ****** //
    compileArray();

      });

    loader.addEventListener("error", function (event) {
        	console.log("dataFailed", event);
    });

    loader.open("GET", "categories.json");
	  loader.send();
};

// ****** Call Initial Data Load Function ****** //
loadProducts();


// ****** Event Listener for Discount Choice ****** //
document.getElementById("discount-selector").addEventListener("input", (event) => {
  applyDiscount();
});


// ****** Compile Product Array from Separate JSON files ****** //
function compileArray() {

  productsArray.forEach(function (element) {

  var compProductObject = {};
  var currentCategory;

  function findCategory(ident){
    return ident.id == element.category_id;
  };

  currentCategory = categoriesArray.find(findCategory);
  compProductObject.id = element.id;
  compProductObject.name = element.name;
  compProductObject.price = element.price;
  compProductObject.department = currentCategory.name;
  compProductObject.season_discount = currentCategory.season_discount;
  compProductObject.discount = currentCategory.discount;
  compiledArray.push(compProductObject);
});

// ****** Run JSON Data Through Discount Function for First Load ****** //
  applyDiscount();
};


// ****** Determine Discount, Apply Discount, and Trigger Print Function****** //
function applyDiscount() {
  var seasonDiscount = document.getElementById("discount-selector").value;

  printToDom(discountCalc(seasonDiscount));

  function discountCalc(season) {
    var printObj = {};
    var newArray = [];
    
    compiledArray.forEach(function(element) {
      printObj.id = element.id;
      printObj.name = element.name;
      printObj.department = element.department;
      if (element.season_discount == season) {
        printObj.price = (element.price - (element.price * element.discount)).toFixed(2);
      } else {
        printObj.price = element.price;
      }
      newArray.push(printObj);
      printObj = {};
    });
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

      document.getElementById("print-products").innerHTML += `<div class="${prodRowColor}"><div class="prod-div">${element.name}</div>
                                                        <div class="dept-div">${element.department}</div>
                                                        <div class="price-div">${element.price}</div></div>`;

  });
};
