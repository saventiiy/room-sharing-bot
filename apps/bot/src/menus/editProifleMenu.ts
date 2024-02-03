import { Context, Markup } from 'telegraf';

export const editProfileMenu = (isHavingRoom: boolean, ctx: Context) => {
  const buttons = [
    Markup.button.webApp(
      'Редактировать профиль',
      `${process.env.WEB_APP_URL}/editProfile/${ctx.from.id}`,
    ),
  ];

  if (isHavingRoom) {
    buttons.push(
      Markup.button.webApp(
        'Редактировать комнату',
        `${process.env.WEB_APP_URL}/anotherPage/${ctx.from.id}`,
      )
    );
  }

  return Markup.keyboard(buttons)
    .oneTime()
    .resize();
};