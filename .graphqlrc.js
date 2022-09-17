require('dotenv').config();

module.exports = {
  schema: [
    {
      [process.env.CUBE_ENDPOINT || '']: {
        headers: {
          Authorization: process.env.CUBE_KEY || '',
        },
      },
    },
  ],
};
