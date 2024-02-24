import { Scenes } from 'telegraf';
import { mainMenu } from '../menus/mainMenu';

const MAIN_SCENE = 'mainScene';

const mainScene = new Scenes.BaseScene<Scenes.SceneContext>(MAIN_SCENE);

mainScene.enter((ctx) => {
  ctx.reply('Здраствуйте!', mainMenu(ctx));
});

export { MAIN_SCENE, mainScene };