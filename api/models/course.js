'use strict';
const { Model, DataTypes } = require('sequelize');

//Course model
module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      //validators for missing or empty fields
      validate: {
        notNull: {
          msg: 'A title is required'
        },
        notEmpty: {
          msg: 'Please provide a title'
        }
      }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A description is required'
          },
          notEmpty: {
            msg: 'Please provide a description'
          }
        }
      },
      estimatedTime: {
      type: DataTypes.STRING,
    },
    materialsNeeded: {
      type: DataTypes.STRING, 
    },
    //userId (created in the model associations with the foreignKey property, equals the id from the Users table)
    userId: {
      type: DataTypes.STRING
    }
  }, { sequelize });

  //one-to-one association between the Course and User models
  Course.associate = (models) => {
    // TODO Add associations.
    Course.belongsTo(models.User, { 
      foreignKey: {
        fieldName: 'userId', 
        allowNull: false,
      } 
    });
  };

  return Course;
};