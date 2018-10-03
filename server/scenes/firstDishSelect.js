const Scene = require("telegraf/scenes/base");

const firstDishSelectScene = new Scene("firstDishSelect");

firstDishSelectScene.enter(async ctx => {
  await ctx.reply("Выбирай первое блюдо", {
    reply_markup: {
      keyboard: [
        [{ text: "Суп (20 грн)" }],
        [{ text: "Борщ (25 грн)" }],
        [{ text: "Солянка (25 грн)" }],
        [{ text: "Окрошка (25 грн)" }],
        [{ text: "Назад" }]
      ]
    }
  });
});

firstDishSelectScene.hears("Назад", ctx => ctx.scene.enter("greeter"));

// greeterScene.leave(ctx => ctx.reply("Bye"));

module.exports = firstDishSelectScene;
