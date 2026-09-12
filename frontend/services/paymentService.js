import api from "./api";

/**
 * Creates a Razorpay order on the backend
 * @param {Object} params
 * @param {number} params.amount - Amount in paise (minimum 100 paise)
 * @param {string} [params.currency='INR'] - Currency code
 * @param {string} [params.receipt] - Optional receipt identifier
 * @returns {Promise} API response with { order_id, amount, currency }
 */
export const createRazorpayOrder = async ({ amount, currency = "INR", receipt }) => {
    return api.post("/api/create-order", {
        amount,
        currency,
        receipt,
    });
};

/**
 * Verifies Razorpay payment signature on the backend
 * @param {Object} payload
 * @param {string} payload.razorpay_order_id - Order ID from Razorpay
 * @param {string} payload.razorpay_payment_id - Payment ID from Razorpay
 * @param {string} payload.razorpay_signature - Signature from Razorpay
 * @returns {Promise} API response
 */
export const verifyRazorpayPayment = async ({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
}) => {
    return api.post("/api/verify-payment", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    });
};
