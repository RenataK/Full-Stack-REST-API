'use strict';

const express = require('express');

// Construct a router instance.
const router = express.Router();
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');
const { asyncHandler } = require('./middleware/async-handler');
const bcrypt = require('bcryptjs');
const e = require('express');

//User Routes

//A /api/users GET route that will return all properties and values for the currently authenticated User along with a 200 HTTP status code.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const users = await User.findOne({
      //returns only the authenticated user 
      where: {
        emailAddress: req.currentUser.emailAddress
      },
        //excludes timestamps and password 
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    res.status(200).json({users});
}));

// A /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).set('Location', '/').end();
    } catch (error) {
      //SequelizeUniqueConstraintError error, returns a 400 status code and error message
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));

//Courses Routes

//A /api/courses GET route that will return all courses including the User associated with each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async(req, res) => {
    const courses = await Course.findAll({
      //includes the user that's associated with the course
      include: [{
        model: User,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    }],
      //exludes the courses timestamps
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    res.status(200).json({courses});
}));

//A /api/courses/:id GET route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async(req, res) => {
    const course = await Course.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
            id: req.params.id
        },
        include: [{
            model: User,
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        }]
    });
    res.status(200).json({course});
}));

//A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      //setting the URI to the created course url
      res.status(201).set('Location', `/courses/${course.id}`).end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));

//A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (course.userId == req.currentUser.id) {
      await Course.update(req.body, 
        {
          where: {
            id: req.params.id
          }
        });
      res.status(204).end();
    } else {
      res.status(403).end();
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

//A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course.userId == req.currentUser.id) {
    await course.destroy(req.body);
    res.status(204).end();
  } else {
    res.status(403).end();
  }
}));

//exporting Router
module.exports = router;
