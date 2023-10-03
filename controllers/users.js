const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const cloudinary = require("cloudinary");
const { nanoid } = require("nanoid");

const { User } = require("../models/user");
const { HttpError, ctrlWrapper, sendEmail } = require("../utils");

require("dotenv").config();
const { SECRET_KEY, SECRET_CLOUD_KEY, SECRET_CLOUD_API_KEY, SECRET_CLOUD_API_SECRET, BASE_URL } =
  process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: avatarUrl,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Email verification",
    html: `<a target=""_blank href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: "starter",
    },
  });
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "Email not found");
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

  res.status(200).json({
    message: "Verification successful",
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // if (!user) {
  //   throw HttpError(401, "Email or password is wrong");
  // }

  // const passwordCompare = await bcrypt.compare(password, user.password);

  // if (!passwordCompare) {
  //   throw HttpError(401, "Email or password is wrong");
  // }

  if (!user.verify) {
    throw HttpError(401, "User not verified");
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({
      message: "Email or password is wrong",
    });
    return;
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  user.token = token;
  await user.save();

  res.status(200).json({
    token,
    user: {
      email: email,
      subscription: "starter",
    },
  });
};

const current = async (req, res, next) => {
  const { email } = req.user;
  res.status(200).json({
    email: email,
    subscription: "starter",
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({ message: "No Content" });
};

// local file saving
// const updateAvatar = async (req, res, next) => {
//   const { path: tempUpload, originalname } = req.file;
//   const filename = `${req.user._id}_${originalname}`;
//   const resultUpload = path.join(avatarsDir, filename);

//   const avatar = await Jimp.read(tempUpload);
//   await avatar.resize(250, 250).write(resultUpload);

//   await fs.rename(tempUpload, resultUpload);
//   const avatarURL = path.join("avatars", filename);

//   await User.findByIdAndUpdate(req.user._id, { avatarURL });
//   res.status(200).json({
//     avatarURL,
//   });
// };

// cloudinary file saving
cloudinary.config({
  cloud_name: SECRET_CLOUD_KEY,
  api_key: SECRET_CLOUD_API_KEY,
  api_secret: SECRET_CLOUD_API_SECRET,
});

const updateAvatar = async (req, res, next) => {
  const { path: tempUpload, originalname } = req.file;
  const filename = `${req.user._id}_${originalname}`;
  const upload = await cloudinary.v2.uploader.upload(tempUpload, {
    public_id: filename,
    transformation: [{ width: 250, height: 250, crop: "fit" }],
  });

  const avatarURL = upload.url;

  await fs.unlink(tempUpload);

  await User.findByIdAndUpdate(req.user._id, { avatarURL });
  res.status(200).json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
