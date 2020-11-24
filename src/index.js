import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

let users = [
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

let posts = [
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

let comments = [
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
      const { data } = args;
      if (users.some((user) => user.email === data.email)) {
        throw new Error('The email address is already taken');
      }

      const newUser = {
        id: uuidv4(),
        ...data,
      };

      users.push(newUser);
      return newUser;
    },
    deleteUser(parent, args, ctx, info) {
      const userId = users.findIndex((user) => user.id === args.id);
      if (userId < 0) {
        throw new Error('The user does not exist.');
      }

      const deletedUser = users.splice(userId, 1).shift();
      posts = posts.filter((post) => {
        const match = post.author === args.id;
        if (match) {
          comments = comments.filter((comment) => comment.post === post.id);
        }
        return !match;
      });
      comments = comments.filter((comment) => comment.author !== args.id);

      return deletedUser;
    },
    createPost(parent, args, ctx, info) {
      const { post } = args;

      if (!users.some((user) => user.id === post.author)) {
        throw new Error('The user does not exist');
      }

      const newPost = {
        id: uuidv4(),
        ...post,
      };

      posts.push(newPost);
      return newPost;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);
      if (postIndex < 0) {
        throw new Error('The post does not exist');
      }

      const deletedPost = posts.splice(postIndex, 1).shift();
      comments = comments.filter((comment) => comment.post !== args.id);

      return deletedPost;
    },
    createComment(parent, args, ctx, info) {
      const { comment } = args;

      if (!users.some((user) => user.id === comment.author)) {
        throw new Error('The user does not exist');
      }

      if (!posts.some((post) => post.id === comment.post)) {
        throw new Error('The post does not exist');
      }

      const newComment = { id: uuidv4(), ...comment };

      comments.push(newComment);
      return newComment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id,
      );
      if (commentIndex < 0) {
        throw new Error('The comment does not exist.');
      }

      return comments.splice(commentIndex, 1).shift();
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
  typeDefs: './src/schema.graphql',
  resolvers,
});

server.start(() => {
  console.log('The server started up');
});
