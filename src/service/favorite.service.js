const favorite = require("../model/favorite.model");

module.exports = class FavoriteServieces {
  // ADD NEW FAVORITE
  async addNewFavorite(body) {
    try {
      return await favorite.create(body);
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  // GET ALL FAVORITE
  async getAllFavorite(query, userID) {
    try {
      // Pagination
      let pageNo = Number(query.pageNo) || 1;
      let perPage = Number(query.perPage) || 5;
      let skip = (pageNo - 1) * perPage;

      let favoriteItem =
        query.favoriteId && query.favoriteId !== ""
          ? [
              {
                $match: { _id: new mongoose.Types.ObjectId(query.favoriteId) },
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
        ...favoriteItem,
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

      //   console.log(pipeline);
      const totalCount = await favorite.aggregate([...pipeline]);
      let result = await favorite.aggregate([
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
      //   return ( result);
      return {
        totalDoc: totalCount.length,
        totalPages,
        currentPage: pageNo,
        result,
      };
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  // UPDATE FAVORITE
  async updateFavorite(query, userID) {
    try {
      let updateFavorite = await favorite.findOneAndUpdate(
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
      return updateFavorite;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  // GET SPECIFIC FAVORITE
  async getFavorite(body) {
    try {
      return await favorite.findOne(body);
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
};
