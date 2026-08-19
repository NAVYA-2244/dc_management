const db = require("../models");
const { Op } = require("sequelize");
// // GET ALL
// exports.getUsers = async () => {
//   return await db.users.findAll({
//     attributes: { exclude: ["password", "otp"] },
//     order: [["created_at", "DESC"]],
//   });
// };
exports.getUsers = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.max(parseInt(limit) || 10, 1);
  const offset = (pageNum - 1) * limitNum;

  const where = {};

  if (search && search.trim()) {
    where[Op.or] = [
      {
        full_name: {
          [Op.like]: `%${search.trim()}%`,
        },
      },
      {
        mobile: {
          [Op.like]: `%${search.trim()}%`,
        },
      },
    ];
  }

  const { count, rows } = await db.users.findAndCountAll({
    attributes: { exclude: ["password", "otp"] },
    where,
    order: [["created_at", "DESC"]],
    limit: limitNum,
    offset,
  });

  return {
    users: rows,
    pagination: {
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum),
    },
  };
};

// GET BY ID
exports.getUserById = async (id) => {
  const user = await db.users.findByPk(id, {
    attributes: { exclude: ["password", "otp"] },
  });
  if (!user) throw new Error("User not found");
  return user;
};

// UPDATE
exports.updateUser = async (id, payload) => {
  const {
    full_name,
    email,
    mobile,
    role,
    designation,
    employee_id,
    branch,
    status,
  } = payload;

  const user = await db.users.findByPk(id);
  if (!user) throw new Error("User not found");

  if (email && email !== user.email) {
    const existing = await db.users.findOne({ where: { email } });
    if (existing) throw new Error("Email already exists");
  }

  if (mobile && mobile !== user.mobile) {
    const existing = await db.users.findOne({ where: { mobile } });
    if (existing) throw new Error("Mobile number already exists");
  }

  const updateData = {
    full_name,
    email,
    mobile,
    role,
    designation,
    employee_id,
    branch,
    status,
  };
  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key],
  );

  await user.update(updateData);

  const { password, otp, ...userData } = user.toJSON();
  return userData;
};

// DELETE
exports.deleteUser = async (id) => {
  const user = await db.users.findByPk(id);
  if (!user) throw new Error("User not found");
  await user.destroy();
  return true;
};
