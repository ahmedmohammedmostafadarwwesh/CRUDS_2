let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

let mood = "create"; // variable to track the mode (create or update)
let tmp; // temporary variable to store the index of the product being updated
// calculate total
function getTotal() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.background = "#040"; // green background for valid total
  } else {
    total.innerHTML = ""; // clear the total if price is empty
    total.style.background = "#a00d02"; // red background for invalid total
  }
}

// create product
let dataPro;
if (localStorage.products != null) {
  dataPro = JSON.parse(localStorage.getItem("products"));
} else {
  dataPro = [];
}

submit.onclick = function () {
  let newPro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };
  //

  if (
    title.value != "" &&
    price.value != "" &&
    newPro.count <= 100 &&
    newPro.count > 0 &&
    category.value != ""
  ) {
    if (mood === "create") {
      if (newPro.count > 1) {
        for (let i = 0; i < newPro.count; i++) {
          dataPro.push(newPro);
        }
      } else {
        dataPro.push(newPro);
      }
    } else {
      dataPro[tmp] = newPro;
      mood = "create"; // reset mood to create after update
      submit.innerHTML = "Create"; // reset button text to Create
      count.style.display = "block"; // show count input again
    }
    clearData(); // clear input fields after adding or updating
  }

  //save data to localStorage
  localStorage.setItem("products", JSON.stringify(dataPro));

  showData();
};

// clear
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
  total.style.background = "#040"; // reset background color
}

// show data
function showData() {
  getTotal(); // recalculate total for the first product
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    table += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].taxes}</td>
            <td>${dataPro[i].ads}</td>
            <td>${dataPro[i].discount}</td>
            <td>${dataPro[i].total}</td>
            <td>${dataPro[i].category}</td>
            <td><button onclick="updateData(${i})" class="update">Update</button></td>
            <td><button onclick="  deleteData(${i}) " class="delete">Delete</button></td>`;
  }
  document.getElementById("tbody").innerHTML = table;
  let btnDelete = document.getElementById("deleteAll");
  if (dataPro.length > 0) {
    btnDelete.innerHTML = `
        <button onclick ="deletAll()" >delete All (${dataPro.length}) </button>`;
  } else {
    btnDelete.innerHTML = "";
  }
}

showData();

// delete data
function deleteData(i) {
  dataPro.splice(i, 1);
  localStorage.product = JSON.stringify(dataPro);
  showData();
}

// delete all data
function deletAll() {
  localStorage.clear();
  dataPro.splice(0);
  showData();
}

// update data

function updateData(i) {
  title.value = dataPro[i].title;
  price.value = dataPro[i].price;
  taxes.value = dataPro[i].taxes;
  ads.value = dataPro[i].ads;
  discount.value = dataPro[i].discount;
  getTotal(); // recalculate total for the updated product
  count.style.display = "none"; // hide count input for update
  count.value = 1;
  category.value = dataPro[i].category;
  submit.innerHTML = "Update";
  mood = "update"; // set mood to update

  tmp = i;
  scroll({
    top: 0,
    behavior: "smooth",
  }); // scroll to the top of the page
}

// search
let searchMood = "title";
function getsearchMood(id) {
  let search = document.getElementById("search");
  if (id == "searchTitle") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  search.placeholder = "Search By " + searchMood;
  search.focus();
  search.value = "";
  showData(); // show all data when changing search mood
}

//serch function

function searchData(value) {
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    if (searchMood == "title") {
      if (dataPro[i].title.includes(value.toLowerCase())) {
        table += `
        <tr>
            <td>${i}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].taxes}</td>
            <td>${dataPro[i].ads}</td>
            <td>${dataPro[i].discount}</td>
            <td>${dataPro[i].total}</td>
            <td>${dataPro[i].category}</td>
            <td><button onclick="updateData(${i})" class="update">Update</button></td>
            <td><button onclick="  deleteData(${i}) " class="delete">Delete</button></td>`;
      }
    } else {
      if (dataPro[i].category.includes(value.toLowerCase())) {
        table += `
        <tr>
            <td>${i}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].taxes}</td>
            <td>${dataPro[i].ads}</td>
            <td>${dataPro[i].discount}</td>
            <td>${dataPro[i].total}</td>
            <td>${dataPro[i].category}</td>
            <td><button onclick="updateData(${i})" class="update">Update</button></td>
            <td><button onclick="  deleteData(${i}) " class="delete">Delete</button></td>`;
      }
    }

    document.getElementById("tbody").innerHTML = table;
  }
}

// commetnt
function saveComment() {
  const name = document.getElementById("userName").value.trim();
  const comment = document.getElementById("userComment").value.trim();
  if (!name || !comment) {
    alert("يرجى كتابة اسمك والتعليق.");
    return;
  }
  // تخزين التعليقات كمصفوفة
  let comments = JSON.parse(localStorage.getItem("pageComments") || "[]");
  comments.push({ name, comment });
  localStorage.setItem("pageComments", JSON.stringify(comments));
  document.getElementById("userName").value = "";
  document.getElementById("userComment").value = "";
  showComment();
}

function showComment() {
  let comments = JSON.parse(localStorage.getItem("pageComments") || "[]");
  if (comments.length === 0) {
    document.getElementById("savedComment").innerHTML = "";
    return;
  }
  let html = "<ul style='list-style:none;padding:0;text-align:center;'>";
  comments.forEach(c => {
    html += `<li style="margin-bottom:12px;background:#222;padding:10px;border-radius:8px;display:inline-block;min-width:200px;">
      <span style="color:#8ef;font-weight:bold;">${c.name}:</span>
      <span style="color:#fff;">${c.comment}</span>
    </li>`;
  });
  html += "</ul>";
  document.getElementById("savedComment").innerHTML = html;
}
showComment(); // Call this function to display comments when the page loads