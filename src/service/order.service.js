const Order = require("../model/order.model");
const { default: mongoose } = require("mongoose");

module.exports = class OrderServices {
  // Create New Order
  async newOrder(body, userID) {
    try {
      return await Order.create({
        user: userID,
        products: body.products,
        totalAmount: body.totalAmount,
      });
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  // Get All Carts

  async getAllOrder(query, userID) {
    try {
      // Pagination
      let pageNo = Number(query.pageNo) || 1;
      let perPage = Number(query.perPage) || 5;
      let skip = (pageNo - 1) * perPage;

      let orderItem =
        query.orderId && query.orderId !== ""
          ? [
              {
                $match: { _id: new mongoose.Types.ObjectId(query.orderId) },
              },
            ]
          : [];
      let loginUser =
        query.me && query.me === "true"
          ? [
              {
                $match: { user: userID },
              },
            ]
          : [];
      let pipeline = [
        {
          $match: { isDelete: false },
        },
        ...loginUser,
        ...orderItem,
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
            pipeline: [
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  email: 1,
                },
              },
            ],
          },
        },
        {
          $set: { user: { $first: "$user" } },
        },
        {
          $unwind: "$products",
        },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "products.productId",
            pipeline: [
              {
                $project: {
                  title: 1,
                  time: 1,
                  rant_price: 1,
                },
              },
            ],
          },
        },
        {
          $set: { "products.productId": { $first: "$products.productId" } },
        },
      ];

      const totalCount = await Order.aggregate([...pipeline]);
      let result = await Order.aggregate([
        ...pipeline,
        {
          $skip: skip,
        },
        {
          $limit: perPage,
        },
      ]);
      let totalPages = Math.ceil(totalCount.length / perPage);
      //   console.log(totalPages);

      let totalAmount = result
        .map((item) => ({
          quantity: item.products.quantity,
          rant_price: item.products.productId.rant_price,
        }))
        .reduce((total, item) => (total += item.quantity * item.rant_price), 0);
      let discountAmount = totalAmount * 0.05;
      let GST = totalAmount * 0.18;
      totalAmount = totalAmount - (discountAmount + GST);
      // console.log(totalAmount);

      return {
        otalDoc: totalCount.length,
        totalPages,
        currentPage: pageNo,
        result,
        GST: GST,
        discount: discountAmount,
        totalAmount,
      };
    } catch (err) {
      console.log(err);
      return err.message;
    }
  }

  // Remove Order
  async removeOrder(query, userID) {
    try {
      let removeOrder = await Order.findOneAndUpdate(
        {
          user: userID,
          isDelete: false,
        },
        {
          isDelete: true,
        },
        {
          new: true,
        }
      );
      return removeOrder;
    } catch (err) {
      console.log(err);
      return err.message;
    }
  }
};
