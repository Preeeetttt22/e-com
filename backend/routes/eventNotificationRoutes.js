import express from "express";
import { subscribeToEvent, unsubscribeFromEvent, getUserSubscriptions, subscribeToAllEvents, unsubscribeFromAllEvents, checkAllEventSubscription, } from "../controllers/eventNotificationController.js";
const router = express.Router();

router.post("/subscribe", subscribeToEvent);
router.post("/unsubscribe", unsubscribeFromEvent);
router.get("/:email", getUserSubscriptions);
router.post("/subscribe-all", subscribeToAllEvents);
router.post("/unsubscribe-all", unsubscribeFromAllEvents);
router.get("/check-all/:email", checkAllEventSubscription);

export default router;
