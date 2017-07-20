import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from '@uirouter/angularjs';
import template from './map.html';

const name = 'mapViewer';

export default angular.module(name, [
        'accounts.ui',
        angularMeteor,
        uiRouter
    ])
    .component(name, {
        templateUrl: "imports/components/map/map.html",
        controllerAs: name,
        controller: ['$scope', '$state', '$http', function($scope, $state, $http) {

            if (Meteor.userId() === null) {
                $state.go('login');
            }
            // Check Geolocation Support in Browser
            if (navigator.geolocation) {
                $scope.state = "...";    
                navigator.geolocation.getCurrentPosition(getEvents);

                function getEvents(position) {

                    // User Token > 
                    var fbToken = "EAANV6IloyT4BAAOWPsNCLXrk45FYZAHZCMw5vKDFrUp2ZAhThR1aEcRpLbZBSALIJlHsSldG0ZBVEZA1KkTsP7VkDgWyRg6ZCKLXQ2uPe4VfofW3Mrl6vCNKmQ9xm1Df4Krx6Yv0JGYUXldXPMSm2xKrmqmaSEqi9Q13x2gHsHcmfANeIUslErAKDtPZAiDcNqYZD";
                    
                    // Coordinates
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;

                    // Search Distance
                    var distance = 20000;

                    var map, infoWindow;
                    var markers = [];
                    var geocoder = new google.maps.Geocoder(); // Used to get City name from coordinates
                    var latlng = new google.maps.LatLng(lat, lng);

                    // map config
                    var mapOptions = {
                        center: latlng,
                        zoom: 11,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                    };

                    function initMap() {
                        if (map === void 0) {
                            map = new google.maps.Map(document.getElementById('mviewer'), mapOptions);
                        }
                    }

                    // Marker's Seting function  
                    function setMarker(map, position, title, desc) {
                        var marker;
                        var markerOptions = {
                            position: position,
                            map: map,
                            title: title,
                            icon: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                        };

                        marker = new google.maps.Marker(markerOptions);
                        markers.push(marker); // add marker to array

                        google.maps.event.addListener(marker, 'click', function() {
                            
                            // close window if not undefined
                            if (infoWindow !== void 0) {
                                infoWindow.close();
                            }
                            // create new info window
                            var infoWindowOptions = {
                                content: `<h2>${title}</h2><p>${desc}</p>`
                            };
                            infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                            infoWindow.open(map, marker);
                        });
                    }

                    initMap();

                    geocoder.geocode({ 'latLng': latlng },
                        function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[0]) {
                                    var add = results[0].formatted_address;
                                    var value = add.split(",");
                                    // Remove extra words in name
                                    $scope.state = state = (value[value.length - 2]).replace(/governorate|city|state/gi,"").trim();
                                    var eventsByLocation = `https://graph.facebook.com/search?q=${state}&type=event&center=${lat},${lng}&distance=${distance}&access_token=${fbToken}`;

                                    $http.get(eventsByLocation)
                                        .then(function(response) {
                                            var events = response.data.data;
                                            events.forEach(function(event, index) {
                                                // check if event has a specified location
                                                if (event.place.location) {
                                                    if(JSON.stringify(event.place.location).indexOf(state) > -1){
                                                        var evLat = event.place.location.latitude;
                                                        var evLng = event.place.location.longitude;
                                                        setMarker(map, new google.maps.LatLng(evLat, evLng), event.name, event.description);
                                                    }
                                                }
                                            });
                                            angular.element( document.querySelector('#spinner-container')).css('display','none');
                                        });

                                } else {
                                    console.warn("address not found");
                                }
                            } else {
                                console.error("ERROR", "Geocoder failed due to: " + status);
                            }
                        }
                    );

                }
            } else {
                console.Warning("Geolocation is not supported by this browser.");
            }
        }]
    }).config(function($stateProvider) {
        'ngInject';
        $stateProvider
            .state('events', {
                url: '/events',
                template: '<map-viewer></map-viewer>'
            });
    });