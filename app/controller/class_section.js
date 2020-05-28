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



