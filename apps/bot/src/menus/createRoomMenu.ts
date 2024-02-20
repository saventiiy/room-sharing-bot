import { Context, Markup } from 'telegraf';

export const createRoomMenu = (ctx: Context) =>
  Markup.keyboard([
    Markup.button.webApp(
      'Создать профиль комнаты',
      `${process.env.WEB_APP_URL}/rooms/${ctx.from?.id}`,
    ),
  ])
    .oneTime()
    .resize();
