//Test data that will used in testing.It is like a JSON mock file
var testData =  [
  {
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
  },

  {
    "title": "The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  }
]

//Test suite that read the JSON file containing book data
describe("Read book data", function() {
    
    // Test spec one that verifies file is not empty
    it("verifies that JSON file passed is not empty", function() {
        expect(testData.length > 0).toBeTruthy();
    }); 
});