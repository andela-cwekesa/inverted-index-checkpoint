// Test data that will used in testing.It is like a JSON mock file
// Most of validations references are done on this file
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

// Read book data Test suite that read the JSON file containing book data
describe("Read book data", function() {
    
    // Test spec one that verifies file is not empty
    it("verifies that JSON file passed is not empty", function() {
        expect(testData.length > 0).toBeTruthy();
    }); 
     
     // Test spec to ensure a file is actually loaded before indexed
    it("should verify actually a file to be indexed is loaded" , function() {
        expect(testData).toBeTruthy();
    });
    // Test spec to verify the content in file is array
    it("should ensure that the file content is actually a valid JSON Array" , function () {
        expect(Array.isArray(testData)).toBeTruthy();
    });
    // Test spec that ensures file contains only string
    it("should ensure that each object in JSON array contains a property whose value is a string" , function() {
    	testData.forEach(function(element){
    		expect(typeof element.title === "string").toBeTruthy();
    		expect(typeof element.text === "string").toBeTruthy();
    	});
    });

    // Test spec to check the json file is in good json format
    it("should ensure the json file is in good format" , function() {
        var json = eval(testData);
        expect(json).toBeTruthy();
    });
});

// Populate Index test suite
describe("Populate Index" , function() {

    // Test spec that ensures index is created once JSON file has been read.
    it("should ensure index is created once JSON file has been read", function () {

        // file object 
        var jsonfile = {
            name: "testFile",
            files: testData[0]
        };
        var obj = new Index();
         //console.log(getIndex);
        var created = obj.createIndex(jsonfile);

        expect(created.message).toBe(jsonfile.name + " has been indexed successfully.")
    });

    it("should ensure that the file passed is not empty" , function  () {
        var jsonfile = {
            name: "testFile",
            files: ""
        };
        var obj = new Index();
        var created = obj.createIndex(jsonfile);
        expect(created.status).toBeFalsy();
        expect(created.message).toBe(jsonfile.name + "is empty!")
    });

    /*it('checks if string keys map to the correct object in the object array', function () {
      var jsonfile = {
        name: "testFile",
        files:testData
      };
      var obj = new Index() ,
      path = '/jasmine/books.json';
      var created = obj.createIndex(jsonfile);
      expect(created.container.alice).toEqual([0]);
      expect(created.container.rings).toEqual([1]);
      expect(created.container.a).toEqual([0, 1]);
    });*/

    /*it("should ensure a json file only is uploaded" , function () {
        var jsonfile = {
            name : "testFile" ,
            files: "json"
        };
        var obj = new Index();
        var created = obj.createIndex(jsonfile);
        expect(created.status).toBeFalsy();
        expect(created.message).toBe(jsonfile.name + "is not a json file!")
    });*/
});

describe("Check existence" , function() {

    // Test spec to check as to whether createIndex method exist
   /* it("should check createIndex method exists" , function() {
        // console.log(Index)
        var obj = new Index();
        var indexy = obj.createIndex();
        expect(indexy).toBeTruthy();
    }); */

    // Test spec to check as to whether searchIndex method exist
    it("should check that searchIndex method exists" , function() {
        var obj = new Index();
        var searchy = obj.searchIndex();
        expect(searchy).toBeTruthy();
        console.log(searchy)
    });

    // Test spec to check as to whether getIndex method exist
    it("should check that getIndex method exists" , function() {
        var obj = new Index();
        var gety = obj.getIndex();
        expect(gety).toBeTruthy();
    });
}); 


// Search index test suite
// I have used a custom jasmine matcher
describe("Search index" , function() {
    beforeEach(function() {
        var hits = []; // initialize an empty array that will hold search hits
        jasmine.addMatchers({
        toHaveSomething:function(){
            hits.length >0;
        }
    })
    });

    it("test that verifies that searching the index returns an array of the indices.", function(){
        // hitz = searchIndex(testData);
        // expect(hits.length > 0).toContain("Lord")
        var obj = new Index()
        hitz = obj.searchIndex(testData);
        expect(hitz).toHaveSomething;
    });
    
});