const { getDishesByCategoryName } = require("../utils");
const Scene = require("telegraf/scenes/base");

const fouthDishSelectScene = new Scene("fouthDishSelect");

fouthDishSelectScene.enter(async ctx => {
  const products = await getDishesByCategoryName("Все остальное");

  let keyboardOptions = products.map(({ product_name, price }) => [
    {
      text: `${product_name} (${price["1"] / 100} грн)`
    }
  ]);

  if (ctx.scene.state.editDish) {
    keyboardOptions.push([
      {
        text: "Удалить блюдо ❌"
      }
    ]);

    fouthDishSelectScene.hears("Удалить блюдо ❌", ctx => {
      ctx.session.dishes.extraDishes.splice(ctx.scene.state.dishIndex, 1);
      ctx.scene.enter("summary");
    });
  }

  const replyMessage = ctx.scene.state.editDish
    ? `Редактировать ${ctx.scene.state.dish.product_name}`
    : "Выбирай что-то ещё";

  ctx.reply(replyMessage, {
    reply_markup: {
      keyboard: [...keyboardOptions, [{ text: "Назад 🔙" }]],
      resize_keyboard: true
    }
  });

  fouthDishSelectScene.hears(
    "Назад 🔙",
    ctx =>
      ctx.scene.state.editDish
        ? ctx.scene.enter("editDishes")
        : ctx.scene.enter("summary")
  );

  products.forEach(el => {
    fouthDishSelectScene.hears(
      `${el.product_name} (${el.price["1"] / 100} грн)`,
      ctx => {
        const { editDish, dishIndex } = ctx.scene.state;

        if (editDish) {
          ctx.session.dishes.extraDishes[dishIndex] = el;
        } else {
          ctx.session.dishes.extraDishes.push(el);
        }

        ctx.scene.enter("summary");
      }
    );
  });
});

module.exports = fouthDishSelectScene;
