const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        course: {
          type: mongoose.Schema.ObjectId,
          ref: 'Course',
        },
        price: Number,
      },
    ],
    
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
