import { Scenes } from 'telegraf';
import { createProfileMenu } from '../menus/createProfileMenu';

const NEW_USER_ONBOARDING_SCENE = 'newUserOnboarding';

const newUserOnboardingScene = new Scenes.BaseScene<Scenes.SceneContext>(
  'newUserOnboarding',
);

newUserOnboardingScene.enter((ctx) => {
  console.log('Entering newUserOnboardingScene');
  ctx.reply(
    'Здраствуйте! У вас еще нет профиля, нажмите "Профиль" чтобы создать его.',
    createProfileMenu(ctx),
  );
});

export { newUserOnboardingScene, NEW_USER_ONBOARDING_SCENE };
