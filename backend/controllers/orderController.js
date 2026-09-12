const mongoose = require("mongoose");
const orderModel = require("../models/order-model");
const productModel = require("../models/product-model");
const {
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail
} = require("../services/email-service");
const { executeTransaction } = require("../utils/transaction");


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

    await order.save({ validateBeforeSave: false });

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

module.exports.getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error("Error in user orders route:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.getUserOrderDetails = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId)
      .populate({
        path: 'items.product',
        select: 'image title price category description'
      });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order"
      });
    }
    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error("Error in user order details route:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports.cancelOrder = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  const { reason } = req.body;

  try {
    const orderData = await executeTransaction(async (session) => {
      const order = await orderModel.findById(orderId).session(session);
      if (!order) {
        throw { status: 404, message: "order not found" };
      }
      if (order.user.toString() !== userId.toString()) {
        throw { status: 403, message: "not authorized" };
      }
      if (order.status !== "Pending") {
        throw { status: 400, message: "order cannot be cancelled" };
      }

      order.status = "Cancelled";
      order.cancellation = {
        reason: reason || "order cancelled by user",
        cancelledAt: new Date()
      };

      await order.save({ session, validateBeforeSave: false });

      for (const item of order.items) {
        const productId = item.product._id || item.product;
        await productModel.findByIdAndUpdate(
          productId,
          { $inc: { stock: item.quantity } },
          { session }
        );
      }
      return order;
    });

    try {
      await sendOrderCancelledEmail(orderData, req.user.email);
    } catch (emailError) {
      console.error("Order cancellation email failed:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: "order cancelled successfully",
      data: orderData
    });

  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    console.error("Error in user order cancellation route:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

//   const { orderId } = req.params;
//   const { reason } = req.body;

//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();

//     const order = await orderModel
//       .findById(orderId)
//       .session(session);

//     if (!order) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     if (order.user.toString() !== req.user._id.toString()) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to cancel this order"
//       });
//     }

//     if (order.status !== "Pending") {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({
//         success: false,
//         message: `This order cannot be cancelled because its status is ${order.status}`
//       });
//     }

//     // Restore stock for all products in the order
//     for (const item of order.items) {
//       const productId = item.product._id || item.product;
//       await productModel.findByIdAndUpdate(
//         productId,
//         { $inc: { stock: item.quantity } },
//         { session }
//       );
//     }

//     // Update order status and cancellation info
//     order.status = "Cancelled";
//     order.cancellation = {
//       reason: reason || "Cancelled by user",
//       cancelledAt: new Date()
//     };

//     await order.save({ session, validateBeforeSave: false });

//     await session.commitTransaction();
//     session.endSession();

//     // Send email notifications (non-blocking)
//     try {
//       await sendOrderCancelledEmail(order, req.user.email);
//     } catch (emailError) {
//       console.error("Order cancellation email failed:", emailError);
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Order cancelled successfully",
//       data: order
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Error cancelling order:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };