const ItemsService = {
    getAllItems(knex){
        return knex.select('*').from('sms_items')
    }, 
    addItem(knex, newItem){
        return knex
            .insert(newItem)
            .into('sms_items')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }, 
    getById(knex, id){
        return knex 
            .from('sms_items')
            .select('*')
            .where('id', id)
            .first()
    },
    getItemsByUserId(knex, user_id){
        return knex
            .from('sms_items')
            .select('*')
            .where('owned_by', user_id)
            .returning('*')
    },
    deleteItem(knex, id){
        return knex('sms_items')
            .where({id})
            .delete()
    }, 
    updateItem(knex, id, newItem){
        return knex('sms_items')
            .where({id})
            .update(newItem)
    }
}

module.exports = ItemsService;