const { getDishesByCategoryName } = require("../utils");
const Scene = require("telegraf/scenes/base");

const firstDishSelectScene = new Scene("firstDishSelect");

firstDishSelectScene.enter(async ctx => {
  const products = await getDishesByCategoryName("Первые блюда");

  ctx.reply("Выбирай первое блюдо", {
    reply_markup: {
      keyboard: [
        ...products.map(({ product_name }) => [
          {
            text: product_name
          }
        ]),
        [{ text: "Назад 🔙" }]
      ],
      resize_keyboard: true
    }
  });

  firstDishSelectScene.hears("Назад 🔙", ctx => ctx.scene.enter("greeter"));

  products.forEach(el => {
    firstDishSelectScene.hears(el.product_name, ctx => {
      ctx.session.dishes.firstDish = el;
      ctx.scene.enter("secondDishSelect");
    });
  });
});

module.exports = firstDishSelectScene;
