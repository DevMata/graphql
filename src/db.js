const users = [
  {
    id: '1',
    name: 'Antonio Mata',
    email: 'antonio@email.com',
    age: 27,
  },
  {
    id: '2',
    name: 'Alicia Ortiz',
    email: 'alicia@email.com',
    age: null,
  },
  {
    id: '3',
    name: 'Juan Rivas',
    email: 'juan@email.com',
    age: null,
  },
];

const posts = [
  {
    id: '456',
    title: 'Boundaries',
    body: 'A book about limits',
    published: true,
    author: '1',
  },
  {
    id: '123',
    title: 'Wild at heart',
    body: 'A real man book',
    published: false,
    author: '2',
  },
  {
    id: '789',
    title: 'Pragmatic programmer',
    body: 'Body',
    published: false,
    author: '3',
  },
  {
    id: '147',
    title: 'Clean Code',
    body: 'Uncle Bob',
    published: true,
    author: '1',
  },
];

const comments = [
  {
    id: 'a',
    text: 'The A text',
    author: '1',
    post: '456',
  },
  {
    id: 'b',
    text: 'The B text',
    author: '2',
    post: '123',
  },
  {
    id: 'c',
    text: 'The C text',
    author: '3',
    post: '789',
  },
  {
    id: 'd',
    text: 'The D text',
    author: '2',
    post: '147',
  },
];

const db = {
  users,
  posts,
  comments,
};

module.exports = db;

export { db as default };
