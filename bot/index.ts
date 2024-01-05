import 'dotenv/config';
import { Context, Markup, Telegraf } from 'telegraf';
import { hasProfile } from '../sdk';

const BOT_TOKEN = String(process.env.BOT_TOKEN);
const WEB_APP_URL = String(process.env.WEB_APP_URL);

const bot = new Telegraf(BOT_TOKEN);

const getMainMenu = (ctx: Context) =>
  Markup.keyboard(
    ctx.from
      ? [
          [
            Markup.button.webApp(
              'Профиль',
              `${WEB_APP_URL}/profiles/${ctx.from.id}`,
            ),
            Markup.button.webApp(
              'Объявление',
              `${WEB_APP_URL}/listings/${ctx.from.id}`,
            ),
          ],
          [
            Markup.button.webApp(
              'Мэтчи',
              `${WEB_APP_URL}/matches/${ctx.from.id}`,
            ),
          ],
        ]
      : [],
  ).resize();

bot.start(async (ctx) => {
  (await hasProfile(String(ctx.from.id)))
    ? ctx.reply(
        'Здраствуйте! У вас уже есть профиль, нажмите "Профиль" чтобы посмотреть его.',
        getMainMenu(ctx),
      )
    : ctx.reply(
        'Здраствуйте! У вас еще нет профиля, нажмите "Профиль" чтобы создать его.',
        Markup.inlineKeyboard([
          Markup.button.webApp(
            'Создать профиль',
            `${WEB_APP_URL}/profiles/${ctx.from.id}`,
          ),
        ]),
      );
});

bot.on('message', (ctx) => {
  ctx.reply('Что вы хотите сделать?', getMainMenu(ctx));
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
