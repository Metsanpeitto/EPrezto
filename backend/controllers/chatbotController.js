require('dotenv').config();
const { StatusCodes } = require("http-status-codes");
const { handleUserInput } = require('../services/handleUserInput')

const handleQuery = async (req, res) => {
  const { input } = req.body
  try {
    const output = await handleUserInput(input)
    return res.status(StatusCodes.OK).json({ botMessage: output });

  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: error,
    });
  }
}


module.exports = { handleQuery };
