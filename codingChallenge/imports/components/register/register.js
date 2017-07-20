import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from '@uirouter/angularjs';
import template from './register.html';

const name = 'registerForm';
export default angular.module(name, [
        'accounts.ui',
        angularMeteor,
        uiRouter
    ])
    .component(name, {
        templateUrl: "imports/components/register/register.html",
        controllerAs: name,
        controller: ['$scope', '$state', function($scope, $state) {
            if (Meteor.userId() !== null) {
                $state.go('map');
            }
            $scope.submitRegister = function(user) {
                Accounts.createUser({
                    username: user.name,
                    email: user.mail,
                    password: user.pass
                });
                $state.go("map");
            };
        }

    ]}).config(function($stateProvider) {
        'ngInject';
        $stateProvider
            .state('register', {
                url: '/register',
                template: '<register-form></register-form>'
            });
    });