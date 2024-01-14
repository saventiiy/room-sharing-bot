import 'dotenv/config';
import { Context, Markup, Telegraf, Scenes, session } from 'telegraf';
import { hasProfile } from '../sdk';

const BOT_TOKEN = String(process.env.BOT_TOKEN);
const WEB_APP_URL = String(process.env.WEB_APP_URL);

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

const returningUserOnboardingScene = new Scenes.BaseScene<Scenes.SceneContext>(
  'returningUserOnboarding',
);
returningUserOnboardingScene.enter((ctx) => {
  console.log('Entering returningUserOnboardingScene');
  ctx.reply(
    'Здраствуйте! У вас уже есть профиль, нажмите "Профиль" чтобы посмотреть его.',
    getMainMenu(ctx),
  );
});

const newUserOnboardingScene = new Scenes.BaseScene<Scenes.SceneContext>(
  'newUserOnboarding',
);
newUserOnboardingScene.enter((ctx) => {
  console.log('Entering newUserOnboardingScene');
  ctx.reply(
    'Здраствуйте! У вас еще нет профиля, нажмите "Профиль" чтобы создать его.',
    Markup.inlineKeyboard([
      Markup.button.webApp(
        'Создать профиль',
        `${WEB_APP_URL}/profiles/${ctx.from.id}`,
      ),
    ]),
  );
});

const bot = new Telegraf<Scenes.SceneContext>(BOT_TOKEN);

const stage = new Scenes.Stage<Scenes.SceneContext>(
  [newUserOnboardingScene, returningUserOnboardingScene],
  {
    ttl: 10,
  },
);

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  if (await hasProfile(String(ctx.from.id))) {
    ctx.scene.enter('returningUserOnboarding');
  } else {
    ctx.scene.enter('newUserOnboarding');
  }
});

bot.on('message', (ctx) => {
  ctx.reply('Что вы хотите сделать?', getMainMenu(ctx));
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
