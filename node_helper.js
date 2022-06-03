const NodeHelper = require("node_helper");
const request = require("request");
const mysql = require('mysql');

const db = mysql.createConnection({
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
    let self = this;
    switch (notification) {
      case "GET_WEATHER":
        db.connect();
        db.query("select temper from temperature", function (error, result) {
          if (error) {
            console.log(error);
          }
          else {
            self.sendSocketNotification("WEATHER_DATA", result);
          }
        });
        db.end();
    }
  },
});
