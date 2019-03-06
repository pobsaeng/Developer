module.exports = [
  {
    type: 'tree',
    icon: 'fa fa-dashboard',
    name: 'Dashboard',
    items: [
      {
        type: 'item',
        icon: 'fa fa-circle-o',
        name: 'Home',
        router: {
          name: 'home'
        }
      },
      {
        type: 'item',
        icon: 'fa fa-circle-o',
        name: 'User Management',
        router: {
          name: 'usermanagement'
        }
      }
    ]
  },
  {
    type: 'tree',
    icon: 'fa fa-files-o',
    name: 'Layout Options',
    items: [
      {
        type: 'item',
        icon: 'fa fa-circle-o',
        name: 'Top Navigation'
      },
      {
        type: 'item',
        icon: 'fa fa-circle-o',
        name: 'Boxed'
      }
    ]
  },
  {
    type: 'tree',
    icon: 'fa fa-laptop',
    name: 'UI Elements',
    items: [
      {
        type: 'item',
        icon: 'fa fa-circle-o',
        name: 'General',
        router: {
          name: 'General'
        }
      },
      {
        type: 'item',
        icon: 'fa fa-circle-o',
        name: 'Icons',
        router: {
          name: 'Icons'
        }
      }
    ]
  }
]
