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

  type Mutation {
    increase: Int
    decrease: Int
  }
`;

let counters = [{ name: "default", value: 0 }];

const resolvers = {
  Query: {
    counters: () => counters
  },
  Mutation: {
    increase: () => counters[0].value++,
    decrease: () => counters[0].value--
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.graphqlHandler = server.createHandler();
