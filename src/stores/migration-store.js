/**
 *
 *
 * @export
 * @param {*} permissionModel
 * @param {*} roleModel
 * @param {*} userModel
 * @returns
 */
export default function migrationStore(
  config,
  permissionModel,
  roleModel,
  userModel
) {
  let roles = config.migration.roles
  let permissions = config.migration.permissions
  let users = config.migration.users

  return {
    async migratePermission() {
      let permissionDocument = await permissionModel.find({})
      if (permissions.length > permissionDocument.length) {
        // smart insert
        permissions = permissions.filter(
          perm => permissionDocument.findIndex(val => val.name === perm) === -1
        )

        await permissionModel.insertMany([
          ...permissions.map(val => ({ name: val }))
        ])
      }
    },
    async migrateRole() {
      await Object.keys(roles).forEach(async index => {
        let roleDocumentCount = await roleModel.countDocuments({ name: index })
        if (roleDocumentCount === 0) {
          let rolePermission = await permissionModel.find({
            name: {
              $in: roles[index]
            }
          })
          await roleModel.create({
            name: index,
            permissions: rolePermission.map(val => val._id)
          })
        }
      })
    },
    async migrateUser() {
      await users.forEach(async u => {
        let userDocumentCount = await userModel.countDocuments({
          username: u.username
        })
        if (userDocumentCount === 0) {
          let userRole = await roleModel.find({
            name: {
              $in: u.roles
            }
          })

          await userModel.create({
            ...u,
            roles: userRole.map(val => val._id)
          })
        }
      })
    }
  }
}
