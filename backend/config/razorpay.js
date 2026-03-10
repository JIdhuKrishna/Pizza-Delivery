const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.rzp_test_SPZS4l9ynnPjPD,
  key_secret: process.env.BJpw9wgDJ20Zf5HIXPiIOUdo
});

module.exports = razorpay;