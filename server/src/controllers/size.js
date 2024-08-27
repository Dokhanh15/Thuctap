import Size from "../models/Size";

export const getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.find();
    res.json(sizes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSize = async (req, res) => {
  const size = new Size({
    name: req.body.name,
  });

  try {
    const newSize = await size.save();
    res.status(201).json(newSize);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

