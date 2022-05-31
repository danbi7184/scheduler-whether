Module.register("scheduler-whether", {
	requiresVersion: "2.12.0",
	default: {
	  apiBase: "http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=",
	  key: "",
	  header: "서울 날씨 정보",
	},

	getStyles: function () {
	  return ["scheduler-whether.css"];
	},

	getHeader: function () {
		return "<i class='fas fa-sun'></i> " + this.config.header;
	},

	start: function () {
	  Log.info("Starting module: " + this.name);
	  var self = this;
	  setInterval(function() {
			self.updateDom();
		}, 1000);
	},

	getDom: function () {
	  var wrapper = document.createElement("div");
	  if (!this.loaded) {
		return wrapper;
	  }
		var weatherTable = document.createElement("table");
		weatherTable.className = "small";

		var row = document.createElement("tr");
		weatherTable.appendChild(row);

		var weather = this.weatherInfo;
		var main = this.mainInfo;
		var dt = this.dtInfo;

		var temp = document.createElement("td");
	 	temp.innerHTML = Math.round(parseInt(main.temp) - 273.15) + "°C";
	 	row.appendChild(temp);

		var description = document.createElement("td");
	 	description.innerHTML = weather.description;
	 	row.appendChild(description);

		var time = document.createElement("td");
	 	time.innerHTML = dt;
	 	row.appendChild(time);

		 wrapper.appendChild(weatherTable);
		 return wrapper;
	},

	getWeatherInfo: function () {
	  Log.info("Requesting weather info");
	  this.sendSocketNotification("GET_WEATHER", {
		config: this.config,
		identifier: this.identifier,
	  });
	},

	notificationReceived: function (notification, payload, sender) {
	  switch (notification) {
		case "DOM_OBJECTS_CREATED":
		  this.getWeatherInfo();
		  break;
	  }
	},

	socketNotificationReceived: function (notification, payload) {
	  switch (notification) {
		case "WEATHER_DATA":
		  this.loaded = true;
		  console.log("NotificationReceived:" + notification);
		  this.weatherInfo = payload;
		  this.updateDom();
		  break;
		case "MAIN_DATA":
			this.loaded = true;
			console.log("NotificationReceived:" + notification);
			this.mainInfo = payload;
			this.updateDom();
			break;
		case "DT_DATA":
			this.loaded = true;
			console.log("NotificationReceived:" + notification);
			this.dtInfo = payload;
			this.updateDom();
			break;
		case "WEATHER_DATA_ERROR":
		  this.updateDom();
		  break;
	  }
	},
  });
