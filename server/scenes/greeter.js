const Scene = require("telegraf/scenes/base");

const greeterScene = new Scene("greeter");

greeterScene.enter(async ctx => {
  await ctx.reply("Сколько блюд ты будешь кушать?", {
    reply_markup: {
      keyboard: [
        [{ text: "Два блюда (66 грн)" }],
        [{ text: "Три блюда (99 грн)" }]
      ],
      resize_keyboard: true
    }
  });
});

greeterScene.hears("Два блюда (66 грн)", ctx =>
  ctx.scene.enter("firstDishSelect")
);

// greeterScene.leave(ctx => ctx.reply("Bye"));

module.exports = greeterScene;
