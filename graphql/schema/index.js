const { buildSchema } = require("graphql");
const schemaMessage = require("./message");
module.exports = buildSchema(`
    ${schemaMessage.typeQuery}
    type User {
        _id: String!
        name: String!
        image: String!
    }
    type RootQuery {
        ${schemaMessage.query}
    }
    type RootMutation {
        ${schemaMessage.mutation}
    }
    type RootSubscription {
        ${schemaMessage.subscription}
    }
    schema {
        query: RootQuery
        mutation: RootMutation
        subscription: RootSubscription
    }
`);
