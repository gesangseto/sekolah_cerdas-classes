'use strict';

module.exports = function (app) {

    // Kelas Route
    var classes = require('./controller/classes');
    app.route('/classes/kelas')
        .get(classes.ListClass);
    app.route('/classes/kelas/:id')
        .get(classes.GetClassById);
    app.route('/classes/kelas')
        .put(classes.InsertClass);
    app.route('/classes/kelas')
        .post(classes.UpdateClass);
    app.route('/classes/kelas/:id')
        .delete(classes.DeleteClass);



    // Sub Kelas Route
    var sub_class = require('./controller/sub_class');
    app.route('/classes/sub_kelas')
        .get(sub_class.ListSubClass);
    app.route('/classes/sub_kelas/:id')
        .get(sub_class.GetSubClassById);
    app.route('/classes/sub_kelas')
        .put(sub_class.InsertSubClass);
    app.route('/classes/sub_kelas')
        .post(sub_class.UpdateSubClass);
    app.route('/classes/sub_kelas/:id')
        .delete(sub_class.DeleteSubClass);

    // Kelas Sections Route
    var class_section = require('./controller/class_section');
    app.route('/classes/kelas_section')
        .get(class_section.ListClassSection);
    app.route('/classes/kelas_section/:id')
        .get(class_section.GetClassSectionById);
    app.route('/classes/kelas_section')
        .put(class_section.InsertClassSection);
    app.route('/classes/kelas_section')
        .post(class_section.UpdateClassSection);

};