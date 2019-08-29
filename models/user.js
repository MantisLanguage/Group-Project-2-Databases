module.exports = function(sequelize, DataTypes) {
    let User = sequelize.define("User", {
        displayName: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING

    });

    User.associate = function(models) {
        User.hasMany(models.Post, {
            onDelete: "cascade"
        });
    };

    return User;
};
