import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from '@uirouter/angularjs';
import template from './login.html';

const name = 'loginForm';
export default angular.module(name, [
        'accounts.ui',
        angularMeteor,
        uiRouter
    ])
    .component(name, {
        templateUrl: "imports/components/login/login.html",
        controllerAs: name,
        controller: ['$scope', '$state', function($scope, $state) {
            if (Meteor.userId() !== null) {
                $state.go('events');
            }
            $scope.submitLogin = function(user) {
                Meteor.loginWithPassword(user.mail, user.pass, function(err) {
                    if (err) {
                        $scope.loginErr = err.reason;
                    } else {
                        $scope.loginErr = "";
                        $state.go("events");
                    }
                });
            };
        }
    ]}).config(function($stateProvider) {
        'ngInject';
        $stateProvider
            .state('login', {
                url: '/',
                template: '<login-form></login-form>'
            });
    });