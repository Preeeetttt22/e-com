import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, getAllEvents, updateEvent, deleteEvent } from "../../services/eventService";
import { toast } from "react-hot-toast";

const AdminEvents = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    image: null,
  });
  const [events, setEvents] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res);
    } catch (err) {
      toast.error("Failed to fetch events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });

    try {
      if (editId) {
        await updateEvent(editId, formData);
        toast.success("Event updated");
      } else {
        await createEvent(formData);
        toast.success("Event created");
      }
      setForm({ title: "", description: "", location: "", startTime: "", endTime: "", image: null });
      setEditId(null);
      fetchEvents();
    } catch (err) {
      toast.error("Error saving event");
    }
  };

  const handleEdit = (event) => {
    setEditId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      location: event.location,
      startTime: event.startTime.slice(0, 16),
      endTime: event.endTime.slice(0, 16),
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this event?")) {
      try {
        await deleteEvent(id);
        toast.success("Event deleted");
        fetchEvents();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#FFF8EC] to-[#FFE6E1] text-[#4B2E2E]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-wide text-[#A0522D]">
          🌼 Manage Events
        </h1>
      </div>

      {/* Event Form */}
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-[#FFE3C3] p-6 rounded-2xl shadow-lg space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#6D4C41]">{editId ? "Edit Event" : "Create New Event"}</h2>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="🌸 Event Title"
          required
          className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-orange-400 outline-none"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="📜 Event Description"
          className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-orange-400 outline-none"
        />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="📍 Location"
          required
          className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-orange-400 outline-none"
        />
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          className="w-full"
        />
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          {editId ? "Update Event" : "Add Event"}
        </button>
      </form>

      {/* Event List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {events.map(event => (
          <div key={event._id} className="bg-white/90 p-5 rounded-xl border border-[#FFD6C8] shadow-lg hover:shadow-xl transition space-y-3">
            <h3 className="text-xl font-semibold text-[#8B3A3A]">{event.title}</h3>
            <p className="text-gray-700 text-sm">{event.description}</p>
            <p className="text-[#6C3D00] text-sm">📍 {event.location}</p>
            <p className="text-[#6C3D00] text-sm">
              🕒 {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
            </p>
            {event.image && (
              <img src={event.image} alt={event.title} className="w-full h-40 object-contain rounded" />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(event)}
                className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
