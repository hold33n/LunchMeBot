const { getDishesByCategoryName } = require("../utils");
const Scene = require("telegraf/scenes/base");

const firstDishSelectScene = new Scene("firstDishSelect");

firstDishSelectScene.enter(async ctx => {
  const products = await getDishesByCategoryName("Первые блюда");

  const replyMessage = ctx.scene.state.editDish
    ? "Редактировать первое блюдо"
    : "Выбирай первое блюдо";

  ctx.reply(replyMessage, {
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

  firstDishSelectScene.hears(
    "Назад 🔙",
    ctx =>
      ctx.scene.state.editDish
        ? ctx.scene.enter("editDishes")
        : ctx.scene.enter("greeter")
  );

  products.forEach(el => {
    firstDishSelectScene.hears(el.product_name, ctx => {
      ctx.session.dishes.firstDish = el;

      if (ctx.scene.state.editDish) {
        ctx.scene.enter("summary");
      } else {
        ctx.scene.enter("secondDishSelect");
      }
    });
  });
});

module.exports = firstDishSelectScene;
