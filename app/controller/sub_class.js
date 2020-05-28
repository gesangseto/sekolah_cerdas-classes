'use strict';

var response = require('../response');
var connection = require('../connection');


const perf = require('execution-time')();
var dateFormat = require('dateformat');
var datetime = require('node-datetime');

var dt = datetime.create();
var status_code = "";
var messages = "";
var elapseTime = "";

exports.ListSubClass = function (req, res) {
    perf.start();
    var total = 0;
    var sql = `SELECT * FROM sections`
    console.log(sql)
    connection.query(sql, function (error, result, fields) {
        if (error) {
            messages = "Internal server error";
            elapseTime = perf.stop();
            elapseTime = elapseTime.time.toFixed(2);
            response.errorRes(elapseTime, messages, res);
        } else {
            result.forEach(element => {
                total = total + 1;
            })
            messages = "Success";
            elapseTime = perf.stop();
            elapseTime = elapseTime.time.toFixed(2);
            response.successGet(elapseTime, messages, total, result, res);
        }
    });
};

exports.GetSubClassById = function (req, res) {
    perf.start();
    var total = 0;
    connection.query("SELECT session_id FROM `sch_settings` ;",
        function (error, result, fields) {
            var session_id = result[0]['session_id']

            connection.query("SELECT * FROM sections WHERE id=?", [req.params.id],
                function (error, result, fields) {
                    if (error) {
                        messages = "Internal server error";
                        elapseTime = perf.stop();
                        elapseTime = elapseTime.time.toFixed(2);
                        response.errorRes(elapseTime, messages, res);
                    } else {
                        result.forEach(element => {
                            total = total + 1;
                        })
                        messages = "Success";
                        elapseTime = perf.stop();
                        elapseTime = elapseTime.time.toFixed(2);
                        response.successGet(elapseTime, messages, total, result, res);
                    }
                });
        });
};

exports.InsertSubClass = function (req, res) {
    perf.start();
    var total = 0;
    var body = req.body
    var values = []
    var keys = []
    for (let value of Object.values(body)) {
        values.push("'" + value + "'"); // John, then 30
    }
    for (let key in body) {
        keys.push(key); // John, then 30
    }
    connection.query("SELECT * FROM sections WHERE section=?", [req.body.section],
        function (error, result, fields) {
            result.forEach(element => {
                total = total + 1;
            })
            if (error) {
                messages = "Internal server error";
                elapseTime = perf.stop();
                elapseTime = elapseTime.time.toFixed(2);
                response.errorRes(elapseTime, messages, res);
            } else if (total > 0) {
                messages = "Failed, Duplicate section";
                elapseTime = perf.stop();
                elapseTime = elapseTime.time.toFixed(2);
                response.successPost(elapseTime, messages, res);
            } else {
                var sql = `INSERT INTO sections (` + keys + `) VALUES (` + values + `)`;
                connection.query(sql, function (error, result, fields) {
                    messages = "Success Insert";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.successPost(elapseTime, messages, res);
                })

            }
        });
};



exports.UpdateSubClass = function (req, res) {
    perf.start();
    var total = 0;
    var body = req.body
    var values = []
    var keys = []
    var data = []
    for (let value of Object.values(body)) {
        values.push("'" + value + "'"); // John, then 30
    }
    for (let key in body) {
        keys.push(key); // John, then 30
    }
    var i;
    for (i in keys) {
        data.push(keys[i] + '=' + values[i])
    }
    var myJSON = JSON.stringify(data);
    myJSON = myJSON.replace(/["]/g, '');
    myJSON = myJSON.replace('[', '');
    myJSON = myJSON.replace(']', '');
    connection.query("SELECT * FROM sections WHERE section=? AND id !=?", [req.body.section, req.body.id],
        function (error, result, fields) {
            result.forEach(element => {
                total = total + 1;
            })
            if (error) {
                messages = "Internal server error";
                elapseTime = perf.stop();
                elapseTime = elapseTime.time.toFixed(2);
                response.errorRes(elapseTime, messages, res);
            } else if (total > 0) {
                messages = "Failed, Duplicate section";
                elapseTime = perf.stop();
                elapseTime = elapseTime.time.toFixed(2);
                response.successPost(elapseTime, messages, res);
            } else {
                var sql = `UPDATE sections SET ` + myJSON + ` WHERE id=` + body.id;
                connection.query(sql, function (error, result, fields) {
                    messages = "Success Update";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.successPost(elapseTime, messages, res);
                })

            }
        });
};
exports.DeleteSubClass = function (req, res) {
    perf.start();
    var total = 0;
    var id = req.params.id
    connection.query("DELETE FROM sections WHERE id=?", [id], function (error, result, fields) {
        messages = "Success Delete";
        elapseTime = perf.stop();
        elapseTime = elapseTime.time.toFixed(2);
        response.successPost(elapseTime, messages, res);
    })


};