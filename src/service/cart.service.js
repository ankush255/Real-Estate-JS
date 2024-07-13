const { query } = require("express");
const Cart = require("../model/cart.model");
const { default: mongoose } = require("mongoose");

module.exports = class CartServices {
  // Create Cart

  async addNewCart(body, userID) {
    try {
      let userCarts = await Cart.findOne({ user: userID, isDelete: false });
      if (!userCarts) {
        return await Cart.create({
          user: userID,
          products: [
            {
              productId: body.productId,
              quantity: body.quantity || 1,
              date: body.date,
            },
          ],
        });
      } else {
        let findproductIndex = userCarts.products.findIndex(
          (item) => String(item.productId) === body.productId
        );
        if (findproductIndex !== -1) {
          userCarts.products[findproductIndex].quantity += body.quantity || 1;
        } else {
          userCarts.products.push({
            productId: body.productId,
            quantity: body.quantity || 1,
            date: body.date,
          });
        }
        return await userCarts.save();
      }
    } catch (err) {
      console.log(err);
      return err.message;
    }
  }

  // Get All Carts

  async getAllCarts(query, userID) {
    try {
      // Pagination
      let pageNo = Number(query.pageNo) || 1;
      let perPage = Number(query.perPage) || 5;
      let skip = (pageNo - 1) * perPage;

      let cartItem =
        query.cartId && query.cartId !== ""
          ? [
              {
                $match: { _id: new mongoose.Types.ObjectId(query.cartId) },
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
        ...cartItem,
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

      //   console.log(pipeline);
      const totalCount = await Cart.aggregate([...pipeline]);
      let result = await Cart.aggregate([
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

  // Update Cart

  async updateCart(body, userID) {
    try {
      let updateCart = await Cart.findOneAndUpdate(
        {
          user: userID,
          isDelete: false,
        },
        {
          $set: body,
        },
        {
          new: true,
        }
      );
      return updateCart;
    } catch (err) {
      console.log(err);
      return err.message;
    }
  }

  // Remove Cart
  async removeCart(query, userID) {
    try {
      let removeCart = await Cart.findOneAndUpdate(
        {
          user: userID,
        },
        {
          $pull: {
            products: {
              productId: new mongoose.Types.ObjectId(query.productId),
            },
          },
        },
        {
          new: true,
        }
      );
      return removeCart;
    } catch (err) {
      console.log(err);
      return err.message;
    }
  }
};
