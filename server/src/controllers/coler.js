import Color from "../models/Color";

export const getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createColor = async (req, res) => {
  const { name, hex } = req.body;

  const color = new Color({
    name,
    hex,
  });

  try {
    const newColor = await color.save();
    res.status(201).json(newColor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

