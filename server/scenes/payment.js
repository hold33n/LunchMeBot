const Scene = require("telegraf/scenes/base");
const paymentScene = new Scene("payment");
const { paymentTokens } = require("../config");

paymentScene.enter(async ctx => {
  const { dishesNum, dishes } = ctx.session;
  const { extraDishes } = dishes;

  // console.log(dishes);

  let products = [dishes.firstDish.product_id, dishes.secondDish.product_id];

  if (products.thirdDish) {
    products.push(dishes.thirdDish.product_id);
  }

  const prices = [
    {
      label: `Ланч(${dishesNum.num} блюда)`,
      amount: dishesNum.price * 100
      // amount: 100
    }
  ];

  if (extraDishes.length) {
    extraDishes.forEach(({ product_name, price, product_id }) => {
      products.push(product_id);

      prices.push({
        label: product_name,
        amount: parseInt(price[1])
        // amount: 50
      });
    });
  }

  console.log(prices);

  await ctx.reply("Оплачивай заказ и мы заранее забронируем для тебя стол!", {
    reply_markup: JSON.stringify({
      hide_keyboard: true
    })
  });

  console.log("payload:::", {
    lunchTime: ctx.session.lunchTime,
    products,
    sum: prices.reduce((acc, cur) => acc + parseInt(cur.amount), 0)
  });

  await ctx.replyWithInvoice(ctx.chat.id, {
    title: "Ланч",
    payload: {
      lunchTime: ctx.session.lunchTime,
      products,
      sum: extraDishes.length
        ? extraDishes.reduce((acc, cur) => acc + parseInt(cur.price[1]), 0)
        : 0
    },
    description: "Ланч-бот",
    provider_token: paymentTokens.test,
    currency: "UAH",
    prices,
    start_parameter: "launch-me-bot"
  });
});

module.exports = paymentScene;
