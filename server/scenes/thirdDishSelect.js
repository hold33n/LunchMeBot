const Scene = require("telegraf/scenes/base");

const thirdDishSelectScene = new Scene("thirdDishSelect");

const options = [
  {
    name: "Цезарь",
    price: 25
  },
  {
    name: "Оливье",
    price: 15
  },
  {
    name: "Греческий",
    price: 30
  }
];

thirdDishSelectScene.enter(ctx => {
  ctx.reply("Выбирай третье блюдо", {
    reply_markup: {
      keyboard: [
        ...options.map(({ name }) => [{ text: name }]),
        [{ text: "Назад 🔙" }]
      ],
      resize_keyboard: true
    }
  });
});

thirdDishSelectScene.hears("Назад 🔙", ctx =>
  ctx.scene.enter("secondDishSelect")
);

options.forEach(({ name, price }) => {
  thirdDishSelectScene.hears(name, ctx => {
    ctx.session.dishes.thirdDish = { name, price };
    // ctx.scene.enter("secondDishSelect");

    ctx.scene.enter("summary");
  });
});

module.exports = thirdDishSelectScene;
