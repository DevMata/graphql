import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

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
    post: '456',
  },
  {
    id: 'b',
    text: 'The B text',
    author: '2',
    post: '123',
  },
  {
    id: 'c',
    text: 'The C text',
    author: '3',
    post: '789',
  },
  {
    id: 'd',
    text: 'The D text',
    author: '2',
    post: '147',
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
  
  type Mutation{
    createUser(name:String!,email:String!,age:Int):User!
    createPost(title:String!,body:String!,published:Boolean!,author:ID!):Post!
    createComment(text:String!,author:ID!,post:ID!):Comment!
  }
  
  input CreateUserInput{
    name:String!
    email:String!
    age:Int
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
    comments: [Comment!]!
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const { name, email, age } = args;
      if (users.some((user) => user.email === email)) {
        throw new Error('The email address is already taken');
      }

      const newUser = {
        id: uuidv4(),
        name,
        email,
        age,
      };

      users.push(newUser);
      return newUser;
    },
    createPost(parent, args, ctx, info) {
      const { title, body, published, author } = args;

      if (!users.some((user) => user.id === author)) {
        throw new Error('The user does not exist');
      }

      const newPost = {
        id: uuidv4(),
        title,
        body,
        published,
        author,
      };

      posts.push(newPost);
      return newPost;
    },
    createComment(parent, args, ctx, info) {
      const { text, author, post: postId } = args;

      if (!users.some((user) => user.id === author)) {
        throw new Error('The user does not exist');
      }

      if (!posts.some((post) => post.id === postId)) {
        throw new Error('The post does not exist');
      }

      const newComment = { id: uuidv4(), text, author, post: postId };

      comments.push(newComment);
      return newComment;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      const { author } = parent;
      return users.find((user) => user.id === author);
    },
    comments(parent, args, ctx, info) {
      const { id } = parent;
      return comments.filter((comment) => comment.post === id);
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
    post(parent, args, ctx, info) {
      const { post: postId } = parent;
      return posts.find((post) => post.id === postId);
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
