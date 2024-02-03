import { Scenes } from 'telegraf';
import { mainMenu } from '../menus/mainMenu';
import { EDIT_PROFILE_SCENE } from './editProfileScene';

const MAIN_SCENE = 'mainScene';

const mainScene = new Scenes.BaseScene<Scenes.SceneContext>(MAIN_SCENE);

mainScene.enter((ctx) => {
  console.log(`Entering ${MAIN_SCENE}`);
  ctx.reply('Здраствуйте!', mainMenu(ctx));
});

//any other way to handle a message?
//mainScene.action(a) dont work with reply keyboard
mainScene.on('message', (ctx) => {
  if(ctx.message.text == 'Редактировать профиль'){
    ctx.scene.enter(EDIT_PROFILE_SCENE);
  }
});

export { MAIN_SCENE, mainScene };