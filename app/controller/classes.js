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

exports.ListClass = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    connection.query("SELECT session_id FROM `sch_settings` ;",
        function (error, result, fields) {
            var session_id = result[0]['session_id']

            connection.query("SELECT * FROM classes", function (error, result, fields) {
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

exports.GetClassById = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    connection.query("SELECT session_id FROM `sch_settings` ;",
        function (error, result, fields) {
            var session_id = result[0]['session_id']

            connection.query("SELECT * FROM classes WHERE id=?", [req.params.id],
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



exports.InsertClass = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    if (req.body['class'] == undefined || req.body.data == undefined) {
        messages = "Failed insert data, data must fill";
        elapseTime = perf.stop();
        elapseTime = elapseTime.time.toFixed(2);
        response.successPost(elapseTime, messages, res);
    } else {
        connection.query("SELECT count(id) as count FROM classes WHERE class=?", [req.body['class']],
            function (error, result, fields) {
                if (result[0].count > 0) {
                    messages = "Failed insert data, class already exists";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.successPost(elapseTime, messages, res);
                    return;
                } else {
                    connection.query("SELECT MAX(id) as id FROM classes",
                        function (error, result, fields) {
                            var class_id = result[0]['id'] + 1
                            connection.query("INSERT INTO classes (`id`,`class`) VALUES (?,?)", [class_id, req.body['class']],
                                function (error, result, fields) {
                                    req.body.data.forEach(element => {
                                        connection.query("INSERT INTO `class_sections`(`id`, `class_id`, `section_id`) SELECT MAX(id) + 1,?,? FROM class_sections",
                                            [class_id, element.section_id],
                                            function (error, result, fields) {
                                                messages = "Success Update data";
                                                // console.log(messages)
                                            });

                                    });
                                });

                        });
                    messages = "Success insert class";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.successPost(elapseTime, messages, res);
                    return;
                }
            });

    }
};



exports.UpdateClass = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    if (req.body['class_id'] == undefined || req.body['class'] == undefined || req.body.data == undefined) {
        messages = "Failed insert data, data must fill";
        elapseTime = perf.stop();
        elapseTime = elapseTime.time.toFixed(2);
        response.successPost(elapseTime, messages, res);
    } else {
        connection.query("SELECT count(id) as count FROM classes WHERE class=? AND id!=?", [req.body['class'], req.body['class_id']],
            function (error, result, fields) {
                if (result[0].count > 0) {
                    messages = "Failed insert data, class already exists";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.successPost(elapseTime, messages, res);
                    return
                } else {
                    connection.query("UPDATE `classes` SET `class`=? WHERE id=?", [req.body['class'], req.body['class_id']],
                        function (error, result, fields) {
                        });
                    req.body.data.forEach(element => {
                        connection.query("DELETE FROM `class_sections` WHERE class_id=? AND section_id=?", [req.body['class_id'], element['section_id']],
                            function (error, result, fields) {
                                connection.query("INSERT INTO`class_sections`(`id`, `class_id`, `section_id`) SELECT MAX(id) + 1,?,? FROM class_sections",
                                    [req.body.class_id, element.section_id],
                                    function (error, result, fields) {
                                        messages = "Success Update data";
                                        // console.log(messages)
                                    });
                            });
                    });
                    messages = "Success Update data";
                    elapseTime = perf.stop();
                    elapseTime = elapseTime.time.toFixed(2);
                    response.successPost(elapseTime, messages, res);
                }
            });

    }
};
exports.DeleteClass = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    var id = req.params.id
    connection.query("DELETE FROM classes WHERE id=?", [id], function (error, result, fields) {
        messages = "Success Delete";
        elapseTime = perf.stop();
        elapseTime = elapseTime.time.toFixed(2);
        response.successPost(elapseTime, messages, res);
    })


};