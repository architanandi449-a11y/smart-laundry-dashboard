const express = require('express');
const router = express.Router();
const {
  createOrder, getOrders, getOrderById,
  updateOrderStatus, updateOrder, deleteOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// All routes protected
router.use(protect);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById)
  .put(updateOrder)
  .delete(deleteOrder);

router.put('/:id/status', updateOrderStatus);

module.exports = router;
