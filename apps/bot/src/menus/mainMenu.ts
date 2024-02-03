import { Markup, Context } from 'telegraf';

export const mainMenu = (ctx: Context) =>
  Markup.keyboard(
    ctx.from
      ? [
          [
            'Редактировать профиль',

            Markup.button.webApp(
              'Объявление',
              `${process.env.WEB_APP_URL}/listings/${ctx.from.id}`,
            ),
          ],
          [
            Markup.button.webApp(
              'Мэтчи',
              `${process.env.WEB_APP_URL}/matches/${ctx.from.id}`,
            ),
          ],
        ]
      : [],
  )
    .oneTime()
    .resize();
