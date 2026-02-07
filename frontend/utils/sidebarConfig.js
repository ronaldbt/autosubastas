// Configuración del sidebar según roles para sistema de subastas de autos
export const sidebarConfig = {
  superadmin: [
    {
      title: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/superadmin/dashboard',
      badge: null
    },
    {
      title: 'Usuarios',
      icon: 'Users',
      path: '/superadmin/usuarios',
      badge: null
    },
    {
      title: 'Autos',
      icon: 'Car',
      path: '/superadmin/autos',
      badge: null
    },
    {
      title: 'Remates Activos',
      icon: 'Gavel',
      path: '/superadmin/remates',
      badge: null
    },
    {
      title: 'Inspecciones',
      icon: 'ClipboardCheck',
      path: '/superadmin/inspecciones',
      badge: null
    },
    {
      title: 'Pagos',
      icon: 'DollarSign',
      path: '/superadmin/pagos',
      badge: null
    },
    {
      title: 'Reportes',
      icon: 'BarChart3',
      path: '/superadmin/reportes',
      badge: null
    },
    {
      title: 'Configuración',
      icon: 'Settings',
      path: '/superadmin/configuracion',
      badge: null
    }
  ],
  admin: [
    {
      title: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/admin/dashboard',
      badge: null
    },
    {
      title: 'Autos Pendientes',
      icon: 'Car',
      path: '/admin/autos',
      badge: null
    },
    {
      title: 'Remates Activos',
      icon: 'Gavel',
      path: '/admin/remates',
      badge: null
    },
    {
      title: 'Nuevo Peritaje',
      icon: 'FileCheck',
      path: '/admin/autos-peritaje',
      badge: null
    },
    {
      title: 'Peritajes',
      icon: 'ClipboardCheck',
      path: '/admin/inspecciones',
      badge: null
    },
    {
      title: 'Vendedores',
      icon: 'UserCheck',
      path: '/admin/vendedores',
      badge: null
    },
    {
      title: 'Dealers',
      icon: 'Users',
      path: '/admin/dealers',
      badge: null
    },
    {
      title: 'Calendario',
      icon: 'Calendar',
      path: '/admin/calendario',
      badge: null
    },
    {
      title: 'Reportes',
      icon: 'BarChart3',
      path: '/admin/reportes',
      badge: null
    }
  ],
  vendedor: [
    {
      title: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/vendedor/dashboard',
      badge: null
    },
    {
      title: 'Mis Autos',
      icon: 'Car',
      path: '/vendedor/autos',
      badge: null
    },
    {
      title: 'Subastar Auto',
      icon: 'PlusCircle',
      path: '/vendedor/nuevo',
      badge: null
    },
    {
      title: 'Mis Remates',
      icon: 'Gavel',
      path: '/vendedor/remates',
      badge: null
    },
    {
      title: 'Agendar Inspección',
      icon: 'Calendar',
      path: '/vendedor/inspecciones',
      badge: null
    },
    {
      title: 'Mis Pagos',
      icon: 'DollarSign',
      path: '/vendedor/pagos',
      badge: null
    },
    {
      title: 'Historial',
      icon: 'History',
      path: '/vendedor/historial',
      badge: null
    },
    {
      title: 'Mi Perfil',
      icon: 'User',
      path: '/vendedor/mi-perfil',
      badge: null
    }
  ],
  dealer: [
    {
      title: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/dealer/dashboard',
      badge: null
    },
    {
      title: 'Remates en Vivo',
      icon: 'Gavel',
      path: '/dealer/remates-live',
      badge: null
    },
    {
      title: 'Explorar Autos',
      icon: 'Search',
      path: '/dealer/autos',
      badge: null
    },
    {
      title: 'Mis Pujas',
      icon: 'HandCoins',
      path: '/dealer/pujas',
      badge: null
    },
    {
      title: 'Autos Ganados',
      icon: 'Trophy',
      path: '/dealer/ganados',
      badge: null
    },
    {
      title: 'Mis Compras',
      icon: 'ShoppingCart',
      path: '/dealer/compras',
      badge: null
    },
    {
      title: 'Mi Perfil',
      icon: 'User',
      path: '/dealer/mi-perfil',
      badge: null
    }
  ],
  perito: [
    {
      title: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/perito/dashboard',
      badge: null
    },
    {
      title: 'Mis Peritajes',
      icon: 'ClipboardCheck',
      path: '/perito/peritajes',
      badge: null
    },
    {
      title: 'Nuevo Peritaje',
      icon: 'PlusCircle',
      path: '/perito/peritajes/nuevo',
      badge: null
    }
  ]
}

// Obtener configuración según rol
export const getSidebarConfig = (rol) => {
  return sidebarConfig[rol] || []
}
