import { BoldCharsPipe } from './bold-chars.pipe';

describe('BoldCharsPipe', () => {
  let pipe: BoldCharsPipe;

  beforeEach(() => {
    pipe = new BoldCharsPipe();
  });

  it('should return same value when no search character is provided', () => {
    const value = pipe.transform('test');

    expect(value).toBe('test');
  });
  it('should transform simple value', () => {
    const value = pipe.transform('a', 'a');

    expect(value).toBe('<b>a</b>');
  });

  it('should be case insensitive', () => {
    const value = pipe.transform('a', 'A');

    expect(value).toBe('<b>a</b>');
  });

  it('should transform complex value', () => {
    const value = pipe.transform('This is a test value', 'test');

    expect(value).toBe('This is a <b>test</b> value');
  });

  it('should transform multiple matches', () => {
    const value = pipe.transform('This TeSt is a test value', 'test');

    expect(value).toBe('This <b>TeSt</b> is a <b>test</b> value');
  });
});
