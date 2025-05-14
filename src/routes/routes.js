const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const validate = require('../middlewares/validate');
const userValidate = require('../validations/userValidation');
const { createEvent, getAllEvents, updateEvent, getEventById, deleteEvent } = require('../controllers/eventController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const eventValidate = require('../validations/eventValidation');
const { bookTickets, getUserTickets, getAdminAnalytics } = require('../controllers/ticketController');
const { bookTicketSchema } = require('../validations/ticketValidation');
const router = express.Router();

// user routes
router.post('/register', validate(userValidate), registerUser);
router.post('/login', validate(userValidate), loginUser);
router.post('/admin/login', validate(userValidate), loginUser);

// event routes
router.post('/events', authMiddleware, roleMiddleware(0, 1), validate(eventValidate), createEvent);
router.get('/events', authMiddleware, roleMiddleware(0, 1), getAllEvents);
router.get('/events/:id', authMiddleware, roleMiddleware(0, 1), getEventById);
router.put('/events/:id', authMiddleware, roleMiddleware(1), validate(eventValidate), updateEvent);
router.delete('/events/:id', authMiddleware, roleMiddleware(1), deleteEvent);

// ticket routes
router.post('/tickets/book/:eventId', authMiddleware, validate(bookTicketSchema), bookTickets);
router.get('/tickets/my', authMiddleware, getUserTickets);

// admin analytics routes
router.get('/admin/analytics', authMiddleware, roleMiddleware(1), getAdminAnalytics);

module.exports = router;

