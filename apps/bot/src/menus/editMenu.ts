import { Context, Markup } from 'telegraf';
import { LookingFor } from 'types';

export const editMenu = (lookingFor: LookingFor, hasRoom: boolean, ctx: Context) => {
  const buttons = [
    Markup.button.webApp(
      'Редактировать профиль',
      `${process.env.WEB_APP_URL}/editProfile/${ctx.from?.id}/${ctx.from?.username}`,
    ),
  ];

  if (lookingFor == LookingFor.Flatmate && hasRoom) {
    buttons.push(
      Markup.button.webApp(
        'Редактировать комнату',
        `${process.env.WEB_APP_URL}/editRoom/${ctx.from?.id}`,
      )
    );
  }

  return Markup.keyboard(buttons)
    .oneTime()
    .resize();
};