/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    var app = angular.module('test', []);
    app.controller('TestController', ['$location', function ($location) {
            this.location = $location;
            var splited = $location.absUrl().split('/');
            splited.pop();
            this.res = '';
            for (var i = 0; i < splited.length; i++) {
                var s = splited[i];
                this.res = this.res.concat(s + '/');
            }

        }]);


})();
