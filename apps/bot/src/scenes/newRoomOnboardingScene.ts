import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import { Room } from 'types';
import { createRoomMenu } from '../menus/createRoomMenu';
import { MAIN_SCENE } from './mainScene';

const NEW_ROOM_ONBOARDING_SCENE = 'newRoomOnboarding';

const newRoomOnboardingScene = new Scenes.BaseScene<Scenes.SceneContext>(
  NEW_ROOM_ONBOARDING_SCENE,
);

const defaultReply = (ctx: Scenes.SceneContext) => {
  ctx.reply('Давайте заполним профиль комнтаы', createRoomMenu(ctx));
};

newRoomOnboardingScene.enter((ctx) => {
  console.log('Entering newUserOnboardingScene');
  defaultReply(ctx);
});

newRoomOnboardingScene.on(message('web_app_data'), async (ctx) => {
  console.log('Got some web_app_data', ctx.webAppData?.data.json());
  const room: Room | undefined = ctx.webAppData?.data.json();
  ctx.reply(JSON.stringify(room, null, 2));
  ctx.scene.enter(MAIN_SCENE);
});

newRoomOnboardingScene.on('message', defaultReply);

export { newRoomOnboardingScene, NEW_ROOM_ONBOARDING_SCENE };
