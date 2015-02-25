angular.module('calorieTrackerApp.userPage', [])

.controller('UserPageCtrl', function($scope, $http, UserPage, $q) {
  // extend factory to the controller
  angular.extend($scope, UserPage);
  var inEdit = {};
  $scope.editing = function(entry) {
    console.log(inEdit[entry._id]);
    if (entry && inEdit[entry._id]) {
      return true;
    }
    return false;
  }
  var fetchEntries = function(resolve, reject) {
    $http.post('/calories', {token: sessionStorage.token})
      .success(function(data, status, headers, config) {
          console.log('success');
          $scope.userEntries = data.entries;
          // $scope.user = data.user;
          // resolve();
        })
        .error(function(data, status, headers, config) {
          console.log('error');
          reject();
        });
  }

  // saves an entry to the database
  $scope.saveEntry = function(calories, comments, date, time) {
    // makes a post request to the server to save the entry
    $http.post('/saveEntry', {calories: calories, comments: comments, date: date,  time: time, token: sessionStorage.token})
      // data is the response i get back from the server
      .success(function(data, status, headers, config) {
        console.log('success');
        // reset form
        $scope.addEntry.$setPristine();
        $scope.date = "";
        $scope.time = "";
        $scope.calories = "";
        $scope.comments ="";
        var key = Object.keys($scope.userEntries).length
        $scope.userEntries[key] = data.entry;
        $scope.apply;
      })
      .error(function(data, status, headers, config) {
        console.log('error');
     });
  }
  $scope.deleteEntry = function(entry) {
    $http.post("/deleteEntry", entry)
      .success(function(data, status, headers, config) {
        $http.post('/calories', {token: sessionStorage.token})
          .success(function(data, status, headers, config) {
              console.log('success');
              $scope.userEntries = data.entries;
              $scope.apply;
          });
      });
  }

  $scope.updateEntry = function(entry, calories, comments, date, time) {
    console.log(entry._id);
    $http.post("/updateEntry", {entry: entry, calories: calories, comments: comments, date: date, time: time })
      .success(function(data, status, headers, config) {
        $http.post('/calories', {token: sessionStorage.token})
          .success(function(data, status, headers, config) {
              $scope.userEntries = data.entries;
              console.log(data.entries);
              delete inEdit[entry._id];
              $scope.apply;
              checkColor();

          });
      });
  }

  $scope.editEntry = function(entry) {
    console.log(entry);
    inEdit[entry._id] = true;
  }

  $scope.defaultDate = function(date) {
    $('.editDate').val(entry.date.getFullYear() + '-' + entry.date.getMonth() + '-' + entry.date.getDate())
  }

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
      $q(function(resolve, reject) {
        // saves the sum of the users daily calories to scope
        $scope.dailyCalories = $scope.sumCalories($scope.userEntries).$$state.value;
        resolve();
      }).then(function() {
        if ($scope.dailyCalories < $scope.expectedCalories) {
          $('#dailyCalories').addClass('under');
        } else {
          $('#dailyCalories').addClass('over');
        }
      });
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

  var dateFormat = function(date) {
    var d = new Date(date);
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    return (curr_month + "-" +  curr_date+ "-" + curr_year);
  }

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
    // saveEntry: saveEntry,
    sumCalories: sumCalories,
    // deleteEntry: deleteEntry,
    dateFormat: dateFormat,
    timeFormat: timeFormat,
    // editEntry: editEntry
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
