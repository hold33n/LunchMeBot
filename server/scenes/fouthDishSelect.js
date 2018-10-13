const { getDishesByCategoryName } = require("../utils");
const Scene = require("telegraf/scenes/base");

const fouthDishSelectScene = new Scene("fouthDishSelect");

fouthDishSelectScene.enter(async ctx => {
  const products = await getDishesByCategoryName("Все остальное");

  ctx.reply("Выбирай что-то ещё", {
    reply_markup: {
      keyboard: [
        ...products.map(({ product_name, price }) => [
          {
            text: `${product_name} (${price["1"] / 100} грн)`
          }
        ]),
        [{ text: "Назад 🔙" }]
      ],
      resize_keyboard: true
    }
  });

  fouthDishSelectScene.hears("Назад 🔙", ctx => ctx.scene.enter("summary"));

  products.forEach(el => {
    fouthDishSelectScene.hears(
      `${el.product_name} (${el.price["1"] / 100} грн)`,
      ctx => {
        ctx.session.dishes.extraDishes.push(el);

        ctx.scene.enter("summary");
      }
    );
  });
});

module.exports = fouthDishSelectScene;
