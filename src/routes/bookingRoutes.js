const express = require("express");
const Booking = require("../models/Booking");
const equipments = require("../data/equipments");

const router = express.Router();

const getDayMultiplier = (days) => {
  if (days >= 7) return 0.85;
  if (days >= 3) return 0.93;
  return 1;
};

router.get("/", async (_req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch bookings.",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { items, email, address } = req.body;

    if (!Array.isArray(items) || items.length === 0 || !email || !address) {
      return res.status(400).json({ message: "Please provide all fields." });
    }

    const normalizedItems = items.map((item) => {
      const selectedEquipment = equipments.find((equipment) => equipment.id === item.equipmentId);
      if (!selectedEquipment) {
        throw new Error(`Equipment not found for id: ${item.equipmentId}`);
      }

      const qty = Number(item.quantity);
      const numDays = Number(item.days);
      if (!Number.isFinite(qty) || qty < 1 || !Number.isFinite(numDays) || numDays < 1) {
        throw new Error(`Invalid quantity or days for ${selectedEquipment.name}`);
      }

      const itemTotal = Number(
        (selectedEquipment.pricePerDay * qty * numDays * getDayMultiplier(numDays)).toFixed(2)
      );

      return {
        equipmentId: selectedEquipment.id,
        equipmentName: selectedEquipment.name,
        pricePerDay: selectedEquipment.pricePerDay,
        quantity: qty,
        days: numDays,
        itemTotal,
      };
    });

    const totalCost = Number(
      normalizedItems.reduce((sum, item) => sum + item.itemTotal, 0).toFixed(2)
    );

    const booking = await Booking.create({
      items: normalizedItems,
      totalCost,
      email,
      address,
    });

    return res.status(201).json({
      message: "Booking submitted successfully.",
      booking,
    });
  } catch (error) {
    if (error.message.includes("Equipment not found") || error.message.includes("Invalid quantity")) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to submit booking.",
      error: error.message,
    });
  }
});

module.exports = router;
