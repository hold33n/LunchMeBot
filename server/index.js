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
  ctx.session.dishes = {
    lunchTime: null,
    dishesNum: null,
    firstDish: null,
    secondDish: null,
    thirdDish: null,
    extraDishes: []
  };

  await ctx.reply(`Привет, ${ctx.chat.first_name}!`);
  await sleep(2000);

  await ctx.reply(
    "Меня зовут Сократ и я могу принять заказ на ланч в моем заведении."
  );

  await ctx.scene.enter("selectTime");
});

// Payment Responses
bot.on("pre_checkout_query", async ctx => {
  const { lunchTime } = JSON.parse(
    ctx.update.pre_checkout_query.invoice_payload
  );

  if (lunchTime) {
    const hour = parseInt(lunchTime);
    const minute = +lunchTime.slice(3);

    console.log(
      moment()
        .hour(hour)
        .minute(minute),
      moment(),
      moment()
        .hour(hour)
        .minute(minute)
        .isBefore(moment())
    );

    if (
      moment()
        .hour(hour)
        .minute(minute)
        .isBefore(moment())
    ) {
      ctx.answerPreCheckoutQuery(false, "Вы выбрали неправильное время!");
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
  const { lunchTime, products, sum } = JSON.parse(
    ctx.update.message.successful_payment.invoice_payload
  );

  // console.log(ctx);

  if (lunchTime) {
    const res = await createOrder(lunchTime, products, sum);

    await ctx.reply(
      `Поздравляем, оплата прошла успешно!\nВремя ланча: <b>${lunchTime}</b>\nНомер столика: <b>${
        res.table_id
      }</b>`,
      {
        reply_markup: {
          keyboard: [[{ text: "Сделать новый заказ" }]],
          resize_keyboard: true
        },
        parse_mode: "HTML"
      }
    );

    ctx.session.dishes = {
      lunchTime: null,
      dishesNum: null,
      firstDish: null,
      secondDish: null,
      thirdDish: null,
      extraDishes: []
    };
  }
});

bot.hears("Сделать новый заказ", ctx => ctx.scene.enter("selectTime"));

// For all non-supportet phases
bot.on("text", ctx => {
  ctx.reply(
    `Ничего не понял. Я разбираюсь только в ланчах, остальное для меня темный лес 🌲`
  );
});

bot.startPolling();

app.listen(config.port);
