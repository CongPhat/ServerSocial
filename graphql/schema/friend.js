module.exports = {
  typeQuery: `
        type Friend {
            idFriend: String!
            status: Int!
            isOwner: Boolean!
        }
    `,
  query: `
        friends(id: String!): [User!]!
        friendsOnline: [User!]!
      `,
  mutation: `
      `,
  subscription: `

      `,
};
