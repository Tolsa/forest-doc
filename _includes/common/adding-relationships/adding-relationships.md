## Adding the relationships

As Lumber generates an admin microservice from the database schema, it only
creates belongsTo relationships, based on all your foreign keys. Please note
that some ORMs do not create foreign key constraints. This means that in some
cases, you will have to add belongsTo relationships manually. Lastly, as
databases don't have the notion of inverse relationships, you will need to add
hasMany or hasOne relationships manually.

The generated admin microservice uses the ORM Sequelize. <a
href="http://docs.sequelizejs.com/" target="_blank">Check out their
documentation</a> for advanced model customization.

### Example: "order" belongsTo "customer"

Open the file `models/orders.js` and declare the belongsTo relationship in the
`associate()` function.

```javascript
module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Order = sequelize.define('orders', {
    // ...
  });

  Order.associate = function () {
    Order.belongsTo(models.customers, {
      foreignKey: 'customer_id'
    });
  };

  return Model;
};
```

![belongsTo relationship](/public/img/adding-relationships-2.png "belongsTo relationship")

### Example: "customer" hasMany "orders"

Open the file `models/customers.js` and declare the hasMany relationship in the
`associate()` function.

```javascript
module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Customer = sequelize.define('customers', {
    // ...
  });

  Customer.associate = function () {
    Customer.hasMany(models.orders, {
      foreignKey: 'customer_id'
    });
  };

  return Model;
};

```

![hasMany relationship](/public/img/adding-relationships-1.png "hasMany relationship")
