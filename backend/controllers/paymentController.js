const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// CREATE PAYMENT ORDER
exports.createPaymentOrder = async (req, res) => {
  try {

    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        message: "Amount is required"
      });
    }

    const options = {
      amount: amount * 100, // Razorpay uses paise
      currency: "INR",
      receipt: "pizza_receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Payment creation failed"
    });

  }
};



// VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "Missing payment details"
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      res.status(200).json({
        success: true,
        message: "Payment verified successfully"
      });

    } else {

      res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });

    }

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });

  }
};