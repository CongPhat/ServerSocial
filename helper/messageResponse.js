const message = {
  messageSuccess: (message, data) => {
    return {
      message,
      data,
      status: 200,
    };
  },
  messageError: (message, data) => {
    return {
      message,
      data,
      status: 400,
    };
  },
};

module.exports = message;
