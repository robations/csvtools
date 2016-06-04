var Jasmine = require("jasmine");
var jas = new Jasmine();

jas.loadConfig(
    {
        spec_dir: "tests/",
        spec_files: [
            "**/*.spec.js"
        ],
        helpers: [
            "helpers/**/*.js"
        ]
    }
);

jas.execute();

