const UsersService = {
    getAllUsers(knex){
        return knex.select('*').from('sms_users')
    }, 
    addUser(knex, newUser){
        return knex
            .insert(newUser)
            .into('sms_users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }, 
    getById(knex, id){
        return knex 
            .from('sms_users')
            .select('*')
            .where('id', id)
            .first()
    },
    getByEmail(knex, email){
        return knex 
            .from('sms_users')
            .select('*')
            .where('email', email)
            .first()
    },
    getItemsByUserId(knex, user_id){
        console.log("user id is ", user_id)
        return knex
            .from('sms_items')
            .select('*')
            .where('owned_by', user_id)
            .returning('*')
    },
    deleteUser(knex, id){
        return knex('sms_users')
            .where({id})
            .delete()
    }, 
    updateUser(knex, id, newUser){
        return knex('sms_users')
            .where({id})
            .update(newUser)
    }
}

module.exports = UsersService;