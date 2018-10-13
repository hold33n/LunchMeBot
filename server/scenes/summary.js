const Scene = require("telegraf/scenes/base");

const greeterScene = new Scene("summary");

// const options = ["Два блюда (66 грн)", "Три блюда (99 грн)"];

greeterScene.enter(ctx => {
  //  ctx.reply("Сколько блюд ты будешь кушать?", {
  //   reply_markup: {
  //     keyboard: options.map(el => [{ text: el }]),
  //     resize_keyboard: true
  //   }
  // });
  const { dishesNum, dishes } = ctx.session;

  const { num, price } = dishesNum;
  const { firstDish, secondDish, thirdDish, extraDishes } = dishes;

  // let replyText = `Вы заказали: \n${firstDish.name} (${
  //   firstDish.price
  // } грн) \n${secondDish.name} (${secondDish.price} грн)`;

  // if (thirdDish) {
  //   replyText += `\n${thirdDish.name} (${thirdDish.price} грн)`;
  // }

  // const lunchPrice = dishesNum === 2 ? 66 : 99;

  let replyText = `Вы заказали ланч на ${num} блюда (${price} грн): 
    <i>${firstDish.product_name}
    ${secondDish.product_name}
    ${thirdDish ? thirdDish.product_name : ""}</i>`;

  if (extraDishes.length) {
    replyText += extraDishes.reduce(
      (acc, cur) =>
        acc +
        `\n\t\t\t\t<i>${cur.product_name} (${cur.price["1"] / 100} грн)</i>`,
      "\nДополнительные блюда:"
    );

    const total = extraDishes.reduce(
      (acc, cur) => acc + cur.price["1"] / 100,
      price
    );

    replyText += `\n\n<b>Сумма: ${total} грн</b>`;
  }

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

  greeterScene.hears("Добавить что-то ещё", ctx =>
    ctx.scene.enter("fouthDishSelect")
  );
});

// options.forEach(el => {
//   greeterScene.hears(el, ctx => {
//     ctx.session.dishesNum = el;
//     ctx.scene.enter("firstDishSelect");
//   });
// });

// greeterScene.leave(ctx => ctx.reply("Bye"));

module.exports = greeterScene;
