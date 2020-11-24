import uuidv4 from 'uuid/v4';

const Mutation = {
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
        db.comments = db.comments.filter((comment) => comment.post === post.id);
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
};

export { Mutation as default };
