import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser(parent, args, { prisma }, info) {
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
  deleteUser(parent, args, { prisma }, info) {
    return prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },
  createPost(parent, args, { prisma }, info) {
    const { author: authorId, ...postData } = args.data;

    return prisma.mutation.createPost(
      {
        data: {
          ...postData,
          author: { connect: { id: authorId } },
        },
      },
      info,
    );
  },
  updatePost(parent, args, { prisma }, info) {
    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info,
    );
  },
  deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id,
        },
      },
      info,
    );
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
