const { getDishesByCategoryName } = require("../utils");
const Scene = require("telegraf/scenes/base");

const secondDishSelectScene = new Scene("secondDishSelect");

secondDishSelectScene.enter(async ctx => {
  const products = await getDishesByCategoryName("Вторые блюда");

  ctx.reply("Выбирай второе блюдо", {
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

  secondDishSelectScene.hears("Назад 🔙", ctx =>
    ctx.scene.enter("firstDishSelect")
  );

  products.forEach(el => {
    secondDishSelectScene.hears(el.product_name, ctx => {
      ctx.session.dishes.secondDish = el;

      if (ctx.session.dishesNum.num === 3) {
        ctx.scene.enter("thirdDishSelect");
      } else {
        ctx.scene.enter("summary");
      }
      // console.log(ctx.session.firstDish, ctx.session.secondDish);
    });
  });
});

module.exports = secondDishSelectScene;
