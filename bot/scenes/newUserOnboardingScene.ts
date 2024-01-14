import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import { createProfileMenu } from '../menus/createProfileMenu';
import { Profile } from '../../types';

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
newUserOnboardingScene.on(message('web_app_data'), async (ctx) => {
  console.log('Got some web_app_data', ctx.webAppData.data.json());
  const profile: Profile = ctx.webAppData.data.json();
  ctx.reply(`
Ваш профиль:
name: ${profile.name}
dateofbirth: ${profile.dateofbirth}
gender: ${profile.gender}
photos: ${profile.photos}
bio: ${profile.bio}
  `);
  ctx.scene.enter('mainScene');
});
newUserOnboardingScene.on('message', defaultReply);

export { newUserOnboardingScene, NEW_USER_ONBOARDING_SCENE };
