const Scene = require("telegraf/scenes/base");
const moment = require("moment");
const { getTablesForReservation } = require("../utils");

const selectTimeScene = new Scene("selectTime");

selectTimeScene.enter(async ctx => {
  await ctx.reply(
    "Скажи мне время, в которое обедать ты придешь? <i>(в формате hh:mm)</i>",
    {
      parse_mode: "HTML",
      reply_markup: JSON.stringify({
        hide_keyboard: true
      })
    }
  );
});

selectTimeScene.on("message", async ctx => {
  const re = /^(\d){2}:(\d){2}$/;

  if (re.test(ctx.update.message.text)) {
    const hour = parseInt(ctx.update.message.text);
    const minute = +ctx.update.message.text.slice(3);

    if (
      moment
        .max(
          moment(),
          moment()
            .hour(hour)
            .minute(minute)
        )
        .isSame(moment()) ||
      hour > 23 ||
      minute > 59
    ) {
      ctx.reply("Ты указал неправильное время!");
    } else {
      const freeTablesNum = await getTablesForReservation(
        ctx.update.message.text
      );

      if (freeTablesNum.length) {
        ctx.session.lunchTime = ctx.update.message.text;
        ctx.scene.enter("selectDishesNum");
      } else {
        ctx.reply(
          "Извините, на это время все столики забронированы!\nПожалуйта, выберете другое время."
        );
      }
    }
  } else {
    ctx.reply("Ты указал неправильное время! <i>(нужно в формате hh:mm)</i>", {
      parse_mode: "HTML"
    });
  }
});

module.exports = selectTimeScene;
