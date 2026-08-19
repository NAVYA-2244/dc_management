const userService = require("../services/userService");

// exports.getUsers = async (req, res) => {
//   try {
//     const result = await userService.getUsers();
//     return res.status(200).json({ result: "success", data: result });
//   } catch (err) {
//     return res.status(400).json({
//       result: "error",
//       error: err.message,
//       message: err.message,
//     });
//   }
// };

exports.getUsers = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    const result = await userService.getUsers({
      page,
      limit,
      search,
    });

    return res.status(200).json({
      result: "success",
      data: result.users,
      pagination: result.pagination,
    });
  } catch (err) {
    return res.status(400).json({
      result: "error",
      error: err.message,
      message: err.message,
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const result = await userService.getUserById(req.params.id);
    return res.status(200).json({ result: "success", data: result });
  } catch (err) {
    return res.status(400).json({
      result: "error",
      error: err.message,
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    return res
      .status(200)
      .json({ result: "success", message: "User updated", data: result });
  } catch (err) {
    return res.status(400).json({
      result: "error",
      error: err.message,
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(200).json({ result: "success", message: "User deleted" });
  } catch (err) {
    return res.status(400).json({
      result: "error",
      error: err.message,
      message: err.message,
    });
  }
};
