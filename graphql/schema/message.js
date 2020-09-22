module.exports = {
  typeQuery: `
        type Message {
            _id: ID!
            content: String!
            userSend: User!
            userReceive: User!
            like: Int!
            date: String!
            isSend: String!
        }
        type Comment {
          id: String
          content: String
        }
    `,
  query: `
        messages(id: String!, idUser: String!, payload: Int!): [Message!]!
    `,
  mutation: `
        createMessage(text: String!, id: String!, idUser: String!): Message!
    `,
  subscription: `
        messages(id: String!, idUser: String!): [Message!]!
        newMessage(id: String, idUser: String!): Message!
    `,
};
