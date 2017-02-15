const testData = [
  {
    title: 'Alice in Wonderland',
    text: 'Alice falls into a rabbit hole and enters a world full of imagination ring.',
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.',
  },
];

const testData2 = [
  {
    title: 'The Book Thief',
    text: 'A book narrated by death',
  },
  {
    title: 'Gone Girl',
    text: 'Lots of weird stuff happening here',
  },
];

const emptyJSON = '';

const instance = new Index();

describe('Read Book Data', () => {
  const validFile = {
    name: 'testData',
    files: testData,
  };

  const emptyFile = {
    name: 'emptyJSON',
    files: emptyJSON,
  };

  const validResult = instance.createIndex(validFile.name, validFile.files);

  const emptyResult = instance.createIndex(emptyFile.name, emptyFile.files);

  it('verifies that the JSON file read is a valid JSON Array', () => {
    expect(validResult.message).toBe(`${validFile.name} ${' has been indexed successfully.'}`);
  });
 
  it('verifies that the the correct mesage is returned if an empty file is uploaded', () => {
      expect(emptyResult.message).toBe(`${emptyFile.name} ${'is empty!'}`);
    });
  
  it('verifies that JSON array is not empty.', () => {
    expect(instance.isJSON(testData).length).toBe(2);
  });
});

describe('Populate Index', () => {
  const jsonFile = {
    name: 'testFile',
    files: testData,
  };

  const testFile2 = {
    name: 'test2',
    files: testData2,
  };

  const created = instance.createIndex(jsonFile.name, jsonFile.files);
  it('should ensure index is created once JSON file has been read', () => {
    expect(created.message).toBe(`${jsonFile.name} ${' has been indexed successfully.'}`);
  });

  it('ensures created index is correct', () => {
    instance.createIndex(testFile2.name, testFile2.files);
    const indexCreated = instance.getIndex(jsonFile.name);
    expect(Array.from(indexCreated.a)).toEqual([0, 1]);
  });

  it('ensures index is not overwritten', () => {
    expect(Object.keys(instance.indices)).toEqual([ 'testData', 'testFile', 'test2' ]);
  });
});

describe('Search index', () => {
  const jsonFile = {
    name: 'testFile',
    files: testData,
  };

  const testFile2 = {
    name: 'test2',
    files: testData2,
  };
  it('should check that search index returns correct results', () => {
    instance.createIndex(jsonFile.name, jsonFile.files);
    instance.createIndex(testFile2.name, testFile2.files);
    expect(instance.searchIndex(jsonFile.name, 'alice')).toEqual({ testFile: { alice: [0] } });
    expect(instance.searchIndex(jsonFile.name, 'of')).toEqual({ testFile: { of: [0, 1] } });
    expect(instance.searchIndex(jsonFile.name, 'lord')).toEqual({ testFile: { lord: [1] } });
  });

  it('should search an array of terms', () => {
    expect(instance.searchIndex(jsonFile.name, '["alice", "of", "a"]')).toEqual({ testFile: { alice: [ 0 ], of: [ 0, 1 ], a: [ 0, 1 ] } });
  });

  it('should handle a varied number of search terms as arguments', () => {
    expect(instance.searchIndex(jsonFile.name, 'dwarf, and, cow')).toEqual({ testFile: { dwarf: [ 1 ], and: [ 0, 1 ], cow: [  ] } });
  });

  it('should go through all indexed files if the file name is not passed', () => {
    expect(instance.searchIndex(null, 'a, of')).toEqual({ testData: { a: [ 0, 1 ], of: [ 0, 1 ] }, testFile: { a: [ 0, 1 ], of: [ 0, 1 ] }, test2: { a: [ 0 ], of: [ 1 ] } });
  });  
});
