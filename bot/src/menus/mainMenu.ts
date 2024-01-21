import { Markup, Context } from 'telegraf';

export const mainMenu = (ctx: Context) =>
  Markup.keyboard(
    ctx.from
      ? [
          [
            Markup.button.webApp(
              'Профиль',
              `${process.env.WEB_APP_URL}/profiles/${ctx.from.id}`,
            ),
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
