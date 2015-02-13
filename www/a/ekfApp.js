'use strict';

var app = angular.module('ekfApp', ['ngRoute', 'ngSanitize']);

app.controller('NavCtrl', function($scope) {

});

app.config((['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/directory', {
        templateUrl: 'partials/directory.html',
        controller: 'DirectoryCtrl'
      }).
    when('/profile/:profileID/', {
      templateUrl: 'partials/profile.html',
      controller: 'DirectoryCtrl'
    }).
    when('/forum/', {
      templateUrl: 'partials/forums.html',
    }).
    otherwise({
      redirectTo: '/directory'
    })
    ;
    //$locationProvider.html5Mode(true);
  }]));


var uniqueItems = function (data, key) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
        var value = data[i][key];
        if (result.indexOf(value) === -1) {
            result.push(value);
        }
    }
    return result;
};

var getUserData = function($scope) {
    $scope.users = [
    { 'id': '0',
      'photo': "images/photos/user2.png",
      'displayname': "Ray Sin",
      'region': 'US-West',
      'location': 'San Francisco, CA',
      'job': 'Founder at SomeCompany',
      'type': 'Entrepreneur'
    },
    {
      'id': '1',
      'photo': "holder.js/110x110",
      'displayname': 'Robert Dupont',
      'region': 'France',
      'location': 'Paris, France',
      'job': 'Founder at iMachines</a>',
      'type': 'Entrepreneur'
    },
    {
      'id': '2',
      'photo': "images/photos/jb.jpg",
      'displayname': 'Jean-Baptiste Rudelle',
      'region': 'US-West',
      'location': 'Palo Alto, CA',
      'job': '[Mentor] Founder & CEO at Criteo',
      'twitter': ['@jbrudelle', 'https://twitter.com/jbrudelle'] ,
      'type': 'Mentor'
    },
    {
      'id': '3',
      'photo': "images/photos/skasriel.jpg",
      'displayname': 'Stephane Kasriel',
      'region': 'US-West',
      'location': 'Los Altos, CA',
      'job': 'General Partner at ek*f',
      'twitter': ['@skasriel', 'https://twitter.com/skasriel'],
      'linkedin': ['linkedin.com/in/kasriel', 'https://linkedin.com/in/kasriel'],
      'phone': '+1 408-506-0781',
      'email': 'stephane@ekf.com',
      'type': 'Investor'
    },
    {
      'id': '4',
      'photo': "images/photos/mekeland.jpg",
      'displayname': 'Marie Ekeland',
      'region': 'France',
      'location': 'Paris, France',
      'job': 'General Partner at ek*f',
      'email': 'marie@ekf.com',
      'twitter': ['@bibicheri', 'https://twitter.com/bibicheri'],
      'phone': '+33 1 44-44-44-44',
      'type': 'Investor'
    }
  ];
  console.log("created users: "+$scope.users.length);
}

app.controller('DirectoryCtrl', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
  getUserData($scope);

  $scope.profileID = $routeParams.profileID;
  $scope.user = $scope.users[$scope.profileID];

  $scope.filters = {};
  $scope.sorting = {order: 'displayname', direction: 'false'};

  //$scope.locationsGroup = uniqueItems($scope.users, 'region');
  //$scope.skillsGroup = uniqueItems($scope.users, 'skill');

  $scope.$watch(function () {
    return { // events to watch for 
      products: $scope.users,
      userLocations: $scope.userLocation,
      userSkills: $scope.userSkill,
      userTypes: $scope.userType
    }
  }, function (value) { // action to take when watched values change
    console.log("in watch "+value);
    var facets = [
      {'option': 'userLocation', 'property': 'region'},
      {'option': 'userSkill', 'property': 'skill'},
      {'option': 'userType', 'property': 'type'}
    ];
    var isAnySelected = false;
    for (var i in facets) {
      var facet = facets[i];
      var option = $scope[facet['option']];
      if (option && option!='' && option!='Any') {
        isAnySelected = true; 
        break;          
      }
    }
    if (!isAnySelected) {
      console.log("No facet selected");
      $scope.filteredUsers = $scope.users;
      $scope.filteredUsers.sort(function(a,b) { return a.displayname.localeCompare(b.displayname) });
      return;
    }

    var filtered = $scope.users;
    for (var i in facets) {
      var facet = facets[i];
      var selectedValue = $scope[facet['option']];
      var property = facet['property'];
      if (!selectedValue || selectedValue=='' || selectedValue=='Any') {
        console.log("skipping unset facet: "+property);
        continue;
      }
      console.log("now evaluating facet: "+property+" for value "+selectedValue);
      var filteredTemp = [];

      for (var j in filtered) {
        var user = filtered[j];
        console.log("comparing "+user[property]+" to "+selectedValue);
        if (user[property] == selectedValue) {
          console.log("adding: "+user['displayname']);
          filteredTemp.push(user);
        }
      }
      filtered = filteredTemp;
    }

    filtered.sort(function(a,b) { return a.displayname.localeCompare(b.displayname) });

    $scope.filteredUsers = filtered;
    console.log('# filtered = '+$scope.filteredUsers);
  }, true);
}]);

