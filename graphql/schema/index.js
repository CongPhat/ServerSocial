const { buildSchema } = require("graphql");
const schemaMessage = require("./message");
const schemaFriend = require("./friend");
module.exports = buildSchema(`
    ${schemaMessage.typeQuery}
    ${schemaFriend.typeQuery}
    type User {
        _id: String!
        name: String!
        image: String!
        description: String!
        online: Boolean!
    }
    type RootQuery {
        ${schemaMessage.query}
        ${schemaFriend.query}
    }
    type RootMutation {
        ${schemaMessage.mutation}
        ${schemaFriend.mutation}
    }
    type RootSubscription {
        ${schemaMessage.subscription}
        ${schemaFriend.subscription}
    }
    schema {
        query: RootQuery
        mutation: RootMutation
        subscription: RootSubscription
    }
`);
