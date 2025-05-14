const asyncHandler = require("../middlewares/asyncHandler");
const Event = require("../models/eventModel");

const createEvent =asyncHandler( async (req, res) => {
    const { title, description, date, location, ticketPrice, capacity } =
      req.body;
    const userId = req.user._id;
    const event = new Event({
      title,
      description,
      date,
      location,
      ticketPrice,
      capacity,
      createdBy: userId,
    });
    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  
});
const selectFields = {
        _id:1,
        title:1,
        description:1,
        date:1,
        location:1,
        ticketPrice:1,
        capacity:1,
        createdBy:1,
        createdAt:1,
}

const getAllEvents = asyncHandler( async (req, res) => {
    const { search = "", page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    const events = await Event.find(query).select(selectFields).skip((page - 1) * limit).limit(limit);
    const totalItems = await Event.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    res.status(200).json({
        success: true,
        data: events,
        pagination: {
          currentPage: page,
          totalItems: totalItems,
          totalPages: totalPages,
          limit: limit,
        },
      });
  
});

const getEventById = asyncHandler( async (req, res) => {
    const {id} = req.params;
    const event = await Event.findById(id).select(selectFields);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({success:true,message:"Event fetched successfully",data:event});
  
});

const updateEvent = asyncHandler( async (req, res) => {
    const { title, description, date, location } = req.body;
    const {id} = req.params;
    const event = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date,
        location,
      },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event updated successfully", event });
 
});

const deleteEvent = asyncHandler( async (req, res) => {

    const {id} = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
 
});

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
