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

/*prisma.mutation
  .createPost(
    {
      data: {
        title: 'My new post',
        body: 'Body',
        published: true,
        author: { connect: { id: 'ckiguzkj100dh0747wnzw1cn8' } },
      },
    },
    '{ id title body published author{ id name } }',
  )
  .then(log)
  .catch(log);*/

/*prisma.mutation
  .updatePost(
    {
      data: {
        published: true,
      },
      where: { id: 'ckitq7ihc00ak0847dhahte1k' },
    },
    '{id title body published author{ id name } }',
  )
  .then(log)
  .catch(log);*/
