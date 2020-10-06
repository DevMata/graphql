import { GraphQLServer } from 'graphql-yoga';

/*
 * GraphQL Types
 * String, Boolean, Int, Float, ID
 * */

// types definitions
const typeDefs = `
  type Query {
    greeting(name: String, position:String): String!
    me: User!
    post: Post!
    add(a:Float!,b:Float!):Float!
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
    greeting(parent, args, ctx, info) {
      if (args.name && args.position) {
        return `Hello ${args.name}! You are my favorite ${args.position}`;
      } else {
        return 'Hello';
      }
    },
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
    add(parent, args, ctx, info) {
      const { a, b } = args;
      return a + b;
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
