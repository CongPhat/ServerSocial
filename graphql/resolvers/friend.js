const controllerFriend = require("./../../controller/friend");
const { PubSub } = require("graphql-subscriptions");
const { withFilter } = require("apollo-server");
const pubsub = new PubSub();
module.exports = {
  friends: async (args, context) => {
    console.log(context);
    const { id } = args;
    return await controllerFriend.getFriend(id);
  },
  friendsOnline: async (args, context) => {
    const {
      userAuth: { _id },
    } = context;
    return await controllerFriend.getFriendsOnline(_id);
  },
  //   createMessage: async (args) => {
  //     const data = await controllerMessage.createMessage(
  //       args.text,
  //       args.id,
  //       args.idUser
  //     );
  //     pubsub.publish(
  //       "newMessage",
  //       {
  //         newMessage: data,
  //       },
  //       { id: "1234" }
  //     );
  //     return data;
  //   },
  //   newMessage: withFilter(
  //     () => pubsub.asyncIterator("newMessage"),
  //     (payload, variables, context) => {
  //       if (
  //         payload.newMessage.userReceive._id == context.variableValues.idUser ||
  //         payload.newMessage.userReceive._id == context.variableValues.id
  //       ) {
  //         return true;
  //       }
  //       return false;
  //     }
  //   ),
};
