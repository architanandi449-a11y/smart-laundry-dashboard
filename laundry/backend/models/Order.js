const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Predefined garment pricing
const GARMENT_PRICES = {
  Shirt: 50,
  Pants: 80,
  Saree: 100,
  Jacket: 150,
  Kurta: 60,
  Suit: 200,
};

const garmentItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: Object.keys(GARMENT_PRICES),
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    default: () => 'ORD-' + uuidv4().slice(0, 8).toUpperCase(),
    unique: true,
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  garments: {
    type: [garmentItemSchema],
    required: true,
    validate: {
      validator: (v) => v.length > 0,
      message: 'At least one garment is required',
    },
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'],
    default: 'RECEIVED',
  },
  estimatedDelivery: {
    type: Date,
    default: () => {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      return d;
    },
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

// Export garment prices for use in controllers
orderSchema.statics.GARMENT_PRICES = GARMENT_PRICES;

module.exports = mongoose.model('Order', orderSchema);
