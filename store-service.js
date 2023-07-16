const Sequelize = require('sequelize');
var sequelize = new Sequelize('vbnkvrau', 'vbnkvrau', 'QF7KOMiqReJJeBpBigMs8F8ecWlW7IrO', {
    host: 'lallah.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

const Item = sequelize.define('item', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
    price: Sequelize.DOUBLE
});

// Define the Category model
const Category = sequelize.define('category', {
    category: Sequelize.STRING
});

Item.belongsTo(Category, { foreignKey: 'category' });

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        Item.sync()
            .then(() => {
                Category.sync()
                    .then(() => resolve())
                    .catch(() => reject('Unable to sync the database'));
            })
            .catch(() => reject('Unable to sync the database'));
    });
};


module.exports.getAllItems = () => {
    return new Promise((resolve, reject) => {
        Item.findAll()
            .then((items) => resolve(items))
            .catch(() => reject('No results returned'));
    });
}


module.exports.getPublishedItems = () => {
    return new Promise((resolve, reject) => {
        Item.findAll({ where: { published: true } })
            .then((items) => resolve(items))
            .catch(() => reject('No results returned'));
    });
};

module.exports.getCategories = () => {
    return new Promise((resolve, reject) => {
        Category.findAll()
            .then((categories) => resolve(categories))
            .catch(() => reject('No results returned'));
    });
};


module.exports.addItem = (itemData) => {
    itemData.published = itemData.published ? true : false;

    for (const prop in itemData) {
        if (itemData[prop] === '') {
            itemData[prop] = null;
        }
    }

    itemData.postDate = new Date();

    return new Promise((resolve, reject) => {
        Item.create(itemData)
            .then(() => resolve())
            .catch(() => reject('Unable to create post'));
    });
};

module.exports.getItemsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Item.findAll({ where: { category } })
            .then((items) => resolve(items))
            .catch(() => reject('No results returned'));
    });
};

module.exports.getItemsByMinDate = (minDateStr) => {
    const { Op } = require('sequelize');
    return new Promise((resolve, reject) => {
        Item.findAll({
            where: {
                postDate: {
                    [Op.gte]: new Date(minDateStr)
                }
            }
        })
            .then((items) => resolve(items))
            .catch(() => reject('No results returned'));
    });
};

module.exports.getItemById = (id) => {
    return new Promise((resolve, reject) => {
        Item.findAll({ where: { id } })
            .then((items) => resolve(items[0]))
            .catch(() => reject('No results returned'));
    });
};


module.exports.getPublishedItemsByCategory = (category) => { 
    return new Promise((resolve, reject) => {
        Item.findAll({
            where: { category: category, published: true }
        }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned");
        })
    })
};