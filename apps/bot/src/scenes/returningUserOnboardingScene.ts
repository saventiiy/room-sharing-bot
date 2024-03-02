import { Scenes } from 'telegraf';
import { MAIN_SCENE } from './mainScene';

const RETURNING_USER_ONBOARDING_SCENE = 'returningUserOnboarding';

const returningUserOnboardingScene = new Scenes.BaseScene<Scenes.SceneContext>(
  RETURNING_USER_ONBOARDING_SCENE,
);

returningUserOnboardingScene.enter((ctx) => {
  ctx.reply(
    'Здраствуйте! У вас уже есть профиль, нажмите "Редактировать профиль" чтобы посмотреть его.',
  );
  ctx.scene.enter(MAIN_SCENE);
});

export { returningUserOnboardingScene, RETURNING_USER_ONBOARDING_SCENE };
