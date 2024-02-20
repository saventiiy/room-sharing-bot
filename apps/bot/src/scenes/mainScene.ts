import { Scenes } from 'telegraf';
import { mainMenu } from '../menus/mainMenu';
import { EDIT_SCENE } from './editScene';

const MAIN_SCENE = 'mainScene';

const mainScene = new Scenes.BaseScene<Scenes.SceneContext>(MAIN_SCENE);

mainScene.enter((ctx) => {
  console.log(`Entering ${MAIN_SCENE}`);
  ctx.reply('Здраствуйте!', mainMenu(ctx));
});

export { MAIN_SCENE, mainScene };