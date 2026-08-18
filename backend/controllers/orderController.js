const orderModel = require("../models/order-model");
const {
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail
} = require("../services/email-service");

module.exports.getAdminOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const hasPage = !isNaN(page);

    let query = orderModel.find()
      .populate("user", "fullName email username")
      .sort({ createdAt: -1 });

    let orders;
    let totalOrders = 0;
    let totalPages = 1;

    if (hasPage) {
      totalOrders = await orderModel.countDocuments();
      totalPages = Math.ceil(totalOrders / limit);
      orders = await query.skip(skip).limit(limit);
    } else {
      if (req.query.limit) {
        orders = await query.limit(limit);
      } else {
        orders = await query;
      }
    }

    const allOrders = orders.map(order => ({
      _id: order._id,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: order.items,
      paymentMethod: order.paymentMethod,
      status: order.status,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      customer: {
        fullName: order.user ? order.user.fullName : 'Anonymous',
        email: order.user ? order.user.email : '',
        username: order.user ? order.user.username : ''
      }
    }));

    if (hasPage) {
      return res.status(200).json({
        success: true,
        data: allOrders,
        pagination: {
          totalOrders,
          totalPages,
          currentPage: page,
          limit
        }
      });
    } else {
      return res.status(200).json({ success: true, data: allOrders });
    }
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await orderModel
      .findById(id)
      .populate("user", "email fullName");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (status) {
      order.status = status;

      if (status === "Delivered") {
        order.paymentStatus = "Paid";
      }
    }

    // Save updated order
    await order.save();

    // Send email according to order status
    try {
      if (status === "Shipped") {
        await sendOrderShippedEmail(order, order.user.email);
      }

      if (status === "Delivered") {
        await sendOrderDeliveredEmail(order, order.user.email);
      }

      if (status === "Cancelled") {
        await sendOrderCancelledEmail(order, order.user.email);
      }
    } catch (emailError) {
      console.error("Order status email failed:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order
    });

  } catch (error) {
    console.error("Error updating order status:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};