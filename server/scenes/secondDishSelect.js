const Scene = require("telegraf/scenes/base");

const secondDishSelectScene = new Scene("secondDishSelect");

const options = [
  {
    name: "Макароны",
    price: 25
  },
  {
    name: "Гречка",
    price: 15
  },
  {
    name: "Картошка",
    price: 30
  },
  {
    name: "Рис",
    price: 22
  },
  {
    name: "Рагу",
    price: 30
  }
];

secondDishSelectScene.enter(ctx => {
  ctx.reply("Выбирай второе блюдо", {
    reply_markup: {
      keyboard: [
        ...options.map(({ name }) => [{ text: name }]),
        [{ text: "Назад 🔙" }]
      ],
      resize_keyboard: true
    }
  });
});

secondDishSelectScene.hears("Назад 🔙", ctx =>
  ctx.scene.enter("firstDishSelect")
);

options.forEach(({ name, price }) => {
  secondDishSelectScene.hears(name, ctx => {
    ctx.session.dishes.secondDish = { name, price };

    if (ctx.session.dishesNum.num === 3) {
      ctx.scene.enter("thirdDishSelect");
    } else {
      ctx.scene.enter("summary");
    }
    // console.log(ctx.session.firstDish, ctx.session.secondDish);
  });
});

module.exports = secondDishSelectScene;
