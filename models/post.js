module.exports = function(sequelize, DataTypes) {
  let Post = sequelize.define("Post", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: "/images/pine-forest-tree-silhouette-pine-forest-mask-jpg-pejrzo-clipart.jpg",
      allowNull: false
    },
    likeValue: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  });

  Post.associate = function(models) {
    Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Post;
};
