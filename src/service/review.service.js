const Review = require("../model/review.model");
module.exports = class ReviewServices {
  async addNewReview(body) {
    try {
      return await Review.create(body);
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  async getAllReview(query) {
    try {
      // Pagination
      let pageNo = Number(query.pageNo) || 1;
      let perPage = Number(query.perPage) || 8;
      let skip = (pageNo - 1) * perPage;

      let reviewItem =
        query.reviewId && query.reviewId !== ""
          ? [
              {
                $match: { _id: new mongoose.Types.ObjectId(query.reviewId) },
              },
            ]
          : [];
      let loginUser =
        query.me && query.me === "true"
          ? [
              {
                $match: { user: userId },
              },
            ]
          : [];
      let pipeline = [
        {
          $match: { isDelete: false },
        },
        ...loginUser,
        ...reviewItem,
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
            pipeline: [
              {
                $project: {
                  fullName: 1,
                  email: 1,
                  profileImage: 1,
                },
              },
            ],
          },
        },
        {
          $set: { user: { $first: "$user" } },
        },
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "product",
            pipeline: [
              {
                $project: {
                  title: 1,
                  price: 1,
                  product_image: 1,
                },
              },
            ],
          },
        },
        {
          $set: { product: { $first: "$product" } },
        },
      ];

      const totalCount = await Review.aggregate([...pipeline]);
      let result = await Review.aggregate([
        ...pipeline,
        {
          $skip: skip,
        },
        {
          $limit: perPage,
        },
      ]);
      let totalPages = Math.ceil(totalCount.length / perPage);
      return {
        totalDoc: totalCount.length,
        totalPages,
        currentPage: pageNo,
        perPage,
        result: result,
      };
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  async getReview(body) {
    try {
      return await Review.findOne(body);
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  async getReviewById(id) {
    try {
      return await Review.findById(id);
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  async updateReview(id, body) {
    try {
      return await Review.findByIdAndUpdate(id, { $set: body }, { new: true })
        .populate("user")
        .populate("product");
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
};
