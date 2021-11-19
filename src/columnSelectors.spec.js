const {include} = require("./columnSelectors");

test("include() should return all columns if no spec provided", () => {
    expect(include([])({foo: "bar"})).toEqual({foo: "bar"});
});

test("include() should return numerical columns in order", () => {
    expect(include(["1", "0"])(["a", "b"])).toEqual(["b", "a"]);
});
