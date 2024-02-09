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
import { mainScene } from './scenes/mainScene';
import { newRoomOnboardingScene } from './scenes/newRoomOnboardingScene';
import { EDIT_SCENE, editScene } from './scenes/editScene';

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
  console.log('Bot started');
  if (await hasProfile(String(ctx.from.id))) {
    ctx.scene.enter(RETURNING_USER_ONBOARDING_SCENE);
  } else {
    ctx.scene.enter(NEW_USER_ONBOARDING_SCENE);
  }
});

bot.on('message', (ctx) => {
  console.log('pong:', ctx.message);
  if(ctx.message.text == 'Редактировать профиль'){
    ctx.scene.enter(EDIT_SCENE);
  }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
