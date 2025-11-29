import { useState, useEffect } from "react";
import {
  getEventsForHome,
  subscribeToEvent,
  unsubscribeFromEvent,
  getUserSubscriptions,
  subscribeToAllEvents,
  unsubscribeFromAllEvents,
  checkAllEventSubscription,
} from "../services/eventService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Footer from "../component/Footer";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const getStatus = (start, end) => {
  const today = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (today < startDate) return "Upcoming";
  if (today > endDate) return "Completed";
  return "Ongoing";
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscribedEvents, setSubscribedEvents] = useState([]);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [subscribedAll, setSubscribedAll] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState(null);

  useEffect(() => {
    const fetchSubStatus = async () => {
      if (user?.email) {
        try {
          const { subscribed } = await checkAllEventSubscription(user.email);
          setSubscribedAll(subscribed);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchSubStatus();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getEventsForHome();
        setEvents(data);
        if (user?.email) {
          // fetch user subscriptions
          const subs = await getUserSubscriptions(user.email);
          setSubscribedEvents(subs); // array of event IDs
        }
      } catch (error) {
        toast.error("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSubscribe = async (eventId) => {
    try {
      if (!user?.email) {
        toast.error("Please login to subscribe");
        navigate("/login");
        return;
      }
      await subscribeToEvent(eventId, user.email);
      setSubscribedEvents((prev) => [...prev, eventId]);
      toast.success("You will be notified about this event!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to subscribe");
    }
  };

  const handleUnsubscribe = async (eventId) => {
    try {
      await unsubscribeFromEvent(eventId, user.email);
      setSubscribedEvents((prev) => prev.filter((id) => id !== eventId));
      toast.success("You will no longer receive notifications for this event.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to unsubscribe");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <section className="min-h-screen px-4 py-10 bg-gradient-to-br from-[#FFF6F0] to-[#EAE2F3] text-[#4B2E2E] outfit">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.div
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-[#4B2E2E] hover:text-[#8A2C02] hover:underline cursor-pointer transition w-fit"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FaArrowLeft className="text-lg" />
          <span className="text-sm font-medium tracking-wide">
            Back to Home
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-3xl font-bold mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🌺 Divine Gatherings & Events
        </motion.h2>

        {user && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loadingAll}
            onClick={async () => {
              try {
                if (!user.email) {
                  toast.error("Please login to manage subscriptions");
                  navigate("/login");
                  return;
                }
                setLoadingAll(true);
                if (subscribedAll) {
                  await unsubscribeFromAllEvents(user.email);
                  toast.success("Unsubscribed from all future events");
                  setSubscribedAll(false);
                } else {
                  await subscribeToAllEvents(user.email);
                  toast.success("Subscribed to all future events!");
                  setSubscribedAll(true);
                }
              } catch (err) {
                console.error(err);
                toast.error("Failed to update subscription");
              } finally {
                setLoadingAll(false);
              }
            }}
            className={`mb-8 mx-auto flex items-center justify-center gap-2 text-sm px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${
              subscribedAll
                ? "bg-red-100 hover:bg-red-200 text-red-800"
                : "bg-[#FCE9D3] hover:bg-[#FFE9BD] text-[#7A3E00]"
            } ${loadingAll ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loadingAll ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Processing...
              </span>
            ) : subscribedAll ? (
              <>
                <span className="text-base">❌</span> Unsubscribe from All
              </>
            ) : (
              <>
                <span className="text-base animate-pulse">🔔</span> Notify Me
                for All
              </>
            )}
          </motion.button>
        )}

        {/* Content */}
        {loading ? (
          <motion.p
            className="text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading events...
          </motion.p>
        ) : events.length === 0 ? (
          <motion.p
            className="text-center text-gray-500 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No events found 🕊️
          </motion.p>
        ) : (
          <motion.div
            className="grid gap-8 sm:grid-cols-1 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {events.map((event) => {
              const status = getStatus(event.startTime, event.endTime);
              const isSubscribed = subscribedEvents.includes(event._id);

              return (
                <motion.div
                  key={event._id}
                  className="bg-white/90 backdrop-blur-md border-l-4 p-5 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
                  style={{
                    borderColor:
                      status === "Upcoming"
                        ? "#3b82f6"
                        : status === "Ongoing"
                        ? "#10b981"
                        : "#9ca3af",
                  }}
                  variants={cardVariants}
                >
                  {/* Event Image */}
                  <div className="h-40 mb-4 rounded-xl overflow-hidden bg-gradient-to-tr from-[#FFEFE8] to-[#FFF6F0] shadow-inner flex items-center justify-center">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Event Info */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-[#8A2C02]">
                      {event.title}
                    </h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        status === "Upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : status === "Ongoing"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">
                    {event.description}
                  </p>
                  <div className="text-sm text-[#5C3A00] space-y-1">
                    <p>📍 {event.location}</p>
                    <p>
                      🗓️ {new Date(event.startTime).toLocaleDateString()} –{" "}
                      {new Date(event.endTime).toLocaleDateString()}
                    </p>
                  </div>

                  {status === "Upcoming" && !subscribedAll && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={loadingEventId === event._id}
                      onClick={async () => {
                        try {
                          setLoadingEventId(event._id);
                          if (isSubscribed) {
                            await unsubscribeFromEvent(event._id, user.email);
                            setSubscribedEvents((prev) =>
                              prev.filter((id) => id !== event._id)
                            );
                            toast.success(
                              "You will no longer receive notifications for this event."
                            );
                          } else {
                            await subscribeToEvent(event._id, user.email);
                            setSubscribedEvents((prev) => [...prev, event._id]);
                            toast.success(
                              "You will be notified about this event!"
                            );
                          }
                        } catch (err) {
                          console.error(err);
                          toast.error("Failed to update subscription");
                        } finally {
                          setLoadingEventId(null);
                        }
                      }}
                      className={`mt-3 inline-flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full shadow-md transition-all duration-300 ${
                        isSubscribed
                          ? "bg-red-100 hover:bg-red-200 text-red-800"
                          : "bg-[#FFF3E0] hover:bg-[#FFE0B2] text-[#8A4F00]"
                      } ${
                        loadingEventId === event._id
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {loadingEventId === event._id ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          {isSubscribed ? "Unsubscribing..." : "Subscribing..."}
                        </span>
                      ) : isSubscribed ? (
                        <>
                          <span className="text-base">❌</span>
                          Unsubscribe
                        </>
                      ) : (
                        <>
                          <span className="text-base animate-pulse">🔔</span>
                          Notify Me
                        </>
                      )}
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <Footer
        navigate={navigate}
        quote="“Sacred events are not just moments, they are portals of presence.” 🌸"
        handleProtectedAction={() => {}}
      />
    </section>
  );
};

export default Events;
