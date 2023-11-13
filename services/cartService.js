const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const Course = require('../models/courseModel');
const Cart = require('../models/cartModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price;
  });
  cart.totalCartPrice = totalPrice;
  return totalPrice;
};

// @desc    Add course to cart
// @route   POST /api/v1/cart
// @access  Private/Student


// @desc    Add course to cart
// @route   POST /api/v1/cart
// @access  Private/Student
exports.addCourseToCart = asyncHandler(async (req, res, next) => {
  const { courseId } = req.body;

  // 1) Get the course from the database
  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ApiError(`Course not found with ID: ${courseId}`, 404));
  }

  // 2) Get Cart for logged student
  let cart = await Cart.findOne({ student: req.student._id });

  if (!cart) {
    // create cart for logged student with course
    cart = await Cart.create({
      student: req.student._id,
      cartItems: [{ course: courseId, price: course.price}],
    });
  } else {
    // course exists in cart, update course quantity
    const courseIndex = cart.cartItems.findIndex(
      (item) => item.course && item.course.toString() === courseId.toString()
    );

    if (courseIndex > -1) {
      // update the existing cart item's price
      cart.cartItems[courseIndex].price = course.price;
    } else {
      // course does not exist in cart, push course to cartItems array
      cart.cartItems.push({ course: courseId, price: course.price });
    }
  }

  // Calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Course added to cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart,
    totalPrice:cart.totalCartPrice
  });
});

// @desc    Get logged student cart
// @route   GET /api/v1/cart
// @access  Private/Student
exports.getLoggedStudentCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ student: req.student._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this student id: ${req.student._id}`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
    totalPrice:cart.totalCartPrice
  });
});

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { student: req.student._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
    totalPrice:cart.totalCartPrice
  });
});

// @desc    Clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/Student
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ student: req.student._id });
  res.status(204).send();
});






exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }
  const totalPrice =calcTotalCartPrice(cart)*100;
  // Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: 'courses',
          },
          unit_amount: totalPrice, // Amount in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: "https://teacherapp-dwgh.onrender.com/api/v1/course",
    cancel_url: `${req.protocol}://${req.get('host')}/carts`,
    client_reference_id: req.params.cartId,
  });

  // 4) send session to response
  res.status(200).json({ status: 'success', session });
});



const createCard = async (session) => {
  const cartId = session.client_reference_id;

  const cart = await Cart.findById(cartId);
  const student = await student.findOne({ email: session.customer_email });
 const courses=cart.cartItems.map(item=>item.course);
 await student.course.push(courses)
    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }



















// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers[process.env.STRIPE_WEBHOOK_SECRET];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    //  Create order
    console.log("donnnne")
    createCard(event.data.object);
  }

  res.status(200).json({ received: true });
});
