const Ticket = require('../models/ticketModel');
const Event = require('../models/eventModel');
const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError');

const bookTickets = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
        throw new ApiError(404, 'Event not found');
    }

    const bookedTickets = await Ticket.aggregate([
        { $match: { eventId: event._id } },
        { $group: { _id: null, totalBooked: { $sum: '$quantity' } } }
    ]);

    const totalBooked = bookedTickets[0]?.totalBooked || 0;
    if (totalBooked + quantity > event.capacity) {
        throw new ApiError(400, 'Not enough tickets available');
    }

    const ticket = await Ticket.create({
        userId,
        eventId,
        quantity,
        totalPrice: quantity * event.ticketPrice,
        bookedAt: new Date()
    });

    res.status(201).json({
        success: true,
        data: ticket
    });
});

const getUserTickets = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const tickets = await Ticket.find({ userId })
        .populate('eventId', 'title date location ticketPrice')
        .sort('-bookedAt');

    res.status(200).json({
        success: true,
        data: tickets
    });
});

const getAdminAnalytics = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new ApiError(403, 'Not authorized to access admin analytics');
    }

    const totalEvents = await Event.countDocuments();

    const ticketStats = await Ticket.aggregate([
        {
            $group: {
                _id: null,
                totalTicketsSold: { $sum: '$quantity' },
                totalRevenue: { $sum: '$totalPrice' }
            }
        }
    ]);

    const topEvents = await Ticket.aggregate([
        {
            $group: {
                _id: '$eventId',
                totalBookings: { $sum: '$quantity' },
                totalRevenue: { $sum: '$totalPrice' }
            }
        },
        { $sort: { totalBookings: -1 } },
        { $limit: 3 },
        {
            $lookup: {
                from: 'events',
                localField: '_id',
                foreignField: '_id',
                as: 'eventDetails'
            }
        },
        { $unwind: '$eventDetails' }
    ]);

    res.status(200).json({
        success: true,
        data: {
            totalEvents,
            totalTicketsSold: ticketStats[0]?.totalTicketsSold || 0,
            totalRevenue: ticketStats[0]?.totalRevenue || 0,
            topEvents: topEvents.map(event => ({
                eventId: event._id,
                title: event.eventDetails.title,
                totalBookings: event.totalBookings,
                totalRevenue: event.totalRevenue
            }))
        }
    });
});

module.exports = {
    bookTickets,
    getUserTickets,
    getAdminAnalytics
};
