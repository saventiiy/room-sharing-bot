import { Markup, Context } from 'telegraf';

export const mainMenu = (ctx: Context) =>
  Markup.keyboard(
    ctx.from
      ? [
          [
            Markup.button.webApp(
              'Поиск',
              `${process.env.WEB_APP_URL}/searching/${ctx.from.id}`,
            ),
            Markup.button.webApp(
              'Мэтчи',
              `${process.env.WEB_APP_URL}/matches/${ctx.from.id}`,
            )
          ],
          [
            Markup.button.text('Редактировать профиль'),
            Markup.button.text('Помощь')
          ],
        ]
      : [],
  )
    .oneTime()
    .resize();
