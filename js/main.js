    /* 
     * To change this license header, choose License Headers in Project Properties.
     * To change this template file, choose Tools | Templates
     * and open the template in the editor.
     */

    /* global firebase, google */

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBrc2AqSAQNuaOZQeq3DtaUIXDRTPQ7N4w",
        authDomain: "skycastweather-fad3c.firebaseapp.com",
        databaseURL: "https://skycastweather-fad3c.firebaseio.com",
        projectId: "skycastweather-fad3c",
        storageBucket: "",
        messagingSenderId: "628464814491"
    };

    firebase.initializeApp(config);

    //get elements
    var myWeatherPage = document.getElementById('current_weather_container');
    myWeatherPage.style.visibility = 'hidden';
    var myChartPage = document.getElementById('my_chart_container');
    myChartPage.style.visibility = 'hidden';

    var getWeatherButton = document.getElementById('getweatherbtn');
    var latitude;
    var longitude;
    var apikey = "9ad876c22f9b4a620b70653a24622eb7";

    var cityName;
    var tempature = document.getElementById('tempature');
    var today_high_tempature = document.getElementById('current_high_temp');
    var today_low_tempature = document.getElementById('current_low_temp');
    var current_summary = document.getElementById('sumamry');
    var precipitation = document.getElementById('current_precipitation');
    var windSpeed = document.getElementById('wind_speed');
    var humidity = document.getElementById('humidity');
    var uvIndex = document.getElementById('uvIndex');


    this.refreshWindow();

    var currentUser;
    //user object with weather details
    //var user = {email: currentUser.email,
    //get weater from input 
    //trigger enter key to click get weather button
    var address = document.getElementById('address');

    $(address).keypress(function(e) {
        if (e.which == 13) {
            $(getWeatherButton).click();   
        }
    });
    getWeatherButton.addEventListener("click", function () {

        if (address.value.length === 0) {
            alert("please input city!!!");
        } else {
    //      skycons.remove(document.getElementById("weather_icon"));
            getLatLng(showResult, address.value);
        }
    });

    //get Lat and Lng for darksky api and current location geocoding api
    function getLatLng(callback, address) {

        var geocoder = new google.maps.Geocoder();

        if (geocoder) {
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    callback(results[0]);
                } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    Thread.sleep(5000);
                    return getLatLng(showResult, address.value);
                } else {
                    window.alert(status);
                }
            });
        }

    };


    //parsing DarkSky api
    function showResult(result) {
    //    document.getElementById('latitude').value = result.geometry.location.lat();
    //    document.getElementById('longitude').value = result.geometry.location.lng();
        latitude = result.geometry.location.lat();
        longitude = result.geometry.location.lng();
        // console.log("lat: "+ latitude);
        // console.log("lng: " + longitude);
        var url = "https://api.darksky.net/forecast/" + apikey + "/" + latitude + "," + longitude;
        // console.log(url);
        displayLocation(latitude, longitude);
        //parsing JSON from url
        weatherReport(url);
    };

    //getting current location on start
    showCurrentLocation();

    //get weather from current location
    var currentLocationBtn = document.getElementById('getcurrentlocationbtn');
    currentLocationBtn.addEventListener("click", function () {
        showCurrentLocation();
    });

    function showCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");        
        }
    };
    
    //get lat lng from current location for url api
    function showPosition(result) {
        latitude = result.coords.latitude;
        longitude = result.coords.longitude;
        // console.log(latitude + " " + longitude);
        displayLocation(latitude, longitude);
        var url = "https://api.darksky.net/forecast/" + apikey + "/" + latitude + "," + longitude;
        weatherReport(url);
    };

    //get current user signed in
    var firebaseRef = firebase.database().ref();
    var current_email = document.getElementById('myEmail');

    function refreshWindow() {
        firebase.auth().onAuthStateChanged(function (user) {

            if (user) {
                // User is signed in.
                currentUser = firebase.auth().currentUser;
                //console.log(currentUser.email);
                current_email.innerHTML = currentUser.email;

                //retrieve data from firebase
                var userId = currentUser.uid;
                var firebaseHeadingRef = firebaseRef.child(userId);
                firebaseHeadingRef.on('value', gotData, errData);

            } else {
                // No user is signed in.
                alert("signing out...");
            }
        });
    };
    

    //successfully retrieving user info
    //set location = -1 (none saved), it will be changed if the current user got location record save
    //the first id will be 0 for the first location saved
    var locationID = -1;
    var locations, histories;
    function gotData(data) {

        if (data.val() !== null) {
            //console.log(data.val());
            histories = data.val();
            locations = Object.keys(histories);
    //        console.log(locations);

            //loops to retrieve each saved location
            locationID = locations.length - 1;
            for (var i = 0; i < locations.length; i++) {
                var locKey = locations[i];
                // console.log(locKey);
                var location = histories[locKey].location;
                // console.log(location);
                var list = document.getElementById('location_list');
                var entry = document.createElement('li');
                entry.appendChild(document.createTextNode(location));
                var removeButton = document.createElement('button');
                removeButton.style.width = '50px';
                removeButton.style.background = 'red';
                removeButton.style.color = 'white';
                removeButton.appendChild(document.createTextNode("X"));
                removeButton.setAttribute('onClick','removeLocation('+i+')');
                entry.appendChild(removeButton);
                list.appendChild(entry);  
            }

        }
    };

    //get current address from lat lng
    function displayLocation(lat, lng) {
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);
        var currentCity;

        geocoder.geocode(
                {'latLng': latlng},
                function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            var add = results[0].formatted_address;
    //                    console.log(add);
                            var value = add.split(",");

                            count = value.length;
                            country = value[count - 1];
                            state = value[count - 2];
                            city = value[count - 3];
                            currentCity = city + ", " + state;
                            cityName = document.getElementById('city_name').innerHTML
                                    = (city + ", " + state).toUpperCase();
    //                    alert(currentCity.toUpperCase());
    //                    document.getElementById('city_name').innerHTML = currentCity.toUpperCase();
                        } else {
                            alert("address not found");
                        }
                    } else {
                        alert(status);
                    }
                }
        );
    };


    //remove location object from firebase for click event
    function removeLocation(keyId) {
                
        // console.log(keyId);
        var userId = currentUser.uid;
        var firebaseHeadingRef = firebaseRef.child(userId);
        
        var con = confirm("Delete this location?");
        if (con == true) {
            if (locations.length <= 1) {
                firebaseHeadingRef.orderByChild('id').equalTo(keyId).once('value', function(snapshot) {
                    var updates = {};
                    snapshot.forEach(function(child) {
                        updates[child.key] = null;
                    });
                    firebaseHeadingRef.update(updates);
                });
            } else {
                firebaseHeadingRef.orderByChild('id').equalTo(keyId).once('value', function(snapshot) {
                    var updates = {};
                    snapshot.forEach(function(child) {
                        updates[child.key] = null;
                    });
                    firebaseHeadingRef.update(updates);
                });
                // update firebase location of each item id after the location removed
                for (var i = keyId; i < locations.length; i++) {
                    firebaseHeadingRef.child(locations[i]).update({
                        id: i
                    }); 
                    // console.log(i);    
                }
            }
        } else {
            return;
        }
        
        //clear ul li
        var list = document.getElementById('location_list');
        if (list) {
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
        }
        // re-render the list of location
        refreshWindow();
    };

    //retrieving user info error
    function errData(error) {
        alert(error);
        console.log(error);
    };

    //sign out
    var signoutButton = document.getElementById('signoutbtn');
    signoutButton.addEventListener("click", function () {
        firebase.auth().signOut().then(function () {
            document.location.href = "../index.html";
            return;
        }).catch(function (error) {
            if (error !== null) {
                alert(error.message());
                return;
            }

        });
    });

    //add current weather to a specific user
    var addButton = document.getElementById('addweatherbtn');
    addButton.addEventListener("click", function () {

    //    console.log(currentUser.email);
        var location = $.trim(cityName);
    //    console.log(location);

        //add data to firebase of current user
        var userId = currentUser.uid;
        //reload location list to prevent duplicates
    //    console.log(userId);

        //increment location id when add a new one
        locationID++;   
        // console.log(locationID);
        firebaseRef.child(userId).push().set({
            id: locationID,
            location: location
        }, function (error) {
            if (error) {
                alert("record cannot be saved!");
            } else {
                //reload
                alert("This record has been saved to firebase!");
            }
        });

        //clear ul li
        var list = document.getElementById('location_list');
        if (list) {
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
        }
        // re-render the list of location
        refreshWindow();
    });

    //parsing darksky api for weather report and added CORS feature detection
    function weatherReport(url) {
        // Feature detection for CORS
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: function (forecast) {
                var currentSummary = forecast.currently.summary;
                var currentTemp = forecast.currently.temperature;
                var currentTime = forecast.currently.time;
                var currentPrec = forecast.currently.precipIntensity;
                var currentWind = forecast.currently.windSpeed;
                var currentHum = forecast.currently.humidity;
                var currentUvIndex = forecast.currently.uvIndex;
                var skyicons = forecast.currently.icon;
                showMySkycons(skyicons);

                //convert timestamp to date
                var date = new Date(currentTime * 1000);
                var dateString = date.toDateString().toUpperCase();
                date_time = dateString;
                document.getElementById('date_time').innerHTML
                        = dateString.bold();

                //get current tempature and details
                precipitation.innerHTML = parseInt(currentPrec) + '%';
                tempature.innerHTML = parseInt(currentTemp);
                current_summary.innerHTML = currentSummary.toUpperCase().bold();
                windSpeed.innerHTML = parseInt(currentWind) + " mph";
                humidity.innerHTML = parseInt(currentHum * 100) + "%";
                uvIndex.innerHTML = currentUvIndex;

                //retrieve high and low temp of the day
                var currentHighTemp = forecast.daily.data[0].temperatureMax;
                today_high_tempature.innerHTML = parseInt(currentHighTemp);
                var currentLowTemp = forecast.daily.data[0].temperatureMin;
                today_low_tempature.innerHTML = parseInt(currentLowTemp);

                // $(".temp_container .btn-group[role='group']").on('click', function() {
                //     $(this).siblings().removeClass('active')
                //     $(this).addClass('active');
                // });
                //button show C degree
                var CButton = document.getElementById('show_C');
                var FButton = document.getElementById('show_F');
                $(".btn").click(function() {
                    $(document).find(".btn").removeClass("active");
                    $(this).addClass("active");
                });
                CButton.addEventListener('click', function() {
                    tempature.innerHTML = convertFToC(parseInt(currentTemp));
                    today_high_tempature.innerHTML = convertFToC(parseInt(currentHighTemp));
                    today_low_tempature.innerHTML = convertFToC(parseInt(currentLowTemp));
                });

                //button show F degree
                FButton.addEventListener('click', function() {
                    tempature.innerHTML = parseInt(currentTemp);
                    today_high_tempature.innerHTML = parseInt(currentHighTemp);
                    today_low_tempature.innerHTML = parseInt(currentLowTemp);
                });

                //get hourly weather report
                getHourlyWeatherReport(forecast);
                //get weekly weather report
                getWeeklyWeatherReport(forecast);

                myWeatherPage.style.visibility = 'visible';
                myChartPage.style.visibility = 'visible';
              
            }
        });
    };

    function convertFToC(temp) {
        var mytemp = ((temp - 32) * 5 /  9);
        return Math.round(mytemp);
    };

    //show skycons: source : https://github.com/darkskyapp/skycons
    function showMySkycons(skyicons) {
        var icons = new Skycons();
        var myIcon = document.getElementById('weather_icon');
        //console.log(skyicons);
        switch (skyicons) {
            case "clear-day":
                icons.set(myIcon, Skycons.CLEAR_DAY);
                break;
            case "clear-night":
                icons.set(myIcon, Skycons.CLEAR_NIGHT);  
                break;  
            case "partly-cloudy-day":
                icons.set(myIcon, Skycons.PARTLY_CLOUDY_DAY); 
                break;   
            case "partly-cloudy-night":
                icons.set(myIcon, Skycons.PARTLY_CLOUDY_NIGHT); 
                break; 
            case "cloudy":
                icons.set(myIcon, Skycons.CLOUDY); 
                break;
            case "rain":
                icons.set(myIcon, Skycons.RAIN); 
                break;
            case "sleet":
                icons.set(myIcon, Skycons.SLEET); 
                break;
            case "snow":
                icons.set(myIcon, Skycons.SNOW); 
                break;
            case "wind":
                icons.set(myIcon, Skycons.WIND); 
                break;
            default:
                icons.set(myIcon, Skycons.FOG); 
        }

        icons.play();
    };

    //show weekly report to the window
    function getWeeklyWeatherReport(forecast) {

        var weeklyReport = document.getElementById('weekly_report');
        var day1 = document.getElementById('box1_day');
        var day2 = document.getElementById('box2_day');
        var day3 = document.getElementById('box3_day');
        var day4 = document.getElementById('box4_day');
        var day5 = document.getElementById('box5_day');
        var day6 = document.getElementById('box6_day');
        var nextDays = [day1, day2, day3, day4, day5, day6];

        var report = forecast.daily.summary;
        weeklyReport.innerHTML = report.toString();

        var summary1 = document.getElementById('daily_summary1');
        var summary2 = document.getElementById('daily_summary2');
        var summary3 = document.getElementById('daily_summary3');
        var summary4 = document.getElementById('daily_summary4');
        var summary5 = document.getElementById('daily_summary5');
        var summary6 = document.getElementById('daily_summary6');

        var summary_report = [summary1, summary2, summary3, summary4, summary5, summary6];

        showSkyConsWeeklyReport(forecast);

        var high_temp1 = document.getElementById('box1_high');
        var high_temp2 = document.getElementById('box2_high');
        var high_temp3 = document.getElementById('box3_high');
        var high_temp4 = document.getElementById('box4_high');
        var high_temp5 = document.getElementById('box5_high');
        var high_temp6 = document.getElementById('box6_high');

        var high_temp = [high_temp1, high_temp2, high_temp3, high_temp4, high_temp5, high_temp6];

        var low_temp1 = document.getElementById('box1_low');
        var low_temp2 = document.getElementById('box2_low');
        var low_temp3 = document.getElementById('box3_low');
        var low_temp4 = document.getElementById('box4_low');
        var low_temp5 = document.getElementById('box5_low');
        var low_temp6 = document.getElementById('box6_low');

        var low_temp = [low_temp1, low_temp2, low_temp3, low_temp4, low_temp5, low_temp6];

        //get the date array and retrieve from the next date
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        for (var i = 1; i < 7; i++) {
            var nextday = forecast.daily.data[i].time;
            //console.log(nextday.toString());
            var theDate = new Date(nextday * 1000);
            var theNextDay = days[theDate.getDay()];
            //console.log(theNextDay);
            nextDays[i - 1].innerHTML = theNextDay;

            //daily description report
            var summaryReport = forecast.daily.data[i].summary;
            //console.log(summaryReport);
            summary_report[i - 1].innerHTML = summaryReport;

            //daily high tempature
            var theHighTemp = forecast.daily.data[i].temperatureMax;
            high_temp[i - 1].innerHTML = parseInt(theHighTemp) + " &#8457;";

            //daily low tempature
            var theLowTemp = forecast.daily.data[i].temperatureMin;
            low_temp[i - 1].innerHTML = parseInt(theLowTemp) + " &#8457;";
        }

    };

    function showSkyConsWeeklyReport(forecast) {
        var day1Icon = document.getElementById('weather_icon_box1');
        var day2Icon = document.getElementById('weather_icon_box2');
        var day3Icon = document.getElementById('weather_icon_box3');
        var day4Icon = document.getElementById('weather_icon_box4');
        var day5Icon = document.getElementById('weather_icon_box5');
        var day6Icon = document.getElementById('weather_icon_box6');
        var iconsDayList = [day1Icon, day2Icon, day3Icon, day4Icon, day5Icon, day6Icon];
        var icons = new Skycons();
        

        for (var i = 0; i < iconsDayList.length; i++) {
            var skyicons = forecast.daily.data[i].icon;

            switch (skyicons) {
                case "clear-day":
                    icons.set(iconsDayList[i], Skycons.CLEAR_DAY);
                    break;
                case "clear-night":
                    icons.set(iconsDayList[i], Skycons.CLEAR_NIGHT);  
                    break;  
                case "partly-cloudy-day":
                    icons.set(iconsDayList[i], Skycons.PARTLY_CLOUDY_DAY); 
                    break;   
                case "partly-cloudy-night":
                    icons.set(iconsDayList[i], Skycons.PARTLY_CLOUDY_NIGHT); 
                    break; 
                case "cloudy":
                    icons.set(iconsDayList[i], Skycons.CLOUDY); 
                    break;
                case "rain":
                    icons.set(iconsDayList[i], Skycons.RAIN); 
                    break;
                case "sleet":
                    icons.set(iconsDayList[i], Skycons.SLEET); 
                    break;
                case "snow":
                    icons.set(iconsDayList[i], Skycons.SNOW); 
                    break;
                case "wind":
                    icons.set(iconsDayList[i], Skycons.WIND); 
                    break;
                default:
                    icons.set(iconsDayList[i], Skycons.FOG); 
            }
        }

        icons.play();
    };

    //get hourly weather report -- every 2 hours
    function getHourlyWeatherReport(forecast) {
        var hourlySummary = forecast.hourly.summary;
        var hourList = [];
        var tempList = [];
        //get the every 2 hour
        for (var i = 1; i < 24; i=i+2) {
            var unix_timestamp = forecast.hourly.data[i].time;
            //convert timestamp to real time in hour
            var date = new Date(unix_timestamp*1000);
            var hours = date.getHours();
            
            //convert to am pm for hours
            var formatted_hour = formatHour(hours);
            // console.log(formatted_hour);
            //add formatted hour to its list
            hourList.push(formatted_hour);

            var temp = forecast.hourly.data[i].temperature;
            temp = parseInt(temp);
            tempList.push(temp);
        }

        //weather responsive charts with high and low temp 
        //source: https://www.sitepoint.com/fancy-responsive-charts-with-chart-js/
        Highcharts.chart('hourly_report_canvas', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Hourly Temperature Report'
            },
            subtitle: {
                text: hourlySummary
            },
            xAxis: {
                categories: hourList
            },
            yAxis: {
                title: {
                    text: 'Temperature (°F)'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            },
            series: [{
                name: 'Tempature',
                data: tempList
            }]
        });
    };

    //convert integer hour to ampm hour
    function formatHour(hour) {
        var h = hour;
        if (h == 24) {
            h = '00 AM';
        } else if (h == 12) {
            h = '12 PM';
        } else if (h > 12) {
            h = h - 12 + ' PM';
        } else {
            h = h + ' AM';
        }

        return h.toString();
    }
