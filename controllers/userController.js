const User = require('../models/usersModel');
const ImageService = require('../services/imageService');

// Take current data user
const currentDataUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json({ email: user.email, subscription: user.subscription, avatarURL: user.avatarURL });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// update user's avatar
const updateCurrentAvatar = async (req, res) => {
  try {
    const { user, file } = req;

    if (file) {
      user.avatarURL = await ImageService.save(file, { width: 250, height: 250 }, 'public', 'avatars', user.id);
    }

    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    const updatedUser = await user.save();

    res.status(200).json({
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  currentDataUser,
  updateCurrentAvatar,
};
