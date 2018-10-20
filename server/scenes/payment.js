const Scene = require("telegraf/scenes/base");
const paymentScene = new Scene("payment");
const { paymentTokens } = require("../config");

paymentScene.enter(async ctx => {
  const { dishesNum, dishes } = ctx.session;
  const { extraDishes } = dishes;

  const prices = [
    {
      label: `Ланч(${dishesNum.num} блюда)`,
      amount: dishesNum.price * 100
      // amount: 100
    }
  ];

  if (extraDishes.length) {
    extraDishes.forEach(({ product_name, price }) => {
      prices.push({
        label: product_name,
        amount: price[1]
        // amount: 50
      });
    });
  }

  await ctx.reply("Оплачивай заказ и мы заранее забронируем длятебя стол!", {
    reply_markup: JSON.stringify({
      hide_keyboard: true
    })
  });

  await ctx.replyWithInvoice(ctx.chat.id, {
    title: "Ланч",
    payload: ctx.session.lunchTime,
    description: "Ланч-бот",
    provider_token: paymentTokens.test,
    currency: "UAH",
    prices,
    start_parameter: "launch-me-bot"
  });
});

module.exports = paymentScene;
