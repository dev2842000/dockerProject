const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const generatePermalink = (name) => {
  return name ? name.toLowerCase().replace(/\s+/g, "-") : "";
};

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

exports.getUsers = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    filter,
    search,
    sortOrder,
    sortKey
  } = req.query;

  const parsedLimit = parseInt(limit, 10);
  const parsedPage = parseInt(page, 10);

  if (isNaN(parsedLimit) || parsedLimit <= 0) {
    return res.status(400).json({ error: "Invalid limit value" });
  }

  if (isNaN(parsedPage) || parsedPage <= 0) {
    return res.status(400).json({ error: "Invalid page value" });
  }

  const offset = (parsedPage - 1) * parsedLimit;

  const queryOptions = {
    limit: parsedLimit,
    offset,
    order: [],
    where: { deleted: false },
  };

  const defaultSortKey = 'name';
  const defaultSortOrder = 'ASC';
  
  const effectiveSortKey = sortKey || defaultSortKey;
  const effectiveSortOrder = sortOrder ? (sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC') : defaultSortOrder;
  
  queryOptions.order.push([effectiveSortKey, effectiveSortOrder]);
  const where = { deleted: false };

  if (filter) {
    filter.split(",").forEach((condition) => {
      const [key, value] = condition.split(":");
      if (key && value) {
        const sanitizedKey = key.trim();
        if (["name", "email", "enabled"].includes(sanitizedKey)) {
          where[sanitizedKey] = value.trim();
        }
      }
    });
  }

  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }

  queryOptions.where = { ...queryOptions.where, ...where };


  try {
    const users = await User.findAndCountAll(queryOptions);

    res.status(200).json({
      totalItems: users.count,
      totalPages: Math.ceil(users.count / parsedLimit),
      currentPage: parsedPage,
      users: users.rows,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user." });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, enabled } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    const hashedPassword = await hashPassword(password);
    const permalink = generatePermalink(name);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      permalink,
      enabled: enabled || true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      permalink: newUser.permalink,
      enabled: newUser.enabled,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const [updated] = await User.update(updatedData, {
      where: { id },
      returning: true,
    });

    if (updated) {
      const updatedUser = await User.findByPk(id);
      return res.status(200).json(updatedUser);
    }

    throw new Error("User not found");
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
};

exports.partialUpdateUser = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;
  

  try {
    if (!updateFields || Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const [affectedRows] = await User.update(updateFields, {
      where: { id },
    });

    if (affectedRows > 0) {
      const updatedUser = await User.findByPk(id);
      return res.status(200).json(updatedUser);
    }

    return res.status(400).json({ error: "No changes were made" });
  } catch (error) {
    console.error("Error partially updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while partially updating the user." });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [updated] = await User.update(
      { deleted: true },
      { where: { id } }
    );
    if (updated) {
      return res.status(204).json({ error: "User Deleted!" });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "An error occurred while updating the user." });
  }
};

