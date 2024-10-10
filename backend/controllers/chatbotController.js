require('dotenv').config();
const { StatusCodes } = require("http-status-codes");
const { handleUserInput } = require('../services/handleUserInput')

const handleQuery = async (req, res) => {
  const { input } = req.body
  try {
    if (typeof input === 'string') {
      const output = await handleUserInput(req, input)
      return res.status(StatusCodes.OK).json({ botMessage: output });
    } else {
      console.log("The user input is not a string:", input)
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "The input is not a string. Try again but with one string",
      });
    }
  } catch (error) {
    console.log("HandleQuery Error:", error)
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: error,
    });
  }
}


module.exports = { handleQuery };
