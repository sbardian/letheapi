import createLoaders from './createLoaders';

describe('createLoaders tests', () => {
  it('Returns an object of loaders', () => {
    expect(createLoaders()).toEqual(
      expect.objectContaining({
        getUserLoader: expect.any(Object),
      }),
    );
  });
});
