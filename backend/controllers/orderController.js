const orderModel = require("../models/order-model");

module.exports.getAdminOrders = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate("user", "fullName email username")
      .sort({ createdAt: -1 });

    const allOrders = orders.map(order => ({
      _id: order._id,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: order.items,
      paymentMethod: order.paymentMethod,
      status: order.status,
      paymentStatus: order.paymentStatus,
      customer: {
        fullName: order.user ? order.user.fullName : 'Anonymous',
        email: order.user ? order.user.email : '',
        username: order.user ? order.user.username : ''
      }
    }));

    return res.status(200).json({ success: true, data: allOrders });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (status) {
      order.status = status;
      if (status === 'Delivered') {
        order.paymentStatus = 'Paid';
      }
    }
    await order.save();
    return res.status(200).json({ success: true, message: "Order updated successfully", data: order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
