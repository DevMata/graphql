import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
import db from './db';

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
    users(parent, args, { db }, info) {
      const { query } = args;
      if (!query) {
        return db.users;
      }
      return db.users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      );
    },
    posts(parent, args, { db }, info) {
      const { query } = args;

      if (!query) {
        return db.posts;
      }
      return db.posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase()),
      );
    },
    comments(parent, args, { db }, info) {
      return db.comments;
    },
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      const { data } = args;
      if (db.users.some((user) => user.email === data.email)) {
        throw new Error('The email address is already taken');
      }

      const newUser = {
        id: uuidv4(),
        ...data,
      };

      db.users.push(newUser);
      return newUser;
    },
    deleteUser(parent, args, { db }, info) {
      const userId = db.users.findIndex((user) => user.id === args.id);
      if (userId < 0) {
        throw new Error('The user does not exist.');
      }

      const deletedUser = db.users.splice(userId, 1).shift();
      db.posts = db.posts.filter((post) => {
        const match = post.author === args.id;
        if (match) {
          db.comments = db.comments.filter(
            (comment) => comment.post === post.id,
          );
        }
        return !match;
      });
      db.comments = db.comments.filter((comment) => comment.author !== args.id);

      return deletedUser;
    },
    createPost(parent, args, { db }, info) {
      const { post } = args;

      if (!db.users.some((user) => user.id === post.author)) {
        throw new Error('The user does not exist');
      }

      const newPost = {
        id: uuidv4(),
        ...post,
      };

      db.posts.push(newPost);
      return newPost;
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex((post) => post.id === args.id);
      if (postIndex < 0) {
        throw new Error('The post does not exist');
      }

      const deletedPost = db.posts.splice(postIndex, 1).shift();
      db.comments = db.comments.filter((comment) => comment.post !== args.id);

      return deletedPost;
    },
    createComment(parent, args, { db }, info) {
      const { comment } = args;

      if (!db.users.some((user) => user.id === comment.author)) {
        throw new Error('The user does not exist');
      }

      if (!db.posts.some((post) => post.id === comment.post)) {
        throw new Error('The post does not exist');
      }

      const newComment = { id: uuidv4(), ...comment };

      db.comments.push(newComment);
      return newComment;
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(
        (comment) => comment.id === args.id,
      );
      if (commentIndex < 0) {
        throw new Error('The comment does not exist.');
      }

      return db.comments.splice(commentIndex, 1).shift();
    },
  },
  Post: {
    author(parent, args, { db }, info) {
      const { author } = parent;
      return db.users.find((user) => user.id === author);
    },
    comments(parent, args, { db }, info) {
      const { id } = parent;
      return db.comments.filter((comment) => comment.post === id);
    },
  },
  User: {
    posts(parent, args, { db }, info) {
      const { id } = parent;
      return db.posts.filter((post) => post.author === id);
    },
    comments(parent, args, { db }, info) {
      const { id } = parent;
      return db.comments.filter((comment) => comment.author === id);
    },
  },
  Comment: {
    author(parent, args, { db }, info) {
      const { author } = parent;
      return db.users.find((user) => user.id === author);
    },
    post(parent, args, { db }, info) {
      const { post: postId } = parent;
      return db.posts.find((post) => post.id === postId);
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { db },
});

server.start(() => {
  console.log('The server started up');
});
