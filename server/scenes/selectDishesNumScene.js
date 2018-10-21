const Scene = require("telegraf/scenes/base");

const selectDishesNumScene = new Scene("selectDishesNum");

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

selectDishesNumScene.enter(async ctx => {
  await ctx.reply(
    "Сколько блюд сегодня желаешь ты, о искушенный раб желудка?😅",
    {
      reply_markup: {
        keyboard: [
          ...options.map(({ text }) => [{ text }]),
          [{ text: "Назад 🔙" }]
        ],
        resize_keyboard: true
      }
    }
  );
});

selectDishesNumScene.hears(
  "Назад 🔙",
  ctx =>
    ctx.scene.state.editDish
      ? ctx.scene.enter("editDishes")
      : ctx.scene.enter("selectTime")
);

options.forEach(el => {
  selectDishesNumScene.hears(el.text, ctx => {
    ctx.session.dishesNum = el;
    ctx.scene.enter("firstDishSelect");
  });
});

// selectTimeScene.leave(ctx => ctx.reply("Bye"));

module.exports = selectDishesNumScene;
