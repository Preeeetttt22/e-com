import User from '../models/User.js';

// @desc Add new address
export const addAddress = async (req, res) => {
  const { fullName, mobileNumber, street, city, state, postalCode, country, isDefault } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (isDefault) {
      // Reset all to false
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({ fullName, mobileNumber, street, city, state, postalCode, country, isDefault });
    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add address', error: error.message });
  }
};

// @desc Get all addresses
export const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch addresses', error: error.message });
  }
};

// @desc Delete address
export const deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete address', error: error.message });
  }
};

// @desc Set default address
export const setDefaultAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const user = await User.findById(req.user._id);
    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });
    await user.save();

    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to set default address', error: error.message });
  }
};
