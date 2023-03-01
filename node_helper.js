const NodeHelper = require("node_helper");
const request = require("request");
const mysql = require('mysql');

const db = mysql.createConnection({
	host: '',
	port: ,
	user: '',
	password: '',
	database: ''
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
        db.query("select temper from temperature order by temRank DESC", function (error, result) {
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
