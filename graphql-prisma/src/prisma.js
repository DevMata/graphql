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
  const userExists = await prisma.exists.User({ id: authorId });
  if (!userExists) {
    throw new Error('User does not exist.');
  }

  return await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: { connect: { id: authorId } },
      },
    },
    '{ author { id name email posts { id title body published } } }',
  );
};

const updatePostForUser = async (postId, data) => {
  const postExists = await prisma.exists.Post({ id: postId });
  if (!postExists) {
    throw new Error('Post does not exist');
  }

  return await prisma.mutation.updatePost(
    {
      data,
      where: { id: postId },
    },
    '{ author{ id name email posts { id title body published } } }',
  );
};

/*createPostForUser('ckigvg2b600k60747m17imv5l', {
  title: 'Second post of the year',
  body: 'A good body',
  published: true,
})
  .then(log)
  .catch(console.error);*/

/*updatePostForUser('ckitr2bs100sj0847jx1mzb0m', { published: true })
  .then(log)
  .catch(console.error);*/
