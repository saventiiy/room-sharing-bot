import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import { createProfileMenu } from '../menus/createProfileMenu';
import { LookingFor, Profile } from 'types';
import { NEW_ROOM_ONBOARDING_SCENE } from './newRoomOnboardingScene';
import { MAIN_SCENE } from './mainScene';

const NEW_USER_ONBOARDING_SCENE = 'newUserOnboarding';

const newUserOnboardingScene = new Scenes.BaseScene<Scenes.SceneContext>(
  'newUserOnboarding',
);

const defaultReply = (ctx: Scenes.SceneContext) => {
  ctx.reply(
    'Здраствуйте! У вас еще нет профиля, нажмите "Создать профиль" чтобы создать его.',
    createProfileMenu(ctx),
  );
};

newUserOnboardingScene.enter((ctx) => {
  defaultReply(ctx);
});

newUserOnboardingScene.on(message('web_app_data'), async (ctx) => {
  const profile: Profile | undefined = ctx.webAppData?.data.json();
  if (profile != undefined && profile.lookingFor === LookingFor.Flatmate) {
    ctx.scene.enter(NEW_ROOM_ONBOARDING_SCENE);
  } else {
    ctx.scene.enter(MAIN_SCENE);
  }
});

newUserOnboardingScene.on('message', defaultReply);

export { newUserOnboardingScene, NEW_USER_ONBOARDING_SCENE };
