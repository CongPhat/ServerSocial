const controllerMessage = require("./../../controller/message");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
module.exports = {
  messages: async (arg, req, res) => {
    const { id, idUser } = arg;
    return controllerMessage.getMessage(id, idUser);
  },
  createMessage: async (args) => {
    const data = await controllerMessage.createMessage(
      args.text,
      args.id,
      args.idUser
    );
    pubsub.publish("newMessage", {
      newMessage: data,
    });
    return data;
  },
  newMessage: () => pubsub.asyncIterator("newMessage"),
};
