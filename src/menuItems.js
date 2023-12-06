export const menuItems = [
  
  {
    title: 'Справочники',
    url: '/dictionaries',
    submenu: [
      {
        title: 'Метеостанции',
        url: 'stations',
      },
      {
        title: 'Гидропосты',
        url: 'hydroPosts',
      },
      {
        title: 'Измерения',
        url: 'measurements',
      },
    ],
  },
  {
    title: 'Services',
    url: '/services',
    submenu: [
      {
        title: 'web design',
        url: 'web-design',
      },
      {
        title: 'web development',
        url: 'web-dev',
      },
      {
        title: 'SEO',
        url: 'seo',
      },
    ],
  },
  {
    title: 'Телеграммы',
    url: '/telegrams',
    submenu: [
      {
        title: 'Синоптические',
        url: 'synopticObservations',
      },
      {
        title: 'Штормовые',
        url: 'storms',
      },
      {
        title: 'Порывы ветра',
        url: 'otherDataWinds',
      },
      {
        title: 'Температура на 8 часов',
        url: 'otherDataTemps',
      },
      {
        title: 'Средняя температура за сутки',
        url: 'avgDailyTemp',
      },
      {
        title: 'Синоптические данные',
        url: 'synopticData',
      },
      {
        title: 'Осадки',
        url: 'otherDataPrecipitation',
      },
    ]
  },
  {
    title: 'Сеанс',
    url: '/seance',
    submenu: [
      {
        title: 'Профиль',
        url: 'profile'
      },
      {
        title: 'Выход',
        url: '/logout'
      }
    ]
  },
];