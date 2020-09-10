const controllerMessage = require("./../../controller/message");
module.exports = {
  messages: async (arg, req, res) => {
    const { id, idUser } = arg;
    return controllerMessage.getMessage(id, idUser);
  },
  createMessage: (args) => {
    console.log(args);
    return controllerMessage.createMessage(args.text, args.id, args.idUser);
  },
};
