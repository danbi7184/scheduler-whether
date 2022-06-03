const NodeHelper = require("node_helper");
const request = require("request");
const mysql = require("mysql");

const conn = mysql.createConnection({
  host: '119.194.240.110',
  port: 33060,
  user: 'tlsl13',
  password: '1234',
  database: 'DBtest'
});

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node helper: " + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "GET_WEATHER":
        conn.connect();
        conn.query('SELECT temper FROM temperature', function (error, results) {
          if (error) {
            console.log(error);
          }
          else {
            console.log(results);
            this.sendSocketNotification("WEATHER_DATA", results);
          }
        });
        conn.end();
    }
  },
});
