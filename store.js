if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {

    var price = [999, 2499, 4999];
    document.getElementById("00").innerText = "₹ " + price[0];
    document.getElementById("01").innerText = "₹ " + price[1];
    document.getElementById("02").innerText = "₹ " + price[2];

    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementById('rzp-button1').addEventListener('click', razorclick)
}





function purchaseClicked() {

    alert('Thank you for your purchase')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()

    cartcount = document.getElementsByClassName("btn btn-danger").length
    addBadgeCount(cartcount)

}

function removeCartItem(event) {
    var dt = event.currentTarget.getAttribute("data-id")

    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()

    cartcount = document.getElementsByClassName("btn btn-danger").length
    addBadgeCount(cartcount)

    // var d = getSessionItemNumbers()

    // var dt = getMaxNum(d)

    removingSessionStorage('item' + dt)

}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}



function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')

    //TO GET THE CART COUNT FOR DISPLAYING HOW MANY ITEMS ARE IN CART AND SHOW THE COUNT ON BADGE
    var cartcount = document.getElementsByClassName('cart-row').length

    for (var i = 0; i < cartItemNames.length; i++) {

        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            cartcount = cartcount - 1
            return
        }
    }

    //BADGE COUNT IS THE ITEMS IN CART
    addBadgeCount(cartcount)

    //GETTING THE ARRAY OF NUMBER FROM THE SESSION STORAGE TO ASSIGN DATASET ATTRIBUTE FOR 
    //THE ADDING AND REMOVING OF THE ELEMENT 
    var z = getSessionItemNumbers()

    //GETTING THE VALUE OF THE MAX NUMBER USED IN SESSION STORAGE AND INCREMENTING THE NUMBER
    //AND USING IT FOR THE NEW VALUE TO BE STORAGE
    var max = getMaxNum(z)

    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button"  data-id="${max}" >REMOVE</button>
        </div>`

    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)

    //CONVERTING TO STRING FOR STORING IN SESSION
    cartitemsLocalStorage = cartRow.outerHTML

    //ADDING TO SESSION STORAGE
    addSessionStorage('item' + max, cartitemsLocalStorage)


}

//MAX FUNCTION TO INCREMENT THE PREVIOUS VALUE ON THE BASIS OF EXISTING MAX VALUE
function getMaxNum(z){
    var autoGenNum;
    if (z.length != 0) {
         autoGenNum = Math.max(...z)
           return autoGenNum = autoGenNum + 1
    } else {
       return autoGenNum = 1;
    }
}

//GETTING THE ITEM NUMBER USED AND STORING IN A SET OF ARRAY
function getSessionItemNumbers(){

  //TO STORE ALL THE SESSION STORAGE ITEM NUMBER
  var arrayItemForNum = [];

  for (var n = 1; n < sessionStorage.length; n++) {
      var assignitemNum = sessionStorage.key(n)
      if (assignitemNum.includes("item")) {
          assignitemNum = parseInt(assignitemNum.slice(4))
          arrayItemForNum.push(assignitemNum)
      }
  }
  return arrayItemForNum
}


//RELOADING FUNCTION FETCH THE CART VALUES WHICH WERE USED EARLIER
function onReload() {

    getlistitemsfromStorage()

    ready()

    updateCartTotal()

    var cartitem = document.getElementsByClassName('cart-items')[0]
    var cartcount = cartitem.getElementsByClassName('cart-row').length

    addBadgeCount(cartcount)
}


function getlistitemsfromStorage() {

    //GETTING THE ELEMENT WHERE WE NEED TO INSERT THE SELECTED ITEMS BEFORE REFRESH
    var cartItems = document.getElementsByClassName('cart-items')[0];

    var listitemss = [];

    for (var l = 0; l < sessionStorage.length; l++) {


        var itemNum = sessionStorage.key(l);

        //IF CONDITION CAN BE IGNORED IF IT STAYS ALL TIME AT INDEX 0
        if (itemNum.includes('item')) {

            itemNum = parseInt(itemNum.slice(4))
            //GETTING THE ITEMS FROM THE SESSION STORAGE
            cartRow = getSessionStorage('item' + itemNum)

            //cartRow = sessionStorage.getItem('item' + l)

            //CONVERTING STRING TO HTML
            var doc = new DOMParser().parseFromString(cartRow, "text/html");

            // ASSIGNING TO THE DIV CLASS WE FETCHED ABOVE
            //listitems =  cartItems.innerHTML = doc.body.innerHTML
            listitems = doc.body.innerHTML
            listitemss.push(listitems);
        }
    }

    //JOIN IS USED TO REMOVE THE COMMA FROM THE ARRAY LIST OF HTML 
    return cartItems.innerHTML = listitemss.join('')

}



///ADDING THE VALUE TO SESSION STORAGE
function addSessionStorage(key, value) {
    window.sessionStorage.setItem(key, value);
}

///ADDING THE VALUE TO SESSION STORAGE
function getSessionStorage(key) {
    return window.sessionStorage.getItem(key)
}

///ADDING THE VALUE TO SESSION STORAGE
function removingSessionStorage(key) {
    return window.sessionStorage.removeItem(key)
}


//THIS FUNCTION HELPS TO CALCULATE THE TOTAL VALUE IN THE CART 
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('₹', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '₹' + total
}



///ADD BADGE FOR POPULATING THE CART ITEMS VALUES IN RED
function addBadgeCount(cartcount) {

    //GETTING THE CLASS NAME OF THE BADGE CREATED IN HTML
    var badgeclass = document.getElementsByClassName('p1')[0]

    //NEED TO ASSIGN THE WHEN ANYTHING ADDED IN CART AND REMOVING THE VALUE WHEN ITEM REMOVED
    if (cartcount > 0) {
        badgeclass.setAttribute('data-count', cartcount)
    } else {
        badgeclass.removeAttribute('data-count')
    }
}






var options = {
    "key": "rzp_test_5qgz3sWG8yCe1L", // Enter the Key ID generated from the Dashboard
    // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    //Amount is passed through the total
    "currency": "INR",
    "name": "Bundle Corp",
    "description": "Test Transaction",
    "image": "",
    "handler": function (response) {
        //console.log(JSON.stringify(response));
        //alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        //alert(response.razorpay_signature)
        purchaseClicked()

    },
    "prefill": {
        "name": "Neetan Sharma",
        "email": "testautodeployment@gmail.com",
        "contact": "7042476555"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#F37254"
    }
};



function razorclick(e) {
    var pricetopay = document.getElementsByClassName('cart-total-price')[0].innerText
    pricetopay = pricetopay.slice(1)
    pricetopay = parseInt(pricetopay)
    pricetopay = Math.round(pricetopay * 100)
    options.amount = pricetopay;
    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();


}



function sendEmail() {
    Email.send({
        token: "d59f0ad1-7f33-4c55-adc5-261122d249ef",
        Host: "smtp.gmail.com",
        Port: 465,
        EnableSsl: true,
        Username: "testautodeployment@gmail.com",
        Password: "testauto@123",
        To: 'deepakcancer22@gmail.com',
        From: "testautodeployment@gmail.com",
        Subject: "Dummy Test Email",
        Body: "Your Trasaction is Successful",
    }).then(
        message => alert("mail sent successfully")
    );
    console.log(Email)
}
