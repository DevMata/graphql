import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
});

const log = (data) => console.log(JSON.stringify(data, null, 2));

/*prisma.query
  .users(null, '{ id name email posts{ id title body published } }')
  .then(log)
  .catch(log);*/

/*prisma.query
  .comments(null, '{ id text author{ id name } }')
  .then(log)
  .catch(log);*/

const createPostForUser = async (authorId, data) => {
  await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: { connect: { id: authorId } },
      },
    },
    '{ id }',
  );

  return await prisma.query.user(
    { where: { id: authorId } },
    '{ id name email posts { id title body published } }',
  );
};

const updatePostForUser = async (postId, data) => {
  const post = await prisma.mutation.updatePost(
    {
      data,
      where: { id: postId },
    },
    '{ author{ id } }',
  );

  return await prisma.query.user(
    { where: { id: post.author.id } },
    '{ id name email posts { id title body published } }',
  );
};

/*createPostForUser('ckiguzkj100dh0747wnzw1cn8', {
  title: 'Second post of the night',
  body: 'A good body',
  published: true,
})
  .then(log)
  .catch(log);*/

/*updatePostForUser('ckitr2bs100sj0847jx1mzb0m', { published: false })
  .then(log)
  .catch(log);*/
