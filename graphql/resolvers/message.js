const controllerMessage = require("./../../controller/message");
const { PubSub } = require("graphql-subscriptions");
const { withFilter } = require("apollo-server");
const pubsub = new PubSub();
module.exports = {
  messages: async (args, context) => {
    const { id, idUser, payload } = args;
    return controllerMessage.getMessage(id, idUser, payload);
  },
  createMessage: async (args) => {
    const data = await controllerMessage.createMessage(
      args.text,
      args.id,
      args.idUser
    );
    pubsub.publish(
      "newMessage",
      {
        newMessage: data,
      },
      { id: "1234" }
    );
    return data;
  },
  newMessage: withFilter(
    () => pubsub.asyncIterator("newMessage"),
    (payload, variables, context) => {
      if (
        payload.newMessage.userReceive._id == context.variableValues.idUser ||
        payload.newMessage.userReceive._id == context.variableValues.id
      ) {
        return true;
      }
      return false;
    }
  ),
};
