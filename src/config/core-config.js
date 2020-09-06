const permissions = [
  'create user',
  'view any user',
  'view user',
  'update user',
  'remove user',

  'create role',
  'view any role',
  'view role',
  'update role',
  'remove role',

  'create profile',
  'view any profile',
  'view profile',
  'update profile',
  'remove profile',

  'create media',
  'view any media',
  'view media',
  'update media',
  'remove media',

  'add something',
  'add another thing',
  'something another thing',
  'something another thing2'
]

const roles = {
  admin: [...permissions],
  user: ['view profile']
}

const users = [
  {
    username: 'admin',
    email: 'super@admin.com',
    password: 'supersecret',
    roles: ['admin']
  }
]

export default { migration: { permissions, roles, users } }
