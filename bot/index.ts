import 'dotenv/config';
import { Markup, Telegraf } from 'telegraf';

const hasProfile = (id: number) => true;

const WEBAPP_BASE = 'https://brachkow.com';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  (await hasProfile(ctx.from.id))
    ? ctx.reply('Welcome back')
    : ctx.reply('Welcome');
});

bot.on('message', (ctx) => {
  ctx.reply(
    'Что вы хотите сделать?',
    Markup.keyboard([
      [
        Markup.button.webApp('Профиль', `${WEBAPP_BASE}/profile`),
        Markup.button.webApp('Объявление', `${WEBAPP_BASE}/listing`),
      ],
      [Markup.button.webApp('Мэтчи', `${WEBAPP_BASE}/matches`)],
    ]).resize(),
  );
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
