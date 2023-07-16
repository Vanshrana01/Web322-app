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

var Item = sequelize.define('item', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
    price: Sequelize.DOUBLE
});

// Define the Category model
var Category = sequelize.define('category', {
    category: Sequelize.STRING
});

Item.belongsTo(Category, {foreignKey: 'category'});

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        reject();
    })
};


module.exports.getAllItems = () => {
    return new Promise((resolve, reject) => {
        reject();
    })
};

module.exports.getPublishedItems = () => {
    return new Promise((resolve, reject) => {
        reject();
    })
};

module.exports.getCategories = () => {
    return new Promise((resolve, reject) => {
        reject();
    })
};

module.exports.addItem = (itemData) => {
    return new Promise((resolve, reject) => {
        reject();
    })
};

module.exports.getItemsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        reject();
    })
};


module.exports.getItemsByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
        reject();
    })
};

module.exports.getItemById = (id) => {
    return new Promise((resolve, reject) => {
        reject();
    })
};

function getPublishedItemsByCategory(category) {
    return new Promise((resolve, reject) => {
        reject();
    })
};
