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
 const instance = new Index();

 describe('Read Book Data', () => {
   it('verifies that the JSON file read is a valid JSON Array', () => {
     expect(instance.isJSON(testData).length).toBeDefined;
   });

   it('verifies that JSON array is not empty.', () => {
     expect(instance.isJSON(testData).length).toBe(2);
   });

   it('should ensure that each object in JSON array contains a property whose value is a string', () => {
     testData.forEach((element) => {
     expect(typeof element.title === 'string').toBeTruthy();
     expect(typeof element.text === 'string').toBeTruthy();
     });
   });
 });

 describe('Populate Index', () => {
   const jsonfile = {
     name: 'testFile',
     files: testData,
   };

   const created = instance.createIndex(jsonfile.name, jsonfile.files);
   it('should ensure index is created once JSON file has been read', () => {
     expect(created.message).toBe(`${jsonfile.name} ${' has been indexed successfully.'}`);
   });

   it('ensures created index is correct', () => {
     instance.createIndex(jsonfile.name, jsonfile.files);
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
     instance.createIndex(jsonfile.name, jsonfile.files);
     expect(instance.searchIndex(jsonfile.name, 'alice')).toEqual({ testFile: { alice: [0] } });
     expect(instance.searchIndex(jsonfile.name, 'of')).toEqual({ testFile: { of: [0, 1] } });
     expect(instance.searchIndex(jsonfile.name, 'lord')).toEqual({ testFile: { lord: [1] } });
   });
 });
