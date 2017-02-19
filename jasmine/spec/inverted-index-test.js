describe('Inverted Index Tests', () => {
  const testData = [
    {
      title: 'Alice in Wonderland',
      text: 'Alice falls into a rabbit hole and enters a world full of imagination.',
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

  const testFile = {
    name: 'testFile',
    files: testData,
  };

  const testFile2 = {
    name: 'testFile2',
    files: testData2,
  };

  beforeEach(() => {
    this.testIndex = instance.createIndex(testFile.name, testFile.files);

    const testIndex2 = instance.createIndex(testFile2.name, testFile2.files);
  });

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
      expect(instance.isJSON(testData2)).toBe(true);
    });

    it('verifies that the correct message is returned if an empty file is uploaded', () => {
      expect(emptyResult.message).toBe(`${emptyFile.name} ${'is empty!'}`);
    });

    it('verifies that JSON array is not empty.', () => {
      expect(instance.isJSON(testData)).toBe(true);
    });

    it('verifies that when JSON file is invalid a false is returned by isJSON method.', () => {
      expect(instance.isJSON(emptyJSON)).toBe(false);
    });
  });

  describe('Populate Index', () => {
    it('should ensure index is created once JSON file has been read', () => {
      expect(this.testIndex.message).toBe(`${testFile.name} ${' has been indexed successfully.'}`);
    });

    it('ensures created index is correct', () => {
      const indexCreated = instance.getIndex(testFile.name);
      expect(Array.from(indexCreated.a)).toEqual([0, 1]);
    });

    it('ensures index is not overwritten', () => {
      expect(Object.keys(instance.getIndex(this.indices))).toEqual(['testData', 'testFile', 'testFile2']);
    });
  });

  describe('Search index', () => {
    it('should check that search index returns correct results', () => {
      expect(instance.searchIndex(testFile.name, 'alice')).toEqual({ testFile: { alice: [0] } });
    });

    it('should return null if file passed is not found', () => {
      expect(instance.searchIndex('notFound.json', 'alice')).toBe(null);
    });

    it('should search an array of terms', () => {
      expect(instance.searchIndex(testFile.name, '["alice", "of", "a"]')).toEqual({ testFile: { alice: [0], of: [0, 1], a: [0, 1] } });
    });

    it('should handle a varied number of search terms as arguments', () => {
      expect(instance.searchIndex(testFile.name, 'dwarf, and, cow')).toEqual({ testFile: { dwarf: [1], and: [0, 1], cow: [] } });
    });

    it('should go through all indexed files if the file name is not passed', () => {
      expect(instance.searchIndex('', 'a, of')).toEqual({ testData: { a: [0, 1], of: [0, 1] }, testFile: { a: [0, 1], of: [0, 1] }, testFile2: { a: [0], of: [1] } });
    });
  });
});
