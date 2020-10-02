import { GraphQLServer } from 'graphql-yoga';

/*
 * GraphQL Types
 * String, Boolean, Int, Float, ID
 * */

// types definitions
const typeDefs = `
  type Query {
    me: User!
    post: Post!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: '123',
        name: 'Antonio',
        email: 'antonio@email.com',
      };
    },
    post() {
      return {
        id: '456',
        title: 'Boundaries',
        body: 'Body',
        published: false,
      };
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
