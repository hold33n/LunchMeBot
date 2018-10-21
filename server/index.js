const Telegraf = require("telegraf");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const { leave } = Stage;

const Koa = require("koa");
const app = new Koa();

const path = require("path");
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const { sleep, getTablesForReservation, createOrder } = require("./utils");
const { token } = require("./config");
const config = require("./config");
const { appId, appSecret } = config.poster;

// *** Scene registration ***
const stage = new Stage();

const scenes = fs.readdirSync(path.join(__dirname, "scenes")).sort();

scenes.forEach(sceneName => stage.register(require(`./scenes/${sceneName}`)));

// *** Bot init ***
const bot = new Telegraf(token[process.env.NODE_ENV]);

bot.use(session());
bot.use(stage.middleware());

bot.start(async ctx => {
  await ctx.reply(`Привет, ${ctx.chat.first_name}!`);
  await sleep(2000);

  await ctx.reply(
    "Меня зовут Сократ и я могу принять заказ на ланч в моем заведении."
  );

  await ctx.scene.enter("selectTime");
});

// For all non-supportet phases
bot.on("text", ctx => {
  ctx.reply(
    `Ничего не понял. Я разбираюсь только в ланчах, остальное для меня темный лес 🌲`
  );
});

// Payment Responses
bot.on("pre_checkout_query", async ctx => {
  const lunchTime = ctx.update.pre_checkout_query.invoice_payload;

  if (lunchTime) {
    const hour = parseInt(lunchTime);
    const minute = +lunchTime.slice(3);

    if (
      moment()
        .hour(hour)
        .minute(minute)
        .isBefore(moment())
    ) {
      answerPreCheckoutQuery(false, "Вы выбрали неправильное время!");
    } else {
      // Get free tables
      const res = await getTablesForReservation(lunchTime);

      if (res.length) {
        ctx.answerPreCheckoutQuery(true);
      } else {
        ctx.answerPreCheckoutQuery(
          false,
          "Извините, все столы заняты на это время!"
        );
      }
    }
  }
});

bot.on("successful_payment", async ctx => {
  const lunchTime = ctx.update.message.successful_payment.invoice_payload;

  if (lunchTime) {
    const res = await createOrder(lunchTime);

    ctx.reply(
      `Поздравляем, оплата прошла успешно!\nВремя ланча: <b>${lunchTime}</b>\nНомер столика: <b>${
        res.table_id
      }</b>`,
      {
        parse_mode: "HTML"
      }
    );
  }
});

bot.startPolling();

app.listen(config.port);
