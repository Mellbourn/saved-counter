const { ApolloServer, gql } = require("apollo-server-lambda");

const typeDefs = gql`
  type Query {
    "all counters"
    counters: [Counter!]!
  }

  type Counter {
    name: String
    value: Int!
  }
`;

const resolvers = {
  Query: {
    counters: () => [{ name: "default", value: 0 }]
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.graphqlHandler = server.createHandler();
