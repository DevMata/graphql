import { GraphQLServer } from 'graphql-yoga';

const users = [
  {
    id: '1',
    name: 'Antonio Mata',
    email: 'antonio@email.com',
    age: 27,
  },
  {
    id: '2',
    name: 'Arely Viana',
    email: 'arely@email.com',
    age: null,
  },
  {
    id: '3',
    name: 'Adriana Rivas',
    email: 'adriana@email.com',
    age: null,
  },
];

const posts = [
  {
    id: '456',
    title: 'Boundaries',
    body: 'A book about limits',
    published: true,
    author: '1',
  },
  {
    id: '123',
    title: 'Wild at heart',
    body: 'A real man book',
    published: false,
    author: '2',
  },
  {
    id: '789',
    title: 'Pragmatic programmer',
    body: 'Body',
    published: false,
    author: '3',
  },
  {
    id: '147',
    title: 'Clean Code',
    body: 'Uncle Bob',
    published: true,
    author: '1',
  },
];
/*
 * GraphQL Types
 * String, Boolean, Int, Float, ID
 * */

// types definitions
const typeDefs = `
  type Query {
    me: User!
    post: Post!
    users(query:String):[User!]!
    posts(query:String):[Post!]!
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
    author: User!
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
    users(parent, args, ctx, info) {
      const { query } = args;
      if (!query) {
        return users;
      }
      return users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      );
    },
    posts(parent, args, ctx, info) {
      const { query } = args;

      if (!query) {
        return posts;
      }
      return posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase()),
      );
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      const { author } = parent;
      return users.find((user) => user.id === author);
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
