const User = require("../model/user.model");

module.exports = class UserService {
    // Create user
    async createUser(body) {
      try {
        return await User.create(body);
      } catch (error) {
        return error.message;
      }
    }
   
    // Get One User
    async findOneUser(body) {
      try {
        return await User.findOne(body);
      } catch (error) {
        return error.message;
      }
    }
  
  
    // Get All User
    async findAllUser(body) {
      try {
    //     // Pagination
    //   let pageNo = query.pageNo || 1;
    //   let perPage = query.perPage || 5;
    //   let skip = (pageNo - 1) * perPage;

    //   let Pagination =
    //   {
    //     $skip: skip,
    //   }, 
    //   {
    //     $limit: perPage,
    //   },

    // let results  = await FavoriteModel.aggregate(Pagination);
    // let totalPages = Math.ceil(results.length / perPage);

        return await User.find(body);
      } catch (error) {
        return error.message;
      }
    }
  
    // Update User
    async updateUser(id, body) {
      try {
        return await User.findByIdAndUpdate(
          id,
          {
            $set: body,
          },
          {
            new: true,
          }
        );
      } catch (error) {
        return error.message;
      }
    }
  };