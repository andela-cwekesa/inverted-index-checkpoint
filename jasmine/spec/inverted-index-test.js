// import file
 // const Index = require('../../public/dist/inverted-index.js');
 // const Index = require('../../public/src/inverted-index.js');

/**
 * Test data that will used in testing.It is like a JSON mock file
 * Most of validations references are done on this file
 */
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

 const fileName = 'books.json';
 const instance = new Index();

 describe('Read book data', () => {
   it('verifies that JSON file read is valid JSON Array', () => {
     expect(instance.isJSON(testData).length).toBeDefined;
   });
   it('verifies that JSON array is not empty.', () => {
     expect(instance.isJSON(testData).length).toBe(2);
   });

   it('should verify actually a file to be indexed is loaded', () => {
     expect(testData).toBeTruthy();
   });

   it('should ensure that the file content is actually a valid JSON Array', () => {
     expect((testData instanceof Array)).toBeTruthy();
   });

   it('should ensure that each object in JSON array contains a property whose value is a string', () => {
     testData.forEach((element) => {
     expect(typeof element.title === 'string').toBeTruthy();
     expect(typeof element.text === 'string').toBeTruthy();
     });
   });

   it('should ensure the json file is in good format', () => {
     const goodFormat = eval(testData);
     expect(goodFormat).toBeTruthy();
   });
 });

 describe('Populate Index', () => {
   const jsonfile = {
     name: 'testFile',
     files: testData,
   };
   const created = instance.createIndex(jsonfile);
   it('should ensure index is created once JSON file has been read', () => {
     expect(created.message).toBe(`${jsonfile.name} ${' has been indexed successfully.'}`);
   });

   it('ensures created index is correct', () => {
     instance.createIndex(jsonfile);
     const indexCreated = instance.getIndex(jsonfile.name);
     expect(Array.from(indexCreated.a)).toEqual([0, 1]);
   });
 });

 describe('Search index', () => {
   const jsonfile = {
     name: 'testFile',
     files: testData,
   };

   it('should check that search index returns correct results', () => {
     instance.createIndex(jsonfile);
     expect(instance.searchIndex(jsonfile.name, 'alice')).toEqual({ testFile: { alice: [0] } });
     expect(instance.searchIndex(jsonfile.name, 'of')).toEqual({ testFile: { of: [0, 1] } });
     expect(instance.searchIndex(jsonfile.name, 'lord')).toEqual({ testFile: { lord: [1] } });

   });
 });
