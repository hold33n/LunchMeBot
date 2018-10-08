const Scene = require("telegraf/scenes/base");

const firstDishSelectScene = new Scene("firstDishSelect");

const options = [
  {
    name: "Суп",
    price: 20
  },
  {
    name: "Борщ",
    price: 25
  },
  {
    name: "Солянка",
    price: 30
  },
  {
    name: "Окрошка",
    price: 25
  }
];

firstDishSelectScene.enter(ctx => {
  ctx.reply("Выбирай первое блюдо", {
    reply_markup: {
      keyboard: [
        ...options.map(({ name }) => [{ text: name }]),
        [{ text: "Назад 🔙" }]
      ],
      resize_keyboard: true
    }
  });
});

firstDishSelectScene.hears("Назад 🔙", ctx => ctx.scene.enter("greeter"));

options.forEach(({ name, price }) => {
  firstDishSelectScene.hears(name, ctx => {
    ctx.session.dishes.firstDish = { name, price };
    ctx.scene.enter("secondDishSelect");
  });
});

module.exports = firstDishSelectScene;
