
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', t => {
    t.increments();
    t.text('fullname');
    t.text('username');
    t.text('password');
    t.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  });
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
  
};
