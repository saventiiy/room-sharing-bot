import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import { LookingFor, Profile } from 'types';
import { NEW_ROOM_ONBOARDING_SCENE } from './newRoomOnboardingScene';
import { MAIN_SCENE } from './mainScene';
import { editProfileMenu } from '../menus/editProfileMenu';
import { getProfile } from 'sdk';

const EDIT_PROFILE_SCENE = 'editProfile' 
const editProfileScene = new Scenes.BaseScene<Scenes.SceneContext>(
  'editProfile',
);

const defaultReply = async (ctx: Scenes.SceneContext) => {
  const profile = await getProfile(String(ctx.from.id));
  ctx.reply(
    'Что вы хотите отредактировать?',
    editProfileMenu(profile.lookingFor, ctx),
  );
};

editProfileScene.enter((ctx) => {
  console.log('Entering editProfile');
  defaultReply(ctx);
});

editProfileScene.on(message('web_app_data'), async (ctx) => {
  console.log('Got some web_app_data', ctx.webAppData?.data.json());
  const profile: Profile | undefined = ctx.webAppData?.data.json();
  ctx.reply(JSON.stringify(profile, null, 2));

  if (profile != undefined && profile.lookingFor == LookingFor.Flatmate) {
    ctx.scene.enter(NEW_ROOM_ONBOARDING_SCENE);
  } else {
    ctx.scene.enter(MAIN_SCENE);
  }
});

editProfileScene.on('message', defaultReply);

export { editProfileScene, EDIT_PROFILE_SCENE };