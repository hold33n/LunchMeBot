const Scene = require("telegraf/scenes/base");

const editDishesScene = new Scene("editDishes");

editDishesScene.enter(ctx => {
  const { dishesNum, dishes } = ctx.session;

  const { num, price } = dishesNum;
  const { firstDish, secondDish, thirdDish, extraDishes } = dishes;

  let keyboardOptions = [
    [{ text: firstDish.product_name }],
    [{ text: secondDish.product_name }]
  ];

  editDishesScene.hears(firstDish.product_name, ctx =>
    ctx.scene.enter("firstDishSelect", {
      editDish: true
    })
  );

  editDishesScene.hears(secondDish.product_name, ctx =>
    ctx.scene.enter("secondDishSelect", {
      editDish: true
    })
  );

  if (thirdDish) {
    keyboardOptions.push([{ text: thirdDish.product_name }]);

    editDishesScene.hears(thirdDish.product_name, ctx =>
      ctx.scene.enter("thirdDishSelect", {
        editDish: true
      })
    );
  }

  if (extraDishes.length) {
    keyboardOptions = [
      ...keyboardOptions,
      ...extraDishes.map(el => [
        { text: `${el.product_name} (${el.price["1"] / 100} грн)` }
      ])
    ];

    extraDishes.forEach((el, index) => {
      editDishesScene.hears(
        `${el.product_name} (${el.price["1"] / 100} грн)`,
        ctx =>
          ctx.scene.enter("fouthDishSelect", {
            editDish: true,
            dishIndex: index,
            dish: el
          })
      );
    });
  }

  ctx.reply("Редактировать ланч", {
    reply_markup: {
      keyboard: [...keyboardOptions, [{ text: "Готово ✅" }]],
      resize_keyboard: true
    },
    parse_mode: "HTML"
  });

  editDishesScene.hears("Готово ✅", ctx => ctx.scene.enter("summary"));
});

// options.forEach(el => {
//   greeterScene.hears(el, ctx => {
//     ctx.session.dishesNum = el;
//     ctx.scene.enter("firstDishSelect");
//   });
// });

// greeterScene.leave(ctx => ctx.reply("Bye"));

module.exports = editDishesScene;
