angular.module('calorieTrackerApp.userPage', [])

.controller('UserPageCtrl', function($scope, $http, UserPage, $q) {
  // extend factory to the controller
  angular.extend($scope, UserPage);
  var inEdit = {};
  // checks if an entry is being edited
  $scope.editing = function(entry) {
    if (entry && inEdit[entry._id]) {
      return true;
    }
    return false;
  }
  // grabs all the entries for a user
  var fetchEntries = function(resolve, reject) {
    $http.post('/calories', {token: sessionStorage.token})
      .success(function(data, status, headers, config) {
          // saves all entries to scope
          $scope.userEntries = data.entries;
        })
        .error(function(data, status, headers, config) {
          reject();
        });
  }

  // saves an entry to the database
  $scope.saveEntry = function(calories, comments, date, time) {
    // makes a post request to the server to save the entry
    $http.post('/saveEntry', {calories: calories, comments: comments, date: date,  time: time, token: sessionStorage.token})
      // data is the response i get back from the server
      .success(function(data, status, headers, config) {
        // reset form
        $scope.addEntry.$setPristine();
        $scope.date = "";
        $scope.time = "";
        $scope.calories = "";
        $scope.comments ="";
        var key = Object.keys($scope.userEntries).length
        $scope.userEntries[key] = data.entry;
        checkColor();
        $scope.apply;
      })
  }

  // deletes an entry from mongo
  $scope.deleteEntry = function(entry) {
    // $http.post("/deleteEntry", entry)
    $http.delete("/deleteEntry",
      {
        params: {
          entry: entry
        }
      })
      .success(function(data, status, headers, config) {
        $http.post('/calories', {token: sessionStorage.token})
          .success(function(data, status, headers, config) {
              $scope.userEntries = data.entries;
              checkColor();
              $scope.apply;
          });
      });
  }

  // updates an entry in mongo
  $scope.updateEntry = function(entry, calories, comments, date, time) {
    $http.put("/updateEntry", {entry: entry, calories: calories, comments: comments, date: date, time: time })
      .success(function(data, status, headers, config) {
        // updates list of entries on page
        $http.post('/calories', {token: sessionStorage.token})
          .success(function(data, status, headers, config) {
              $scope.userEntries = data.entries;
              delete inEdit[entry._id];
              $scope.apply;
              checkColor();

          });
      });
  }

  // sets up editing an entry
  $scope.editEntry = function(entry) {
    inEdit[entry._id] = true;
  }

  // closes editing an entry
  $scope.closeEdit = function(entry) {
    delete inEdit[entry._id];
  }

  // updates the color of expected calories
  var checkColor = function() {
    $q(function(resolve, reject) {
      // saves the sum of the users daily calories to scope
      $scope.dailyCalories = $scope.sumCalories($scope.userEntries).$$state.value;
      resolve();
    }).then(function() {
      if ($scope.dailyCalories < $scope.expectedCalories) {
      $('#dailyCalories').removeClass('over');
      $('#dailyCalories').addClass('under');
      } else {
      $('#dailyCalories').removeClass('under');
      $('#dailyCalories').addClass('over');
      }
    });
  }
  // saves the user to the scope to be displayed
  $q(function(resolve, reject) {
    $http.post('/calories', {token: sessionStorage.token})
      .success(function(data, status, headers, config) {
          $scope.userEntries = data.entries;
          $scope.user = data.user;
          resolve();
        })
        .error(function(data, status, headers, config) {
          reject();
        });
  }).then(function() {
    $q(function(resolve,reject) {
      // grabs all the logged in user entries.
      $http.post('/expectedCalories', {token: sessionStorage.token})
        .success(function(data, status, headers, config) {
            $scope.expectedCalories = data.expectedCalories;
            resolve();
          })
          .error(function(data, status, headers, config) {
            reject();
          });
    }).then(function() {
      // checks the expcted calories color
      checkColor();
    });
  });

})

.factory('UserPage', function($http, $q, $rootScope) {

  // adds up daily calories from a group of entries
  var sumCalories = function(entries) {
    var result = 0;
    // setting up variable for current date
    var currentDateTime = new Date();
    var currentDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate())
    // returns the calorie sum in a promise
    return $q(function(resolve, reject) {
      // look through all entries
      entries.forEach(function(entry) {
        jsEntryDate = new Date(entry.date);
        // check to see if entry was from today
        if (jsEntryDate.valueOf() === currentDate.valueOf()) {
          // add entry's calories to sum if entry was from today
          result += entry.calories;
        }
      });
      resolve(result);
    });
  }

  // formats the date
  var dateFormat = function(date) {
    var d = new Date(date);
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    return (curr_month + "-" +  curr_date+ "-" + curr_year);
  }

  // formats the time
  var timeFormat = function(time) {
    var t = (new Date(time)).getTime()/60000;
    var hours = Math.floor(t/60) - 5;
    var minutes = t % 60;
    if (minutes.toString().length === 1) {
      minutes = "0"+minutes;
    }
    return (hours+":"+minutes);
  }

  return {
    sumCalories: sumCalories,
    dateFormat: dateFormat,
    timeFormat: timeFormat,
  }
})
// filter on a from and to date
.filter('dateFilter', function() {
  return function(entries, dateFrom, dateTo, isChecked) {
    if (isChecked) {
      var filteredResults = [];
      entries.forEach(function(entry) {
        jsEntryDate = new Date(entry.date);
        if (jsEntryDate >= dateFrom && jsEntryDate <= dateTo) {
          filteredResults.push(entry);
        }
      })
      return filteredResults;
    } else {
      return entries;
    }
  }
})
// filter on a from and to time
.filter('timeFilter', function() {
  return function(entries, timeFrom, timeTo, isChecked) {
    if (isChecked) {
      var filteredResults = [];
      entries.forEach(function(entry) {
        jsEntryTime = new Date(entry.time);
        if (jsEntryTime >= timeFrom.getTime() && jsEntryTime <= timeTo.getTime()) {
          filteredResults.push(entry);
        }
      });
      return filteredResults;
    } else {
      return entries;
    }
  }
})
