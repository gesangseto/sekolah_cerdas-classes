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

exports.ListClassSection = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    var sql = `SELECT a.id as class_section_id,a.*,b.class as class,c.section as sub_class, b.id as class_id,c.id as sub_class_id
    FROM class_sections as a
    JOIN classes as b ON a.class_id=b.id
    JOIN sections as c ON a.section_id=c.id`

    if (req.query.class_id != undefined && req.query.sub_class_id != undefined) {
        sql = sql + ' WHERE a.class_id=' + req.query.class_id + ' AND a.section_id=' + req.query.sub_class_id
    } else if (req.query.class_id != undefined) {
        sql = sql + ' WHERE a.class_id=' + req.query.class_id
    } else if (req.query.sub_class_id != undefined) {
        sql = sql + ' WHERE a.section_id=' + req.query.sub_class_id
    }
    sql = sql + ' ORDER BY b.id ASC'
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

exports.GetClassSectionById = function (req, res) {
    perf.start();
    console.log("date-time :" + new Date())
    console.log("api-name : " + req.originalUrl)
    console.log("body-sent : ")
    console.log(req.body)

    var total = 0;
    connection.query(`SELECT a.id as class_section_id,a.*,b.class as class,c.section as sub_class, b.id as class_id,c.id as sub_class_id
    FROM class_sections as a
    JOIN classes as b ON a.class_id=b.id
    JOIN sections as c ON a.section_id=c.id
    WHERE a.id=?
    ORDER BY b.id ASC `, [req.params.id],
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
};




exports.InsertClassSection = function (req, res) {
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



exports.UpdateClassSection = function (req, res) {
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