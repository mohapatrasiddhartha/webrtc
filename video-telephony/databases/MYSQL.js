module.exports = {
    createDB: function () {
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: ''
        });
        connection.connect(function (error) {
            if (error) {
                return console.log("CONNECTION error: " + error);
            }
            connection.query('CREATE DATABASE IF NOT EXISTS callsupportDB', function (err, result) {
                if (!err) {
                    connection.query('CREATE TABLE IF NOT EXISTS `callsupportDB`.`agentlist` (' +
                            '`AgentId` VARCHAR(100) NOT NULL,' +
                            '`AgentName` VARCHAR(100) NOT NULL,' +
                            '`AgentStatus` VARCHAR(50) NOT NULL,' +
                            '`CallStartTime` VARCHAR(100) NOT NULL,' +
                            '`Password` VARCHAR(150) NOT NULL,' +
                            '`SessionId` VARCHAR(100) NOT NULL,' +
                            '`AgentRole` VARCHAR(100) NOT NULL,' +
                            '`FirstTimeLogin` INT NULL,' +
                            '`Department1` VARCHAR(250) NOT NULL,' +
                            '`Department2` VARCHAR(250) NOT NULL,' +
                            '`Department3` VARCHAR(250) NOT NULL,' +
                            'PRIMARY KEY (`AgentId`));', function (err, result) {
                                connection.query("UPDATE `callsupportDB`.`agentlist` SET SessionId = '' ");


                                connection.query('CREATE TABLE `callsupportDB`.`agentroles` (' +
                                        '`AgentRole` VARCHAR(100) NOT NULL,' +
                                        'PRIMARY KEY (`AgentRole`));', function (err, result) {
                                            if (!err) {
                                                connection.query('SELECT * from `callsupportDB`.agentroles', function (err, rows, fields) {
                                                    console.log(rows);
                                                    if (rows.length == 0) {
                                                        connection.query('INSERT INTO `callsupportDB`.`agentroles` (`AgentRole`) VALUES (\'Agent\')');
                                                    }
                                                    connection.query('CREATE TABLE `callsupportDB`.`admininfo` (' +
                                                            '`AdminName` VARCHAR(100) NOT NULL,' +
                                                            '`Password` VARCHAR(150) NOT NULL,' +
                                                            'PRIMARY KEY (`AdminName`));', function (err, result) {
                                                                if (!err) {
                                                                    connection.query('SELECT * from `callsupportDB`.admininfo', function (err, rows, fields) {
                                                                        if (rows.length == 0) {
                                                                            connection.query('INSERT INTO `callsupportDB`.`admininfo` (`AdminName`, `Password`) VALUES (\'admin\', \'password\')');
                                                                        }

                                                                        //connection.end();
                                                                        connection.query('CREATE TABLE IF NOT EXISTS `callsupportDB`.`callRecordList` (' +
                                                                                '`ID` INT NOT NULL AUTO_INCREMENT,' +
                                                                                '`AgentName` VARCHAR(100) NOT NULL,' +
                                                                                '`CustomerName` VARCHAR(100) NOT NULL,' +
                                                                                '`CallStartTime` VARCHAR(100) NOT NULL,' +
                                                                                '`CallEndTime` VARCHAR(100) NOT NULL,' +
                                                                                '`CallDuration` VARCHAR(150) NOT NULL,' +
                                                                                '`TerminationReason` VARCHAR(100) NOT NULL,' +
                                                                                '`DetailLogs` VARCHAR(500) DEFAULT " ",' +
                                                                                '`ExtraCol1` VARCHAR(100) DEFAULT " ",' +
                                                                                '`ExtraCol2` VARCHAR(100) DEFAULT " ",' +
                                                                                'PRIMARY KEY (`ID`));', function (err, result) {
                                                                                    if (!err) {
                                                                                        connection.query('CREATE TABLE `callsupportDB`.`departments` (' +
                                                                                                '`departments` VARCHAR(250) NOT NULL,' +
                                                                                                'PRIMARY KEY (`departments`));', function (err, result) {
                                                                                                });
                                                                                        connection.end();
                                                                                    } else {
                                                                                        connection.end();
                                                                                    }
                                                                                });
                                                                    });
                                                                } else {
                                                                    connection.end();
                                                                }

                                                            });

                                                });
                                            } else {
                                                connection.end();
                                            }

                                        });

                            });


                    //connection.end();
                } else {
                    connection.end();
                }
            });
        });
    },
    createwebRTCCustomerDB: function (custId) {
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: ''
        });
        connection.connect(function (error) {
            if (error) {
                return console.log("CONNECTION error: " + error);
            }
            connection.query('CREATE DATABASE IF NOT EXISTS callsupportDB' + custId, function (err, result) {
                if (!err) {
                    connection.query('CREATE TABLE IF NOT EXISTS `callsupportDB' + custId + '`.`agentlist` (' +
                            '`AgentId` VARCHAR(100) NOT NULL,' +
                            '`AgentName` VARCHAR(100) NOT NULL,' +
                            '`AgentStatus` VARCHAR(50) NOT NULL,' +
                            '`CallStartTime` VARCHAR(100) NOT NULL,' +
                            '`Password` VARCHAR(150) NOT NULL,' +
                            '`SessionId` VARCHAR(100) NOT NULL,' +
                            '`AgentRole` VARCHAR(100) NOT NULL,' +
                            '`FirstTimeLogin` INT NULL,' +
                            '`Department1` VARCHAR(250) NOT NULL,' +
                            '`Department2` VARCHAR(250) NOT NULL,' +
                            '`Department3` VARCHAR(250) NOT NULL,' +
                            'PRIMARY KEY (`AgentId`));', function (err, result) {
                                connection.query("UPDATE `callsupportDB" + custId + "`.`agentlist` SET SessionId = '' ");


                                connection.query('CREATE TABLE `callsupportDB' + custId + '`.`agentroles` (' +
                                        '`AgentRole` VARCHAR(100) NOT NULL,' +
                                        'PRIMARY KEY (`AgentRole`));', function (err, result) {
                                            if (!err) {
                                                connection.query('SELECT * from `callsupportDB' + custId + '`.agentroles', function (err, rows, fields) {
                                                    console.log(rows);
                                                    if (rows.length == 0) {
                                                        connection.query('INSERT INTO `callsupportDB' + custId + '`.`agentroles` (`AgentRole`) VALUES (\'Agent\')');
                                                    }
                                                    connection.query('CREATE TABLE `callsupportDB' + custId + '`.`admininfo` (' +
                                                            '`AdminName` VARCHAR(100) NOT NULL,' +
                                                            '`Password` VARCHAR(150) NOT NULL,' +
                                                            'PRIMARY KEY (`AdminName`));', function (err, result) {
                                                                if (!err) {
                                                                    connection.query('SELECT * from `callsupportDB' + custId + '`.admininfo', function (err, rows, fields) {
                                                                        if (rows.length == 0) {
                                                                            connection.query('INSERT INTO `callsupportDB' + custId + '`.`admininfo` (`AdminName`, `Password`) VALUES (\'admin\', \'password\')');
                                                                        }

                                                                        //connection.end();
                                                                        connection.query('CREATE TABLE IF NOT EXISTS `callsupportDB' + custId + '`.`callRecordList` (' +
                                                                                '`ID` INT NOT NULL AUTO_INCREMENT,' +
                                                                                '`AgentName` VARCHAR(100) NOT NULL,' +
                                                                                '`CustomerName` VARCHAR(100) NOT NULL,' +
                                                                                '`CallStartTime` VARCHAR(100) NOT NULL,' +
                                                                                '`CallEndTime` VARCHAR(100) NOT NULL,' +
                                                                                '`CallDuration` VARCHAR(150) NOT NULL,' +
                                                                                '`TerminationReason` VARCHAR(100) NOT NULL,' +
                                                                                '`DetailLogs` VARCHAR(500) DEFAULT " ",' +
                                                                                '`ExtraCol1` VARCHAR(100) DEFAULT " ",' +
                                                                                '`ExtraCol2` VARCHAR(100) DEFAULT " ",' +
                                                                                'PRIMARY KEY (`ID`));', function (err, result) {
                                                                                    if (!err) {
                                                                                        connection.query('CREATE TABLE `callsupportDB' + custId + '`.`departments` (' +
                                                                                                '`departments` VARCHAR(250) NOT NULL,' +
                                                                                                'PRIMARY KEY (`departments`));', function (err, result) {
                                                                                                });
                                                                                        connection.end();
                                                                                    } else {
                                                                                        connection.end();
                                                                                    }
                                                                                });
                                                                    });
                                                                } else {
                                                                    connection.end();
                                                                }

                                                            });

                                                });
                                            } else {
                                                connection.end();
                                            }

                                        });

                            });


                    //connection.end();
                } else {
                    connection.end();
                }
            });
        });
    },
    connectDB: function (customerWebValueCode) {
        var mysql = require('mysql');
        console.log('My db Selection is connecting' + customerWebValueCode)
        var connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'callsupportDB' + customerWebValueCode
        });

        connection.connect(function (error) {
            if (error) {
                return console.log("CONNECTION error: " + error);
            }

        });
        return connection;
    },
    fetchDataFromTable: function (conn, table, filter, orderby, callback) {
        //console.log("SELECT * from "+table+" "+filter);
        conn.query("SELECT * from " + table + " " + filter + orderby, function (err, rows, fields) {
            if (!err) {
//                console.log('The solution for MYSQL is: ', rows);
                callback(null, rows);
            }
            else
                callback(err, rows);
        });
        //return conn;
    },
    updateDataToTable: function (conn, table, filter, status, callback) {
        //console.log("UPDATE "+table+" SET "+status+filter);
        conn.query("UPDATE " + table + " SET " + status + filter, function (err, result) {
            if (!err) {
                //console.log('The solution for MYSQL is: ', result);
                callback(null, result);
            }
            else
                callback(err, result);
        });
    },
    insertDatatoTable: function (conn, table, values, callback) {
        //console.log("INSERT into "+table+" VALUES "+values);
        conn.query("INSERT into " + table + " VALUES " + values, function (err, result) {
            if (!err) {
                callback(null, result);
            }
            else
                callback(err, result);
        });
    },
    insertColumnDatatoTable: function (conn, table, columns, values, callback) {
        //console.log("INSERT into "+table+" "+columns+" VALUES "+values);
        conn.query("INSERT into " + table + " " + columns + " VALUES " + values, function (err, result) {
            if (!err) {
                callback(null, result);
            }
            else
                callback(err, result);
        });
    },
    deleteFromTable: function (conn, table, filter, callback) {
        //console.log("DELETE from "+table+" "+filter);
        conn.query("DELETE from " + table + " " + filter, function (err, result) {
            if (!err) {
                callback(null, result);
            }
            else
                callback(err, result);
        });
    },
    endConnection: function (conn) {
        conn.end();
    }
};



