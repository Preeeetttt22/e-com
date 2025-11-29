import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  subscribeToEvent,
  unsubscribeFromEvent,
  subscribeToAllEvents,
  unsubscribeFromAllEvents,
  checkAllEventSubscription,
  getUserSubscriptions,
} from "../../services/eventService";

const getStatus = (start, end) => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (now < startDate) return "Upcoming";
  if (now > endDate) return "Completed";
  return "Ongoing";
};

const UpcomingEvents = ({ events, navigate }) => {
  const { user } = useSelector((state) => state.auth);
  const [subscribedAll, setSubscribedAll] = useState(false);
  const [subscribedEvents, setSubscribedEvents] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState(null);

  // ✅ Fetch global subscription status
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

  // ✅ Fetch individual subscriptions
  useEffect(() => {
    const fetchUserSubs = async () => {
      if (user?.email) {
        try {
          const subs = await getUserSubscriptions(user.email);
          setSubscribedEvents(subs);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchUserSubs();
  }, [user]);

  const handleToggleAll = async () => {
    if (!user?.email) {
      toast.error("Please login to manage subscriptions");
      navigate("/login");
      return;
    }
    try {
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
  };

  const handleToggleEvent = async (eventId, isSubscribed) => {
    if (!user?.email) {
      toast.error("Please login to manage subscriptions");
      navigate("/login");
      return;
    }
    try {
      setLoadingEventId(eventId);
      if (isSubscribed) {
        await unsubscribeFromEvent(eventId, user.email);
        setSubscribedEvents((prev) => prev.filter((id) => id !== eventId));
        toast.success("Unsubscribed from event");
      } else {
        await subscribeToEvent(eventId, user.email);
        setSubscribedEvents((prev) => [...prev, eventId]);
        toast.success("Subscribed to event!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update subscription");
    } finally {
      setLoadingEventId(null);
    }
  };

  // ✅ Filter only Upcoming or Ongoing
  const filteredEvents = events.filter((e) => {
    const status = getStatus(e.startTime, e.endTime);
    return status === "Upcoming" || status === "Ongoing";
  });

  return (
    <motion.section
      className="w-full px-6 py-14 bg-gradient-to-br from-[#FFB39F] to-[#FFD59F] rounded-2xl shadow-2xl mt-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header with Notify All on left and View All on right */}
        <motion.div
          className="flex justify-between items-center mb-6 flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-[#5D3A00] tracking-wide drop-shadow">
              Events
            </h2>
            {user && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loadingAll}
                onClick={handleToggleAll}
                className={`flex items-center justify-center gap-2 text-sm px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-sm ${
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
                    <span className="text-base">❌</span> Unsubscribe All
                  </>
                ) : (
                  <>
                    <span className="text-base animate-pulse">🔔</span> Notify All
                  </>
                )}
              </motion.button>
            )}
          </div>
          <button
            onClick={() => navigate("/events")}
            className="bg-gradient-to-r from-[#FF9770] to-[#FF6F61] text-white px-5 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm font-medium"
          >
            View All Events
          </button>
        </motion.div>

        {/* Events Scroll Area */}
        <motion.div
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => {
              const status = getStatus(event.startTime, event.endTime);
              const isSubscribed = subscribedEvents.includes(event._id);
              return (
                <motion.div
                  key={event._id}
                  className="min-w-[260px] bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="h-32 bg-gradient-to-tr from-[#FFEFE8] to-[#FFF6F0] rounded-xl mb-4 overflow-hidden flex items-center justify-center shadow-inner">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center text-[#8A2C02]">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#6C3D00] text-center mb-1">
                    📅 {new Date(event.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-[#6C3D00] text-center mb-3">
                    📍 {event.location}
                  </p>

                  {/* Only show Notify button if status is Upcoming */}
                  {status === "Upcoming" && !subscribedAll && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={loadingEventId === event._id}
                      onClick={() => handleToggleEvent(event._id, isSubscribed)}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full shadow-md transition-all duration-300 ${
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
                          <span className="text-base">❌</span> Unsubscribe
                        </>
                      ) : (
                        <>
                          <span className="text-base animate-pulse">🔔</span> Notify Me
                        </>
                      )}
                    </motion.button>
                  )}
                </motion.div>
              );
            })
          ) : (
            <p className="text-center text-gray-600 w-full italic">
              No upcoming or ongoing events.
            </p>
          )}
        </motion.div>
      </div>

      {/* Quote */}
      <motion.div
        className="mt-10 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-lg text-[#5C3A00] italic font-medium">
          “Align your energies, embrace the divine, and let your inner light shine.” ✨
        </p>
      </motion.div>
    </motion.section>
  );
};

export default UpcomingEvents;
