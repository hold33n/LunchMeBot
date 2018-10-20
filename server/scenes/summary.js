const Scene = require("telegraf/scenes/base");

const summaryScene = new Scene("summary");

summaryScene.enter(ctx => {
  const { dishesNum, dishes, lunchTime } = ctx.session;

  const { num, price } = dishesNum;
  const { firstDish, secondDish, thirdDish, extraDishes } = dishes;

  let replyText = `Вы заказали ланч на ${num} блюда (${price} грн): 
    <i>${firstDish.product_name}
    ${secondDish.product_name}
    ${thirdDish ? thirdDish.product_name : ""}</i>`;

  if (extraDishes.length) {
    replyText += extraDishes.reduce(
      (acc, cur) =>
        acc +
        `\n\t\t\t\t<i>${cur.product_name} (${cur.price["1"] / 100} грн)</i>`,
      "\n\nДополнительные блюда:"
    );

    const total = extraDishes.reduce(
      (acc, cur) => acc + cur.price["1"] / 100,
      price
    );

    replyText += `\n\n<b>Сумма: ${total} грн</b>`;
  }

  replyText += `\n<b>Время ланча: ${lunchTime}</b>`;

  ctx.reply(replyText, {
    reply_markup: {
      keyboard: [
        [{ text: "Перейти к оплате ✅" }],
        [{ text: "Редактировать заказ" }],
        [{ text: "Добавить что-то ещё" }]
      ],
      resize_keyboard: true
    },
    parse_mode: "HTML"
  });

  summaryScene.hears("Перейти к оплате ✅", ctx => ctx.scene.enter("payment"));

  summaryScene.hears("Редактировать заказ", ctx =>
    ctx.scene.enter("editDishes")
  );

  summaryScene.hears("Добавить что-то ещё", ctx =>
    ctx.scene.enter("fouthDishSelect")
  );
});

// options.forEach(el => {
//   selectTimeScene.hears(el, ctx => {
//     ctx.session.dishesNum = el;
//     ctx.scene.enter("firstDishSelect");
//   });
// });

// selectTimeScene.leave(ctx => ctx.reply("Bye"));

module.exports = summaryScene;
