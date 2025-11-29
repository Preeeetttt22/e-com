import Event from '../models/Event.js';

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, location, startTime, endTime } = req.body;

    const imageUrl = req.file?.path; // from Cloudinary middleware

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const event = await Event.create({
      title,
      description,
      location,
      startTime,
      endTime,
      image: imageUrl,
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ startTime: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single event
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const { title, description, location, startTime, endTime } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (req.file) event.image = req.file.path;

    event.title = title || event.title;
    event.description = description || event.description;
    event.location = location || event.location;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;

    await event.save();

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleEventStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.isActive = !event.isActive;
    await event.save();

    res.status(200).json({
      message: `Event is now ${event.isActive ? 'active' : 'inactive'}`,
      isActive: event.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find().sort({ startTime: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

