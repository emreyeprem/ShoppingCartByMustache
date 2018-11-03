const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const PORT = 3008
var session = require('express-session')

 app.use(express.static('css'))
 app.use(bodyParser.urlencoded({ extended: false }))
 app.engine('mustache',mustacheExpress())
 app.set('views','./views')
 app.set('view engine','mustache')

 app.use(session({
  secret: 'kitten',
  resave: false,
  saveUninitialized: false
}))
//------middle ware--to put control of user on pages add_trips and tripsDisplay-----
let authenticateLogin = function(req,res,next) {
  // check if the user is authenticated
  if(req.session.username) {
    next()
  } else {
    res.redirect("/login")
  }

}
app.all("/mycart",authenticateLogin,function(req,res,next){
    next()
})
//----------------------------
// let userItems = []
let userList = []

app.get('/login',function(req,res){
  res.render("login")
})

app.get('/register',function(req,res){
  res.render("register")
})

app.post('/register',function(req,res){
let userName = req.body.username
let passWord = req.body.password
let fullName = req.body.Fullname
let user = {userName : userName, passWord : passWord, fullName : fullName}
userList.push(user)
console.log(userList)
res.redirect('/login')
})

app.post('/login',function(req,res){

    let usernameLogin = req.body.username
    let passwordLogin = req.body.password
  let userId = userList.find(function(user){
        return user.userName == usernameLogin && user.passWord == passwordLogin
    })
   if(userId != null && req.session){
     req.session.username = userId.fullName
     res.redirect('producthomepage')
   } else{
     res.redirect('/login')
   }
})

app.get('/productHomePage',function(req,res){
        if(req.session.username){
          // ---------- 3 lines below from mycart / userItems declared as global --------
          let currentUserItems = userItems.filter(function(each){
            return each.username == req.session.username
          })
         let count = currentUserItems.length
          res.render('productHomePage',{itemList : products, userLoggedIn : req.session.username, itemCount : count})
        }
        else{
          res.render('productHomePage',{itemList : products})
        }


    })
// ================ mycart=========

app.get('/mycart',function(req,res){
    let currentUserItems = userItems.filter(function(each){
      return each.username == req.session.username
    })
    let itemPrices = currentUserItems.map(function(each){
      return each.price
    })
    let total = itemPrices.reduce((a, b) => a + b)
    console.log(itemPrices)
   let count = currentUserItems.length
  res.render('mycart',{cartItems : userItems, itemCounts : count, total : total, userLoggedIn : req.session.username})
})

let userItems =[]
app.post('/adding_item',function(req,res){
    let itemIdNo = req.body.itemId
     let itemToCart = products.find(function(item){
       return item.productId == itemIdNo
    })
    itemToCart.username = req.session.username // Added new key-value pair to itemToCart object
    userItems.push(itemToCart)
    res.redirect('/mycart')
  })
app.get('/',function(req,res){
  res.redirect('/productHomePage')
})
//  ===============CATEGORIES=======

app.get('/productHomePage/:brand',function(req,res){

  let brand = req.params.brand
let itemsByBrand = products.filter(function(each){
return brand == each.brand
})
res.render('productHomePage', {itemList:itemsByBrand})
})

// =================logout=========
app.get("/logout",function(req,res){
  req.session.destroy()
  res.redirect("/productHomePage")
})


// =================================
app.listen(PORT,function(){
   console.log("Server is running..")
 })
// =====================================

let products = [{ productId : 1, brand: "Apple", name:
"Apple iPhone 8 Plus a1897 64GB Smartphone GSM Unlocked", price: 599.00, shipping:"free", rating: "%98",imageUrl:"https://r3.whistleout.com/public/images/articles/2018/01/i-8.jpg"},{productId :2, brand:"apple",name:"APPLE MACBOOK PRO 13 / 3.1GHz i5 / 16GB RAM / 1TB SSD HYB / OS-2017 / WARRANTY", price:749.00, shipping:"standard",rating:"%63",imageUrl:"https://www.picclickimg.com/d/w1600/pict/263423305663_/Apple-MacBook-Pro-13-INTEL-Core-i5-PRE-RETINA.jpg"},
{productId:3,brand:"Samsung", name:"Samsung Galaxy S7 Edge 32GB SM-G935 Unlocked GSM 4G LTE Android Smartphone", price:279.99, shipping:"free", rating: "%100", imageUrl:"https://s7d2.scene7.com/is/image/SamsungUS/600_006_Galaxy_S7_bk_Left_Angle?$product-details-jpg$"}

,{productId:4,brand:"LG", name:"LG: 10 inch HD Tablet PC, Android 7.0 Nougat, 3G ,Google, 3G, DUAL SIM", price:162.16, shipping:"2-day shipping", rating:"%88", imageUrl:"https://images-na.ssl-images-amazon.com/images/I/61za%2BiR-iPL._SY355_.jpg"}
,
{productId:5, brand:"Samsung",name:"BOSE ON-EAR HEADPHONES CLUB EDITION 715594-0010 BLACK SAMSUNG GALAXY IPHONE IPAD", price:99.95, shipping:"free", rating:"%98", imageUrl:"https://i.ebayimg.com/images/g/ZTkAAOSwKJlbRjV8/s-l225.jpg"}]
