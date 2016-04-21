
exports.up = function(knex, Promise) {
  return knex.schema.createTable('photos', t => {
    t.increments();
    t.text('desc');
    t.text('url');
    t.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  });
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('photos');
  
};
