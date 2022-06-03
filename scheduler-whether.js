Module.register("scheduler-whether", {
	requiresVersion: "2.12.0",
	default: {
	  apiBase: "http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=",
	  key: "",
	  header: "서울 날씨 정보",
	},

	getHeader: function () {
		return "<i class='fas fa-sun'></i> " + this.config.header;
	},

	start: function () {
	  Log.info("Starting module: " + this.name);
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

		var temp = document.createElement("td");
	 	temp.innerHTML = weather[0].temper;
	 	row.appendChild(temp);

		var avg_temp = document.createElement("td");
		var avg = 0;
		for(i=0; i<weather.length; i++) {
			avg += weather[i].temper;
		}
	 	avg_temp.innerHTML = Math.round(avg/result.length*10)/10;
	 	row.appendChild(avg_temp);

		 wrapper.appendChild(weatherTable);
		 return wrapper;
	},

	getWeatherInfo: function () {
	  Log.info("Requesting weather info");
	  this.sendSocketNotification("GET_WEATHER");
	},

	notificationReceived: function (notification, payload, sender) {
	  switch (notification) {
		case "DOM_OBJECTS_CREATED":
		  this.getWeatherInfo();
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
		case "WEATHER_DATA_ERROR":
		  this.updateDom();
		  break;
	  }
	},
  });
