const Razorpay = require("razorpay");
const crypto = require("crypto");

const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        throw new Error("Razorpay credentials are not configured in environment variables.");
    }

    return new Razorpay({
        key_id,
        key_secret,
    });
};

/**
 * STEP 1: BACKEND - Create Order
 * POST /api/create-order
 * Request: { amount (in paise), currency, receipt }
 * Return: { success: true, order_id, amount, currency }
 * Minimum amount: 100 paise
 */
module.exports.createOrder = async (req, res) => {
    try {
        const { amount, currency = "INR", receipt } = req.body;

        const numericAmount = Number(amount);

        // Validation: minimum amount is 100 paise
        if (!numericAmount || isNaN(numericAmount) || numericAmount < 100) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount. Minimum order amount is 100 paise (₹1.00).",
            });
        }

        const razorpay = getRazorpayInstance();

        const options = {
            amount: Math.round(numericAmount),
            currency: currency || "INR",
            receipt: receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create Razorpay order",
            error: error.error || error,
        });
    }
};

/**
 * STEP 3: BACKEND - Verify Signature
 * POST /api/verify-payment
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compare generated signature with razorpay_signature
 * Return success only if signatures match
 */
module.exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Validation: Missing fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing required payment verification fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are all required.",
            });
        }

        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_secret) {
            return res.status(500).json({
                success: false,
                message: "Razorpay key secret is not configured on the server.",
            });
        }

        // Generate expected signature: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
        const expectedSignature = crypto
            .createHmac("sha256", key_secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const expectedBuffer = Buffer.from(expectedSignature, "utf8");
        const receivedBuffer = Buffer.from(razorpay_signature, "utf8");

        // Secure constant-time comparison to prevent timing attacks
        const isMatch =
            expectedBuffer.length === receivedBuffer.length &&
            crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed: Signature mismatch.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
        });
    } catch (error) {
        console.error("Razorpay verification error:", error);
        return res.status(400).json({
            success: false,
            message: "Payment verification failed due to an error.",
            error: error.message,
        });
    }
};
