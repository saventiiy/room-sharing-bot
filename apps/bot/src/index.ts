import 'dotenv/config';
import { Telegraf, Scenes, session } from 'telegraf';
import { hasProfile } from 'sdk';
import {
  returningUserOnboardingScene,
  RETURNING_USER_ONBOARDING_SCENE,
} from './scenes/returningUserOnboardingScene';
import {
  newUserOnboardingScene,
  NEW_USER_ONBOARDING_SCENE,
} from './scenes/newUserOnboardingScene';
import { MAIN_SCENE, mainScene } from './scenes/mainScene';
import { newRoomOnboardingScene } from './scenes/newRoomOnboardingScene';
import { EDIT_SCENE, editScene } from './scenes/editScene';
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

const bot = new Telegraf<Scenes.SceneContext>(process.env.BOT_TOKEN);

const stage = new Scenes.Stage<Scenes.SceneContext>([
  mainScene,
  newUserOnboardingScene,
  newRoomOnboardingScene,
  editScene,
  returningUserOnboardingScene,
]);

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  if (await hasProfile(String(ctx.from.id))) {
    ctx.scene.enter(RETURNING_USER_ONBOARDING_SCENE);
  } else {
    ctx.scene.enter(NEW_USER_ONBOARDING_SCENE);
  }
});

bot.on('message', (ctx) => {
  if(ctx.message.text === 'Редактировать профиль'){
    ctx.scene.enter(EDIT_SCENE);
  } else if(ctx.message.text === 'Назад'){
    ctx.scene.enter(MAIN_SCENE);
  } else if(ctx.message.text === 'Помощь'){
    ctx.reply('Если вам нужна помощь напишите нам');
  }
});

bot.launch();

Sentry.init({
  dsn: "https://f5ea0803ecb508eb33dc675f93cdf571@o4506802556502016.ingest.sentry.io/4506802567249920",
  integrations: [
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
