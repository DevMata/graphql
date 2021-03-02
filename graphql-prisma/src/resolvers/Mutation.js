import uuidv4 from 'uuid/v4';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    return prisma.mutation.createUser({ data: args.data }, info);
  },
  updateUser(parent, args, { prisma }, info) {
    return prisma.mutation.updateUser(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info,
    );
  },
  async deleteUser(parent, args, { prisma }, info) {
    return prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },
  createPost(parent, args, { db, pubsub }, info) {
    const { post } = args;

    if (!db.users.some((user) => user.id === post.author)) {
      throw new Error('The user does not exist');
    }

    const newPost = {
      id: uuidv4(),
      ...post,
    };

    if (newPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: newPost,
        },
      });
    }
    db.posts.push(newPost);
    return newPost;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;

    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error('The post does not exist');
    }

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }
    if (typeof data.published === 'boolean') {
      post.published = data.published;
      if (originalPost.published && !post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post,
          },
        });
      }
    } else if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post,
        },
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex < 0) {
      throw new Error('The post does not exist');
    }

    const deletedPost = db.posts.splice(postIndex, 1).shift();
    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    if (deletedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: deletedPost,
        },
      });
    }

    return deletedPost;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const { comment } = args;

    if (!db.users.some((user) => user.id === comment.author)) {
      throw new Error('The user does not exist');
    }

    if (!db.posts.some((post) => post.id === comment.post && post.published)) {
      throw new Error('The post does not exist');
    }

    const newComment = { id: uuidv4(), ...comment };

    db.comments.push(newComment);
    pubsub.publish(`comment ${comment.post}`, {
      comment: { mutation: 'CREATED', data: newComment },
    });

    return newComment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === id);
    if (!comment) {
      throw new Error('The error does not exist.');
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: { mutation: 'UPDATED', data: comment },
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id,
    );
    if (commentIndex < 0) {
      throw new Error('The comment does not exist.');
    }

    const deletedComment = db.comments.splice(commentIndex, 1).shift();

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: { mutation: 'DELETED', data: deletedComment },
    });

    return deletedComment;
  },
};

export { Mutation as default };
