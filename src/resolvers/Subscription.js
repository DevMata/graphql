const Subscription = {
  post: {
    subscribe(parent, args, { db, pubsub }, info) {
      return pubsub.asyncIterator('post');
    },
  },
  comment: {
    subscribe(parent, args, { db, pubsub }, info) {
      const { postId } = args;
      const post = db.posts.find(
        (post) => post.id === postId && post.published,
      );
      if (!post) {
        throw new Error('The post does not exist.');
      }

      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },
};

export { Subscription as default };
