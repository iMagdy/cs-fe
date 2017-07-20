import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from '@uirouter/angularjs';

import mainApp from '../imports/components/mainApp/mainApp';
import loginForm from '../imports/components/login/login';
import registerForm from '../imports/components/register/register';

Meteor.startup(function() {
    angular.module('events-map', [
            angularMeteor,
            uiRouter,
            mainApp.name,
            'accounts.ui'
        ])
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
            function($stateProvider, $urlRouterProvider, $locationProvider) {
                $locationProvider.html5Mode(true);
                $urlRouterProvider.otherwise("/");
            }
        ]);
});