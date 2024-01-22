import { Context, Markup } from 'telegraf';

export const createProfileMenu = (ctx: Context) => {
  return Markup.keyboard([
    Markup.button.webApp(
      'Создать профиль',
      `${process.env.WEB_APP_URL}/profiles/${ctx.from?.id}`,
    ),
  ])
    .oneTime()
    .resize();
};
