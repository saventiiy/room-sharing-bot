import { Scenes } from 'telegraf';
import { createProfileMenu } from '../menus/createProfileMenu';

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
  console.log('Entering newUserOnboardingScene');
  defaultReply(ctx);
});
newUserOnboardingScene.on('message', defaultReply);

export { newUserOnboardingScene, NEW_USER_ONBOARDING_SCENE };
