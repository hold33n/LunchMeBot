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
  const { firstDish, secondDish, thirdDish } = dishes;

  // let replyText = `Вы заказали: \n${firstDish.name} (${
  //   firstDish.price
  // } грн) \n${secondDish.name} (${secondDish.price} грн)`;

  // if (thirdDish) {
  //   replyText += `\n${thirdDish.name} (${thirdDish.price} грн)`;
  // }

  // const lunchPrice = dishesNum === 2 ? 66 : 99;

  const replyText = `Вы заказали ланч на ${num} блюда (${price} грн): 
    ${firstDish.product_name}
    ${secondDish.product_name}
    ${thirdDish ? thirdDish.product_name : ""}`;

  ctx.reply(replyText, {
    reply_markup: {
      keyboard: [
        [{ text: "Перейти к оплате ✅" }],
        [{ text: "Редактировать заказ" }],
        [{ text: "Добавить что-то ещё" }]
      ],
      resize_keyboard: true
    }
  });
});

// options.forEach(el => {
//   greeterScene.hears(el, ctx => {
//     ctx.session.dishesNum = el;
//     ctx.scene.enter("firstDishSelect");
//   });
// });

// greeterScene.leave(ctx => ctx.reply("Bye"));

module.exports = greeterScene;
