
module.exports = {
    initialize: function () {
        var dbselected = require("./databases/DBconfig.js");
        var obj = require("./databases/" + dbselected.DB_SELECTION);
        console.log("deb selection is"+dbselected.DB_SELECTION)
        return obj;
    },
    connectDB: function (dbobj,customerWebValueCode) {
        console.log("Getting value in DB interface"+customerWebValueCode);
        var status = dbobj.connectDB(customerWebValueCode);
        return status;
    },
    createDataBase: function (dbobj) {
        var db;
    },
    insertDatatoTable: function (dbobj, conn, table, values, callback) {
        var status = dbobj.insertDatatoTable(conn, table, values, callback);
        return status;
    },
    insertColumnDatatoTable: function (dbobj, conn, table, columns, values, callback) {
        var status = dbobj.insertColumnDatatoTable(conn, table, columns, values, callback);
        return status;
    },
    deleteFromTable: function (dbobj, conn, table, filter, callback) {
        var status = dbobj.deleteFromTable(conn, table, filter, callback);
        return status;
    },
    updateDB: function (dbobj) {
    },
    updateDataToTable: function (dbobj, conn, table, filter, status, callback) {
        var status = dbobj.updateDataToTable(conn, table, filter, status, callback);
        return status;
    },
    deleteItem: function (dbobj) {
    },
    selectItem: function (dbobj, rowidentity) {
    },
    fetchDataFromTable: function (dbobj, conn, table, filter, orderby, callback) {
        //console.log("callback is "+callback);
        var status = dbobj.fetchDataFromTable(conn, table, filter, orderby, callback);
        return status;
    },
    endConnection: function (dbobj, conn) {
        var status = dbobj.endConnection(conn);
    },
    createDB: function (dbobj) {
        var status = dbobj.createDB();
    },
    createwebRTCCustomerDB: function(dbobj,custId){
        var status = dbobj.createwebRTCCustomerDB(custId);
    }
};