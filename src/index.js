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

const comments = [
  {
    id: 'a',
    text: 'The A text',
    author: '1',
  },
  {
    id: 'b',
    text: 'The B text',
    author: '2',
  },
  {
    id: 'c',
    text: 'The C text',
    author: '3',
  },
  {
    id: 'd',
    text: 'The D text',
    author: '2',
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
    comments(query:String):[Comment!]!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
  
  type Comment {
    id: ID!,
    text: String!
    author: User!
    post: Post!
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
    comments(parent, args, ctx, info) {
      return comments;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      const { author } = parent;
      return users.find((user) => user.id === author);
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      const { id } = parent;
      return posts.filter((post) => post.author === id);
    },
    comments(parent, args, ctx, info) {
      const { id } = parent;
      return comments.filter((comment) => comment.author === id);
    },
  },
  Comment: {
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
