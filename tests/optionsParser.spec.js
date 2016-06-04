const p = require("../optionsParser");

describe("optionsParser", function () {
    it("should return suitable defaults for missing values", function () {
        const result = p(["node", "script.js"]);

        expect(result.inputFile).toEqual(null);
        expect(typeof result.inputStream).toEqual("object");
        expect(result.cols).toEqual([]);
        expect(result.excludes).toEqual([]);
        expect(result.delimiter).toEqual(",");
        expect(result.headersIn).toEqual(true);
        expect(result.headersOut).toEqual(false);
        expect(result.help).toEqual(false);
        expect(typeof result.helpText).toEqual("string");
        expect(result.version).toEqual(false);
    });

    it("should return multiple columns if given", function () {
        const result = p(["node", "script.js", "--col", "abc", "--col", "def"]);

        expect(result.cols).toEqual(["abc", "def"]);
    });

    it("should return multiple excludes if given", function () {
        const result = p(["node", "script.js", "--exclude", "abc", "--exclude", "def"]);

        expect(result.excludes).toEqual(["abc", "def"]);
    });

    it("should return false for headers in if option passed", function () {
        const result = p(["node", "script.js", "--no-headers"]);

        expect(result.headersIn).toEqual(false);
    });

    it("should respect shorthand options", function () {
        const result = p(["node", "script.js", "-nhd.", "-c", "0", "-c", "1"]);

        expect(result.cols).toEqual(["0", "1"]);
        expect(result.excludes).toEqual([]);
        expect(result.delimiter).toEqual(".");
        expect(result.headersIn).toEqual(false);
        expect(result.headersOut).toEqual(true);
    });
});
