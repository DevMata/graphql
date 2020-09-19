import { GraphQLServer } from 'graphql-yoga';

/*
 * GraphQL Types
 * String, Boolean, Int, Float, ID
 * */

// types definitions
const typeDefs = `
  type Query {
   title: String!
   price: Float!
   releaseYear: Int
   rating: Float!
   inStock: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    title() {
      return 'Surface Book 3';
    },
    price() {
      return 2500.15;
    },
    releaseYear() {
      return 2019;
    },
    rating() {
      return 4.8;
    },
    inStock() {
      return true;
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server started up');
});
