const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Restaurant = require("./models/restaurant");

app.use(methodOverride('_method'))

// require express-handlebars here
const exphbs = require('express-handlebars')

// setting body-parser 用來拿表單的資料(req.body)
app.use(bodyParser.urlencoded({ extended: true }))



// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//******* */
app.use(express.static('public'))
//******* */

const restaurantList = require("./restaurant.json");



const mongoose = require('mongoose') // 載入 mongoose
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/restaurant-list";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//路由設定

//設定根目錄首頁
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then( restaurant => res.render('index', {restaurant}))
    .catch(error => console.log(error))
})


//新增餐廳的表單頁面
app.get("/new", (req, res) => {
 return res.render("new");
});

//收到新增餐廳表單資料的路由
app.post("/restaurants" ,(req,res) =>{
  return Restaurant.create({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description,
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
});




// 閱讀一筆資料
app.get("/restaurants/:rest_id", (req, res) => {  //這個路由跟index的each迴圈所導向的一樣，所以這個controller是要把資料渲染進"show"的
  const restId = req.params.rest_id;
  return Restaurant.findById(restId)
    .lean()
    .then((restaurant) => res.render("show", { restaurant: restaurant }))
    .catch((error) => console.log(error));
});

// GET 修改頁面
app.get('/restaurants/:rest_id/edit', (req, res) => {
  const restId = req.params.rest_id
  return Restaurant.findById(restId)
    .lean()
    .then((restaurant) => {
      return res.render('edit', { restaurant})
    })
    .catch((error) => console.log(error))
})

// 得到修改頁面表單資料的路由
app.post('/restaurants/:id/edit-form' ,(req,res) =>{
  const id = req.params.id
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return Restaurant.findById(id)
    .then((restaurant) => {
      restaurant.name = name;
      restaurant.name_en = name_en;
      restaurant.category = category;
      restaurant.image = image;
      restaurant.location = location;
      restaurant.phone = phone;
      restaurant.google_map = google_map;
      restaurant.rating = rating;
      restaurant.description = description;
      return restaurant.save();
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})   //我們要重新把req.body的東西定義好，再把它放進"Restaurant"這個資料庫，而restaurant會是新修改的那筆資料陣列，我們要把req.body寫進去再儲入資料庫


//刪除某筆資料
app.delete("/restaurants/:this_id", (req, res) => {
  const deleId = req.params.this_id;
  return Restaurant.findById(deleId)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});




app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurantFilter = restaurantList.results.filter((restaurant) => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })


  res.render('index', { restaurant: restaurantFilter, keyword: keyword, })
})

app.listen(PORT, () => {
  console.log(`the web is running http://localhost:${PORT}`)
})