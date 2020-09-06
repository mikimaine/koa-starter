/**
 *
 *
 * @export
 * @param {*} permissionModel
 * @param {*} roleModel
 * @param {*} userModel
 * @returns
 */
export default function createMigrationStore(
  config,
  logger,
  permissionModel,
  roleModel,
  userModel
) {
  let roles = config.migration.roles
  let permissions = config.migration.permissions
  let users = config.migration.users

  return {
    async migratePermission() {
      logger.debug(`Checking if permission migration is needed ...`)

      let permissionDocument = await permissionModel.find({})

      if (permissions.length > permissionDocument.length) {
        logger.debug(`Started smart insert for permissions ...`)
        // smart insert
        permissions = permissions.filter(
          perm => permissionDocument.findIndex(val => val.name === perm) === -1
        )

        logger.debug(`Found ${permissions.length} new permissions`)

        try {
          await permissionModel.insertMany([
            ...permissions.map(val => ({ name: val }))
          ])

          logger.debug(`Permissions migrated`)
          return
        } catch (error) {
          logger.debug(`Error migrating permissions ${error}`)
          return
        }
      }
      logger.debug(`Noting to migrate for permissions`)
    },
    async migrateRole() {
      logger.debug(`Checking if role migration is needed ...`)

      await Object.keys(roles).forEach(async index => {
        let roleDocumentCount = await roleModel.countDocuments({ name: index })

        if (roleDocumentCount === 0) {
          try {
            let rolePermission = await permissionModel.find({
              name: {
                $in: roles[index]
              }
            })

            await roleModel.create({
              name: index,
              permissions: rolePermission.map(val => val._id)
            })
          } catch (error) {
            logger.debug(`Error migrating role ${error}`)
          }
        }
      })
      logger.debug(`completed role migration`)
    },
    async migrateUser() {
      logger.debug(`Checking if user migration is needed ...`)
      await users.forEach(async u => {
        let userDocumentCount = await userModel.countDocuments({
          username: u.username
        })

        if (userDocumentCount === 0) {
          try {
            let userRole = await roleModel.find({
              name: {
                $in: u.roles
              }
            })

            await userModel.create({
              ...u,
              roles: userRole.map(val => val._id)
            })
          } catch (error) {
            logger.debug(`Error migrating users ${error}`)
          }
        }
      })
      logger.debug(`completed user migration`)
    }
  }
}
