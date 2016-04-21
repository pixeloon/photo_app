// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'photo_app'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
