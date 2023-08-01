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