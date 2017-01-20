// import file
let Index = require("../../public/src/inverted-index.js");
/**
 * Test data that will used in testing.It is like a JSON mock file
 * Most of validations references are done on this file
 */
const testData =  [
  {
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination ring."
  },

  {
    "title": "The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  }
];

let filename = "books.json";
const obj = new Index();
describe("Read book data", () => {
  it("verifies that JSON file passed is not empty",  () => {
    expect(testData.length > 0).toBeTruthy();
  }); 
  it("should verify actually a file to be indexed is loaded" ,  () => {
    expect(testData).toBeTruthy();
  });
  it("should ensure that the file content is actually a valid JSON Array" ,   () => {
    expect((testData instanceof Array)).toBeTruthy();
  });
  it("should ensure that each object in JSON array contains a property whose value is a string" ,  () => {
    testData.forEach((element) =>{
    expect(typeof element.title === "string").toBeTruthy();
    expect(typeof element.text  === "string").toBeTruthy();
    });
  }); 
  it("should ensure the json file is in good format" ,  () => {
    let goodFormat = eval(testData);
    expect(goodFormat).toBeTruthy();
  });
});
// Populate Index test suite
describe("Populate Index" , () => {  
  it("should ensure index is created once JSON file has been read",  () => {
        // file object 
    let jsonfile = {
      name: "testFile",
      files: testData[0]
    };     
    let created = obj.createIndex(jsonfile);
    expect(created.message).toBe(jsonfile.name + " has been indexed successfully.")
  });
});
describe("Check existence" , () => {
  it("should check that searchIndex method exists" , () => {
    let searchy = obj.searchIndex();
    expect(searchy).toBeTruthy();
  });
  it("should check that getIndex method exists" , () => {    
    let gety = obj.getIndex();
    expect(gety).toBeTruthy();
  });
}); 
// Search index test suite
// I have used a custom jasmine matcher
describe("Search index" , () => {
  beforeEach(() => {
    let hits = []; // initialize an empty array that will hold search hits
    jasmine.addMatchers({
      toHaveSomething: () =>{
        hits.length >0;
      }
    });
  });
  it("test that verifies that searching the index returns an array of the indices.", () =>{
        
    let hitz = obj.searchIndex(testData);
    expect(hitz).toHaveSomething;
  });    
});