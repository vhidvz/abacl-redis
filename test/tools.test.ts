import { key, parse, pattern } from '../src';

describe('test redis tools', () => {
  it('should parse scoped value', () => {
    expect(parse('create:own')).toEqual({ main: 'create', scope: 'own' });
  });

  it('should generate key for indexing', () => {
    expect(key({ subject: 'vhid.vz@gmail.com:author', action: 'any', object: 'all' })).toEqual(
      'abacl:vhid.vz@gmail.com:author:any:any:all:all',
    );

    expect(key({ subject: 'vahid@wenex.org', action: 'read:group', object: 'articles' })).toEqual(
      'abacl:vahid@wenex.org:null:read:group:articles:all',
    );

    expect(
      key({ subject: 'vahid@wenex.org', action: 'read', object: 'articles#published' }, { sep: '#' }),
    ).toEqual('abacl#vahid@wenex.org#null#read#any#articles#published');
    expect(
      key(
        { subject: 'vahid@wenex.org', action: 'read', object: 'articles#published' },
        { sep: '#', prefix: 'abacl' },
      ),
    ).toEqual('abacl#vahid@wenex.org#null#read#any#articles#published');
  });

  it('should return full pattern of policy', () => {
    expect(pattern({ subject: { val: 'root' } })).toEqual(
      /abacl:root:null:[^:][^:]*:[^:][^:]*:[^:][^:]*:[^:][^:]*/,
    );

    expect(pattern({ action: { strict: true, val: { main: 'read', scope: 'own' } } })).toEqual(
      /abacl:[^:][^:]*:[^:][^:]*:read:own:[^:][^:]*:[^:][^:]*/,
    );
    expect(pattern({ action: { strict: false, val: { main: 'read', scope: 'own' } } })).toEqual(
      /abacl:[^:][^:]*:[^:][^:]*:read:[^:][^:]*:[^:][^:]*:[^:][^:]*/,
    );

    expect(pattern({ object: { val: { main: 'article', scope: 'published' } } }, { sep: '#' })).toEqual(
      /abacl#[^#][^#]*#[^#][^#]*#[^#][^#]*#[^#][^#]*#article#published/,
    );
    expect(
      pattern({ object: { val: { main: 'article', scope: 'published' } } }, { sep: '#', prefix: 'abacl' }),
    ).toEqual(/abacl#[^#][^#]*#[^#][^#]*#[^#][^#]*#[^#][^#]*#article#published/);
  });
});
