exports.up = function(knex, Promise) {
    return knex.schema.alterTable('photos', t => {
        t.integer('user_id').unsigned().index().references('users.id').notNullable();
    });

};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('photos', t => {
    t.dropColumn('user_id');
    });
};
