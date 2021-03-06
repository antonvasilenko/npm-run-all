/**
 * @module run-tasks-in-sequencial
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Promise = require("pinkie-promise");
const NpmRunAllError = require("./npm-run-all-error");
const runTask = require("./run-task");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Run npm-scripts of given names in sequencial.
 *
 * If a npm-script exited with a non-zero code, this aborts subsequent npm-scripts.
 *
 * @param {string} tasks - A list of npm-script name to run in sequencial.
 * @param {object} options - An option object.
 * @returns {Promise} A promise object which becomes fullfilled when all npm-scripts are completed.
 * @private
 */
module.exports = function runTasksInSequencial(tasks, options) {
    const results = tasks.map(task => ({name: task, code: undefined}));
    let errorResult = null;
    let index = 0;

    /**
     * Saves a given result and checks the result code.
     *
     * @param {{task: string, code: number}} result - The result item.
     * @returns {void}
     */
    function postprocess(result) {
        if (result == null) {
            return;
        }
        results[index++].code = result.code;

        if (result.code) {
            if (options.continueOnError) {
                errorResult = errorResult || result;
            }
            else {
                throw new NpmRunAllError(result, results);
            }
        }
    }

    return tasks
        .reduce(
            (prev, task) => (
                prev.then(result => ((
                    postprocess(result),
                    runTask(task, options)
                )))
            ),
            Promise.resolve(null)
        )
        .then(result => {
            postprocess(result);

            if (errorResult != null) {
                throw new NpmRunAllError(errorResult, results);
            }
            return results;
        });
};
