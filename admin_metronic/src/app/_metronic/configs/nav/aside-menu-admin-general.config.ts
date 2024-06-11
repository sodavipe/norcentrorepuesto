export const AsideMenuAdminGeneral = {
    items: [
      {
        title: 'Dashboard',
        root: true,
        name: "dashboard",
        icon: 'flaticon2-architecture-and-city',
        svg: './assets/media/svg/icons/Design/Layers.svg',
        page: '/dashboard',
        translate: 'MENU.DASHBOARD',
        bullet: 'dot',
      },
      { section: 'Usuario' },
      {
        title: 'Usuarios',
        root: true,
        name: "users",
        bullet: 'dot',
        icon: 'flaticon2-user-outline-symbol',
        svg: './assets/media/svg/icons/General/User.svg',
        page: '/users',
        submenu: [
          {
            title: 'Gestion Usuarios',
            page: '/users/list'
          }
        ]
      },
      { section: 'Productos' },
      {
        title: 'Categorias',
        root: true,
        name: "categorias",
        bullet: 'dot',
        icon: 'flaticon2-user-outline-symbol',
        svg: './assets/media/svg/icons/Home/Commode2.svg',
        page: '/categorias',
        submenu: [
          {
            title: 'Lista Categorias',
            page: '/categorias/list'
          }
        ]
      },
      {
        title: 'Productos',
        root: true,
        name: "productos",
        bullet: 'dot',
        icon: 'flaticon2-user-outline-symbol',
        svg: './assets/media/svg/icons/Devices/TV2.svg',
        page: '/productos',
        submenu: [
          {
            title: 'Crear Producto',
            page: '/productos/registrar-producto'
          },
          {
            title: 'Listar Productos',
            page: '/productos/lista-de-todos-los-productos'
          },
        ]
      },
      {
        title: 'Sliders',
        root: true,
        name: "sliders",
        bullet: 'dot',
        icon: 'flaticon2-user-outline-symbol',
        svg: './assets/media/svg/icons/Design/Image.svg',
        page: '/sliders',
        submenu: [
          {
            title: 'Lista de Sliders',
            page: '/sliders/lista-sliders'
          }
        ]
      },
    ]
}