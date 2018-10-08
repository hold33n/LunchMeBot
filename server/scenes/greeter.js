const Scene = require("telegraf/scenes/base");

const greeterScene = new Scene("greeter");

const options = [
  {
    num: 2,
    price: 66,
    text: "Два блюда (66 грн)"
  },
  {
    num: 3,
    price: 99,
    text: "Три блюда (99 грн)"
  }
];

greeterScene.enter(async ctx => {
  ctx.session.dishes = {
    firstDish: null,
    secondDish: null,
    extraDishes: []
  };

  await ctx.reply("Сколько блюд ты будешь кушать?", {
    reply_markup: {
      keyboard: options.map(({ text }) => [{ text }]),
      resize_keyboard: true
    }
  });
});

options.forEach(el => {
  greeterScene.hears(el.text, ctx => {
    ctx.session.dishesNum = el;
    ctx.scene.enter("firstDishSelect");
  });
});

// greeterScene.leave(ctx => ctx.reply("Bye"));

module.exports = greeterScene;
