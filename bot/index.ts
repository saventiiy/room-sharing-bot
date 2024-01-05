import 'dotenv/config';
import { Context, Markup, Telegraf } from 'telegraf';

const hasProfile = (id: number) => true;

const WEBAPP_BASE = 'https://brachkow.com';

const bot = new Telegraf(process.env.BOT_TOKEN);

const getMainMenu = (ctx: Context) =>
  Markup.keyboard(
    ctx.from
      ? [
          [
            Markup.button.webApp(
              'Профиль',
              `${WEBAPP_BASE}/profiles/${ctx.from.id}`,
            ),
            Markup.button.webApp(
              'Объявление',
              `${WEBAPP_BASE}/listings/${ctx.from.id}`,
            ),
          ],
          [
            Markup.button.webApp(
              'Мэтчи',
              `${WEBAPP_BASE}/matches/${ctx.from.id}`,
            ),
          ],
        ]
      : [],
  ).resize();

bot.start(async (ctx) => {
  (await hasProfile(ctx.from.id))
    ? ctx.reply(
        'Здраствуйте! У вас уже есть профиль, нажмите "Профиль" чтобы посмотреть его.',
        getMainMenu(ctx),
      )
    : ctx.reply('Welcome');
});

bot.on('message', (ctx) => {
  ctx.reply('Что вы хотите сделать?', getMainMenu(ctx));
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
