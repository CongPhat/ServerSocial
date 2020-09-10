module.exports = {
  typeQuery: `
        type Message {
            _id: ID!
            content: String!
            userSend: User!
            like: Int!
            date: String!
            isSend: Boolean 
        }
    `,
  query: `
        messages(id: String!, idUser: String!): [Message!]!
    `,
  mutation: `
        createMessage(text: String!, id: String!, idUser: String!): Message!
    `,
  subscription: `
        messages(id: String!, idUser: String!): [Message!]!
    `,
};
