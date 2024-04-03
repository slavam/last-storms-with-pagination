export const menuItems = [
  
  {
    title: 'Данные',
    url: '/dictionaries',
    submenu: [
      {
        title: 'Метеостанции',
        url: 'stations',
      },
      {
        title: 'Гидропосты',
        url: 'hydroposts',
      },
      {
        title: 'Измерения',
        url: 'measurements',
      },
      {
        title: 'Наблюдения',
        url: 'observations',
      },
      {
        title: 'Метеостанции SOAP',
        url: 'stationsSoap'
      },
      {
        title: 'Observations SOAP',
        url: 'observationsSoap'
      }
    ],
  },
  {
    title: 'Бюллетени',
    url: '/bulletins',
    submenu: [
      {
        title: 'Штормовые предупреждения',
        url: 'stormBulletins',
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
        title: 'Донбасстеплоэнерго',
        url: 'monthlyAvgTemp',
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
        title: 'Радиация',
        url: 'radiation',
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