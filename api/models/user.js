'use strict';
const { Model, DataTypes } = require('sequelize');
//for password hashing 
const bcrypt = require('bcryptjs'); 

//User model
module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      //validators for missing or empty fields
      validate: {
        notNull: { //can only be used if allowNull is set to false
          msg: 'A first name is required'
        },
        notEmpty: {
          msg: 'Please provide a first name'
        }
      }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A last name is required'
          },
          notEmpty: {
            msg: 'Please provide a last name'
          }
        }
      },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The email address you entered already exists' 
      },
      validate: {
        notNull: {
          msg: 'An email is required'
        },
        notEmpty: {
          msg: 'Please provide an email'
        },
        //email is a valid format- foo@bar.com
        isEmail: {
          args: true,
          msg: 'The email you entered is invalid'
        }
      }
    },
    password: {
      type: DataTypes.STRING, 
      allowNull: false,
      //hashing the password
      set(val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      },
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        },
      },
    },
  }, 
  { sequelize });

  //one-to-many association between the User and Course models
  User.associate = (models) => {
    // TODO Add associations.
    User.hasMany(models.Course, { 
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please login in to create a course'
          }
        }
     } 
    });
  };

  return User;
};