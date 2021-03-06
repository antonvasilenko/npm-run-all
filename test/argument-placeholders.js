/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("power-assert");
const {result, removeResult} = require("./lib/util");

// Test targets.
const nodeApi = require("../src/lib");
const runAll = require("../src/bin/npm-run-all");
const runSeq = require("../src/bin/run-s");
const runPar = require("../src/bin/run-p");

//------------------------------------------------------------------------------
// Test
//------------------------------------------------------------------------------

describe("[argument-placeholders]", () => {
    before(() => process.chdir("test-workspace"));
    after(() => process.chdir(".."));

    beforeEach(removeResult);

    describe("If arguments preceded by '--' are nothing, '{1}' should be as is:", () => {
        it("Node API", () =>
            nodeApi("test-task:dump {1}")
                .then(() => assert(result() === "[\"{1}\"]"))
        );

        it("npm-run-all command", () =>
            runAll(["test-task:dump {1}"])
                .then(() => assert(result() === "[\"{1}\"]"))
        );

        it("npm-run-all command (only '--' exists)", () =>
            runAll(["test-task:dump {1}", "--"])
                .then(() => assert(result() === "[\"{1}\"]"))
        );

        it("run-s command", () =>
            runSeq(["test-task:dump {1}"])
                .then(() => assert(result() === "[\"{1}\"]"))
        );

        it("run-s command (only '--' exists)", () =>
            runSeq(["test-task:dump {1}", "--"])
                .then(() => assert(result() === "[\"{1}\"]"))
        );

        it("run-p command", () =>
            runPar(["test-task:dump {1}"])
                .then(() => assert(result() === "[\"{1}\"]"))
        );

        it("run-p command (only '--' exists)", () =>
            runPar(["test-task:dump {1}", "--"])
                .then(() => assert(result() === "[\"{1}\"]"))
        );
    });

    describe("'{1}' should be replaced by the 1st argument preceded by '--':", () => {
        it("Node API", () =>
            nodeApi("test-task:dump {1}", {arguments: ["1st", "2nd"]})
                .then(() => assert(result() === "[\"1st\"]"))
        );

        it("npm-run-all command", () =>
            runAll(["test-task:dump {1}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"1st\"]"))
        );

        it("run-s command", () =>
            runSeq(["test-task:dump {1}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"1st\"]"))
        );

        it("run-p command", () =>
            runPar(["test-task:dump {1}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"1st\"]"))
        );
    });

    describe("'{2}' should be replaced by the 2nd argument preceded by '--':", () => {
        it("Node API", () =>
            nodeApi("test-task:dump {2}", {arguments: ["1st", "2nd"]})
                .then(() => assert(result() === "[\"2nd\"]"))
        );

        it("npm-run-all command", () =>
            runAll(["test-task:dump {2}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"2nd\"]"))
        );

        it("run-s command", () =>
            runSeq(["test-task:dump {2}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"2nd\"]"))
        );

        it("run-p command", () =>
            runPar(["test-task:dump {2}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"2nd\"]"))
        );
    });

    describe("'{@}' should be replaced by the every argument preceded by '--':", () => {
        it("Node API", () =>
            nodeApi("test-task:dump {@}", {arguments: ["1st", "2nd"]})
                .then(() => assert(result() === "[\"1st\",\"2nd\"]"))
        );

        it("npm-run-all command", () =>
            runAll(["test-task:dump {@}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"1st\",\"2nd\"]"))
        );

        it("run-s command", () =>
            runSeq(["test-task:dump {@}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"1st\",\"2nd\"]"))
        );

        it("run-p command", () =>
            runPar(["test-task:dump {@}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"1st\",\"2nd\"]"))
        );
    });

    describe("'{*}' should be replaced by the all arguments preceded by '--':", () => {
        it("Node API", () =>
            nodeApi("test-task:dump {*}", {arguments: ["1st", "2nd"]})
                .then(() => assert(result() === "[\"1st 2nd\"]"))
        );

        it("npm-run-all command", () =>
            runAll(["test-task:dump {*}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"1st 2nd\"]"))
        );

        it("run-s command", () =>
            runSeq(["test-task:dump {*}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"1st 2nd\"]"))
        );

        it("run-p command", () =>
            runPar(["test-task:dump {*}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"1st 2nd\"]"))
        );
    });

    describe("Every '{1}', '{2}', '{@}' and '{*}' should be replaced by the arguments preceded by '--':", () => {
        it("Node API", () =>
            nodeApi("test-task:dump {1} {2} {3} {@} {*}", {arguments: ["1st", "2nd"]})
                .then(() => assert(result() === "[\"1st\",\"2nd\",\"{3}\",\"1st\",\"2nd\",\"1st 2nd\"]"))
        );

        it("npm-run-all command", () =>
            runAll(["test-task:dump {1} {2} {3} {@} {*}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"1st\",\"2nd\",\"{3}\",\"1st\",\"2nd\",\"1st 2nd\"]"))
        );

        it("run-s command", () =>
            runSeq(["test-task:dump {1} {2} {3} {@} {*}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"1st\",\"2nd\",\"{3}\",\"1st\",\"2nd\",\"1st 2nd\"]"))
        );

        it("run-p command", () =>
            runPar(["test-task:dump {1} {2} {3} {@} {*}", "--", "1st", "2nd"])
                .then(() => assert(result() === "[\"1st\",\"2nd\",\"{3}\",\"1st\",\"2nd\",\"1st 2nd\"]"))
        );
    });
});
