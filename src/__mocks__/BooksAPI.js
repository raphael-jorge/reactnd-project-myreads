export const get = jest.fn(
  bookId => Promise.resolve({})
);

export const getAll = jest.fn(
  () => Promise.resolve([])
);

export const update = jest.fn(
  (book, shelf) => Promise.resolve({})
);

export const search = jest.fn(
  query => Promise.resolve([])
);
