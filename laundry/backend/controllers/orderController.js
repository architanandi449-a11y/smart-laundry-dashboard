const Order = require('../models/Order');

const GARMENT_PRICES = {
  Shirt: 50, Pants: 80, Saree: 100,
  Jacket: 150, Kurta: 60, Suit: 200,
};

// POST /api/orders - Create a new order
const createOrder = async (req, res) => {
  try {
    const { customerName, phone, garments, notes } = req.body;

    // Validate & compute totals
    const processedGarments = garments.map((g) => {
      const unitPrice = GARMENT_PRICES[g.name];
      if (!unitPrice) throw new Error(`Unknown garment: ${g.name}`);
      return { name: g.name, quantity: g.quantity, unitPrice, subtotal: unitPrice * g.quantity };
    });

    const totalAmount = processedGarments.reduce((sum, g) => sum + g.subtotal, 0);

    const order = await Order.create({
      customerName,
      phone,
      garments: processedGarments,
      totalAmount,
      notes: notes || '',
    });

    res.status(201).json({ success: true, data: order, message: 'Order created successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/orders - Get all orders with filters
const getOrders = async (req, res) => {
  try {
    const { name, phone, status, garment, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (name) filter.customerName = { $regex: name, $options: 'i' };
    if (phone) filter.phone = { $regex: phone };
    if (status) filter.status = status;
    if (garment) filter['garments.name'] = garment;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({ success: true, data: orders, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/:id - Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/orders/:id/status - Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, data: order, message: `Status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/orders/:id - Edit order
const updateOrder = async (req, res) => {
  try {
    const { customerName, phone, garments, notes } = req.body;
    const processedGarments = garments.map((g) => {
      const unitPrice = GARMENT_PRICES[g.name];
      if (!unitPrice) throw new Error(`Unknown garment: ${g.name}`);
      return { name: g.name, quantity: g.quantity, unitPrice, subtotal: unitPrice * g.quantity };
    });
    const totalAmount = processedGarments.reduce((sum, g) => sum + g.subtotal, 0);

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { customerName, phone, garments: processedGarments, totalAmount, notes },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order, message: 'Order updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/orders/:id - Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, updateOrder, deleteOrder };
