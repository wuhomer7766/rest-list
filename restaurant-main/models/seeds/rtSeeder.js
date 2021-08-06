const mongoose = require("mongoose"); // 載入 mongoose
mongoose.connect("mongodb://localhost/todo-list", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

rt = require('../restaurant.js')

// 取得資料庫連線狀態
const db = mongoose.connection;
// 連線異常
db.on("error", () => {
  console.log("mongodb error!");
});
// 連線成功
db.once("open", () => {
  for (let i=0 ; i < rt.length; i++) {
    rt.create({
      name: restaurantList[i].name,
      name_en: restaurantList[i].name_en,
      category: restaurantList[i].category,
      image: restaurantList[i].image,
      location: restaurantList[i].location,
      phone: restaurantList[i].phone,
      google_map: restaurantList[i].google_map,
      rating: restaurantList[i].rating,
      description: restaurantList[i].description,
    });
  }

  console.log("mongodb connected!")
});
