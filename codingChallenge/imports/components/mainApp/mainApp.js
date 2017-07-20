import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from '@uirouter/angularjs';

import template from './mainApp.html';
import { name as login } from '../login/login';
import { name as register } from '../register/register';
import { name as map } from '../map/map';


class mainAppCtrl {
    constructor($scope, $state) {
        $scope.$watch(function() {
            return Meteor.user();
        }, function(newValue, oldValue) {
            if (typeof newValue !== 'undefined' && newValue !== null) {
                $scope.userId = newValue._id;
                $scope.username = newValue.username;
            }
        }, true);
        $scope.logOut = function() {
            Meteor.logout(function() {
                $scope.userId = Meteor.userId();
                $state.go("login");
            });
        }
    }
}

export default angular.module('mainApp', [
        'accounts.ui',
        angularMeteor,
        uiRouter,
        'loginForm',
        'registerForm',
        'mapViewer'
    ])
    .component('mainApp', {
        templateUrl: 'imports/components/mainApp/mainApp.html',
        controller: mainAppCtrl
    });