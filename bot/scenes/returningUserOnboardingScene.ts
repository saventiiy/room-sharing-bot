import { Scenes } from 'telegraf';
import { mainMenu } from '../menus/mainMenu';

const RETURNING_USER_ONBOARDING_SCENE = 'returningUserOnboarding';

const returningUserOnboardingScene = new Scenes.BaseScene<Scenes.SceneContext>(
  RETURNING_USER_ONBOARDING_SCENE,
);

returningUserOnboardingScene.enter((ctx) => {
  console.log(`Entering ${RETURNING_USER_ONBOARDING_SCENE}`);
  ctx.reply(
    'Здраствуйте! У вас уже есть профиль, нажмите "Профиль" чтобы посмотреть его.',
    mainMenu(ctx),
  );
});

export { returningUserOnboardingScene, RETURNING_USER_ONBOARDING_SCENE };
