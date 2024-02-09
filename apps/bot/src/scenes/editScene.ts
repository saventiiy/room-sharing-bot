import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import { LookingFor, Profile, Room } from 'types';
import { NEW_ROOM_ONBOARDING_SCENE } from './newRoomOnboardingScene';
import { MAIN_SCENE } from './mainScene';
import { editMenu } from '../menus/editMenu';
import { getProfile, hasRoom } from 'sdk';

const EDIT_SCENE = 'edit' 

const editScene = new Scenes.BaseScene<Scenes.SceneContext>(
  EDIT_SCENE,
);

let profileSnapshot: Profile = null;

const defaultReply = async (ctx: Scenes.SceneContext) => {
  profileSnapshot = await getProfile(String(ctx.from?.id));
  const hasRoomData = await hasRoom(String(ctx.from?.id));
  ctx.reply(
    'Что вы хотите отредактировать?',
    editMenu(profileSnapshot.lookingFor, hasRoomData, ctx),
  );
};

editScene.enter((ctx) => {
  console.log(`Entering ${EDIT_SCENE}`);
  defaultReply(ctx);
});

editScene.on(message('web_app_data'), async (ctx) => {
  console.log('Got some web_app_data', ctx.webAppData?.data.json());
  const profile: Profile | undefined = ctx.webAppData?.data.json();
  ctx.reply(JSON.stringify(profile, null, 2));
  const hasR = await hasRoom(String(ctx.from.id));
  if (profile != undefined && 
    profileSnapshot.lookingFor == LookingFor.Room && profile.lookingFor == LookingFor.Flatmate 
    && !hasR) {
    ctx.scene.enter(NEW_ROOM_ONBOARDING_SCENE);
  } else {
    ctx.scene.enter(MAIN_SCENE);
  }
});

editScene.on('message', defaultReply);

export { editScene, EDIT_SCENE };