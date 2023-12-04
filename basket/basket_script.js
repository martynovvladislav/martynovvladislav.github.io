const basketContainer = document.getElementById("basket");
const basketList = document.getElementById("items-cont");
const eraseButton = document.getElementById("clear-basket-btn");

let totalSum = 0;
let totalAmount = 0;
const totalSumCont = document.getElementById("total-sum-cont");
const totalAmountCont = document.getElementById("total-amount-cont");

import itemsDB from '../resources/database/db.json' assert { type: 'json'};

function clearBasket() {
    basketContainer.innerHTML = `<div id="empty-basket-info">
    <h2>В корзине ничего нет :(</h2>
    <p>Выберите товары в каталоге и возвращайтесь, чтобы сделать заказ</p>
    <button id="cat-button" onclick="location.href='../catalog'">ПЕРЕЙТИ К КАТАЛОГУ</button>
</div>`;
    localStorage.setItem("basket", JSON.stringify({}));
}

function deleteItem(button) {
    totalSum -= Number(button.parentNode.children[4].innerText.slice(0, -1));
    totalAmount -= Number(button.parentNode.children[1].innerText);
    button.parentNode.parentNode.remove();
    let basket = JSON.parse(localStorage.getItem("basket"));
    for (let key in basket) {
        if (key == button.parentNode.parentNode.getAttribute("data-id")) {
            delete basket[key];
        }
    }
    localStorage.setItem("basket", JSON.stringify(basket));
    if (Object.keys(basket).length == 0) {
        clearBasket();
    }
    else {
        renderTotalInfo();
    }
}

function increaseItem(button) {
    totalSum += Number(button.parentNode.parentNode.children[0].children[2].innerText.slice(0, -1));
    totalAmount++;
    button.parentNode.children[1].innerText = Number(button.parentNode.children[1].innerText) + 1;
    button.parentNode.children[4].innerText = Number(button.parentNode.children[4].innerText.slice(0, -1)) + Number(button.parentNode.parentNode.children[0].children[2].innerText.slice(0, -1)) + "₽";

    let basket = JSON.parse(localStorage.getItem("basket"));
    for (let key in basket) {
        if (key == button.parentNode.parentNode.getAttribute("data-id")) {
            basket[key]++;
        }
    }
    localStorage.setItem("basket", JSON.stringify(basket));
    renderTotalInfo();
}

function decreaseItem(button) {
    totalSum -= Number(button.parentNode.parentNode.children[0].children[2].innerText.slice(0, -1));
    totalAmount--;
    button.parentNode.children[1].innerText = Number(button.parentNode.children[1].innerText) - 1;
    button.parentNode.children[4].innerText = Number(button.parentNode.children[4].innerText.slice(0, -1)) - Number(button.parentNode.parentNode.children[0].children[2].innerText.slice(0, -1)) + "₽";

    let basket = JSON.parse(localStorage.getItem("basket"));
    for (let key in basket) {
        if (key == button.parentNode.parentNode.getAttribute("data-id")) {
            if (basket[key] == 1) {
                deleteItem(button);
                return;
            } else {
                basket[key]--;
            }
        }
    }
    localStorage.setItem("basket", JSON.stringify(basket));
    renderTotalInfo();
}

function itemConstructor(item, amount) {
    let element = document.createElement("div");
    element.setAttribute("data-id", item.id);
    element.className = "item";

    let info = document.createElement("div");
    info.className = "item-info";
    let image = document.createElement("img");
    image.src = item.imgsrc;
    let name = document.createElement("p");
    name.innerText = item.name;
    let price = document.createElement("h2");
    price.innerText = item.price + "₽";
    info.append(image, name, price);

    let control = document.createElement("div");
    control.className = "item-control";
    let plusButton = document.createElement("button");
    plusButton.className = "plus-btn";
    plusButton.innerText = "+";
    let amountText = document.createElement("p");
    amountText.className = "item-amount";
    amountText.innerText = amount;
    totalAmount += amount;
    let minusButton = document.createElement("button");
    minusButton.innerText = "-";
    minusButton.className = "minus-btn";
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Удалить";
    deleteButton.className = "del-btn";
    let fullprice = document.createElement("p");
    fullprice.className = "item-fullprice";
    fullprice.innerText = (+item.price * +amount) + "₽";
    totalSum += Number(item.price) * Number(amount);
    control.append(plusButton, amountText, minusButton, deleteButton, fullprice);

    element.append(info, control);
    basketList.appendChild(element);
} 

function renderBasket() {
    let basket = JSON.parse(localStorage.getItem("basket"));
    totalAmount = 0;
    totalSum = 0;
    if (Object.keys(basket).length == 0) {
        clearBasket();
        return;
    }
    for (let id in basket) {
        for (let item in itemsDB) {
            if (itemsDB[item].id == id) {
                itemConstructor(itemsDB[item], basket[id]);
            }
        }
    }
    renderTotalInfo();
}

function renderTotalInfo() {
    totalSumCont.innerText = "Общая сумма заказа: " + totalSum + "₽";
    totalAmountCont.innerText = "Общее количество товаров: " + totalAmount;
}

function update() {
    renderBasket();

    let deleteButtons = Array.from(document.getElementsByClassName("del-btn"));
    deleteButtons.forEach(element => {
        element.addEventListener("click", function() {
            deleteItem(this);
        });
    });

    let incrementButtons = Array.from(document.getElementsByClassName("plus-btn"));
    incrementButtons.forEach(element => {
        element.addEventListener("click", function() {
            increaseItem(this);
        });
    });

    let decrementButtons = Array.from(document.getElementsByClassName("minus-btn"));
    decrementButtons.forEach(element => {
        element.addEventListener("click", function() {
            decreaseItem(this);
        });
    });
}

eraseButton.addEventListener("click", clearBasket);
update();