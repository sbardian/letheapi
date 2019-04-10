import log from './logging';

describe('Logger tests', () => {
  it('Should return a instance of logger', () => {
    expect(log).toHaveProperty('info');
    expect(log).toHaveProperty('warn');
    expect(log).toHaveProperty('error');
  });
  it('Should not have a bs property', () => {
    expect(log).not.toHaveProperty('BS');
  });
});
