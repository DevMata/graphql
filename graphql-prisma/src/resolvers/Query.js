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
    const operationArgs = {};

    if (args.query) {
      operationArgs.where = {
        OR: [
          {
            title_contains: args.query,
          },
          {
            body_contains: args.query,
          },
        ],
      };
    }

    return prisma.query.posts(operationArgs, info);
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
};

export { Query as default };
