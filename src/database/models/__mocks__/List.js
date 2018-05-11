export default {
  find: jest.fn(() => ({
    limit: jest.fn(),
  })),
  findById: jest.fn(),
};
