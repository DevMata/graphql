const Query = {
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
  users(parent, args, { prisma }, info) {
    const operationArgs = {};

    if (args.query) {
      operationArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
          {
            email_contains: args.query,
          },
        ],
      };
    }

    return prisma.query.users(operationArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    /*const { query } = args;

    if (!query) {
      return db.posts;
    }
    return db.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase()),
    );*/

    return prisma.query.posts(null, info);
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
};

export { Query as default };
