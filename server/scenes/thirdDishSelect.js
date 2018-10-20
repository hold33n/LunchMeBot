const { getDishesByCategoryName } = require("../utils");
const Scene = require("telegraf/scenes/base");

const thirdDishSelectScene = new Scene("thirdDishSelect");

thirdDishSelectScene.enter(async ctx => {
  const products = await getDishesByCategoryName("Салаты");

  const replyMessage = ctx.scene.state.editDish
    ? "Редактировать салат"
    : "Выбирай салат";

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

  thirdDishSelectScene.hears(
    "Назад 🔙",
    ctx =>
      ctx.scene.state.editDish
        ? ctx.scene.enter("editDishes")
        : ctx.scene.enter("secondDishSelect")
  );

  products.forEach(el => {
    thirdDishSelectScene.hears(el.product_name, ctx => {
      ctx.session.dishes.thirdDish = el;

      ctx.scene.enter("summary");
    });
  });
});

module.exports = thirdDishSelectScene;
