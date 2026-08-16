const transporter = require("../utils/mailer");

// 1. Order Confirmed
const sendOrderConfirmationEmail = async (order, customerEmail) => {
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: customerEmail,
        subject: `LUXORA - Order Confirmed #${order._id}`,
        html: `
      <h2>Order Confirmed 🎉</h2>

      <p>Thank you for shopping with LUXORA!</p>

      <p>Your order has been successfully placed.</p>

      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>

      <h3>Order Items</h3>
      <ul>
        ${order.items.map(item => `
          <li>
            ${item.title} × ${item.quantity}
          </li>
        `).join("")}
      </ul>

      <p>We will notify you when your order is shipped.</p>
    `,
    });
};


// 2. Order Shipped
const sendOrderShippedEmail = async (order, customerEmail) => {
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: customerEmail,
        subject: `LUXORA - Your Order Has Been Shipped 🚚`,
        html: `
      <h2>Your Order Has Been Shipped 🚚</h2>

      <p>Good news! Your LUXORA order is on its way.</p>

      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>

      <p>Your order has been handed over for delivery.</p>

      <p>Thank you for shopping with LUXORA.</p>
    `,
    });
};


// 3. Order Delivered
const sendOrderDeliveredEmail = async (order, customerEmail) => {
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: customerEmail,
        subject: `LUXORA - Order Delivered ✅`,
        html: `
      <h2>Your Order Has Been Delivered ✅</h2>

      <p>Your LUXORA order has been successfully delivered.</p>

      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>

      <p>We hope you enjoy your purchase!</p>

      <p>Thank you for choosing LUXORA.</p>
    `,
    });
};


// 4. Order Cancelled
const sendOrderCancelledEmail = async (order, customerEmail) => {
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: customerEmail,
        subject: `LUXORA - Order Cancelled`,
        html: `
      <h2>Your Order Has Been Cancelled</h2>

      <p>Your LUXORA order has been cancelled.</p>

      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>

      <p>If you did not request this cancellation, please contact our support team.</p>

      <p>Thank you for choosing LUXORA.</p>
    `,
    });
};


module.exports = {
    sendOrderConfirmationEmail,
    sendOrderShippedEmail,
    sendOrderDeliveredEmail,
    sendOrderCancelledEmail,
};