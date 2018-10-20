const { getDishesByCategoryName } = require("../utils");
const Scene = require("telegraf/scenes/base");

const secondDishSelectScene = new Scene("secondDishSelect");

secondDishSelectScene.enter(async ctx => {
  const products = await getDishesByCategoryName("Вторые блюда");

  const replyMessage = ctx.scene.state.editDish
    ? "Редактировать второе блюдо"
    : "Выбирай второе блюдо";

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

  secondDishSelectScene.hears(
    "Назад 🔙",
    ctx =>
      ctx.scene.state.editDish
        ? ctx.scene.enter("editDishes")
        : ctx.scene.enter("firstDishSelect")
  );

  products.forEach(el => {
    secondDishSelectScene.hears(el.product_name, ctx => {
      ctx.session.dishes.secondDish = el;

      if (ctx.scene.state.editDish) {
        ctx.scene.enter("summary");
      } else {
        if (ctx.session.dishesNum.num === 3) {
          ctx.scene.enter("thirdDishSelect");
        } else {
          ctx.scene.enter("summary");
        }
      }

      // console.log(ctx.session.firstDish, ctx.session.secondDish);
    });
  });
});

module.exports = secondDishSelectScene;
