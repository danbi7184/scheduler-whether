const NodeHelper = require("node_helper");
const request = require("request");
const mysql = require("mysql");
const conn = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'abcd12345',
  database: 'tempDB'
};

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node helper: " + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "GET_WEATHER":
        let self = this;
        self.getData(payload);
        break;
    }
  },

  getData: async function (payload) {
    let self = this;
    var url = payload.config.apiBase + payload.config.key;
    request({
        url: url,
        method: "GET"
      }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var data = JSON.parse(body);
          if(data.hasOwnProperty("weather")) {
              var weather = data.weather[0];
              self.sendSocketNotification("WEATHER_DATA", weather);
              var main = data.main;
              self.sendSocketNotification("MAIN_DATA", main);
              var dt = data.dt;
              self.sendSocketNotification("DT_DATA", dt);
          } else {
              self.sendSocketNotification("WEATHER_DATA_ERROR", data);
          }
        }
      });
  },

  setDateBase: function() {
    var connection = mysql.createConnection(conn);
    connection.connect();

    var Query = "INSERT INTO ";
  }
});
