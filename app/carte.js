/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    var app = angular.module('carte', []);
    app.controller('PageController', ['$http', '$sce', '$location', function ($http, $sce, $location) {
            this.location = $location;
            this.currentPage = null;
            this.currentPageIndex = 0;
            this.clazz = '6C'
            this.clazzes = ['6A','6C', '6F'];
            var ctrl = this;
            this.updatePage = function () {
                this.title = this.pages[this.currentPageIndex].title;
                this.author = this.pages[this.currentPageIndex].author;
                this.sound = this.pages[this.currentPageIndex].sound;
                this.isStart = this.currentPageIndex === 0;
                this.isEnd = this.currentPageIndex === (this.pages.length - 1);
            };
            this.reload = function () {
                this.init(function () {
                    ctrl.updatePage();
                    if (ctrl.summary)
                        ctrl.summary = $sce.trustAsHtml(ctrl.pages[ctrl.currentPageIndex].summary)
                    if (ctrl.image)
                        ctrl.image = ctrl.pages[ctrl.currentPageIndex].image;
                    if (ctrl.caption)
                        ctrl.caption = $sce.trustAsHtml(ctrl.pages[ctrl.currentPageIndex].caption);
                });

            };
            this.init = function (f) {
                if ($location.protocol() === 'file') {
                    var splited = $location.absUrl().split('/');
                    splited.pop();
                    var path = '';
                    for (var i = 0; i < splited.length; i++) {
                        var s = splited[i];
                        path = path.concat(s + '/');
                    }
                    path = path.concat('data/' + this.clazz + '/pages.json');
                } else
                    var path = 'data/' + this.clazz + '/pages.json';
                $http.get(path)
                        .success(
                                function (data) {
                                    ctrl.pages = data;
                                    ctrl.updatePage();
                                    if (f)
                                        f();
                                }
                        );
            }
            this.next = function () {
                this.clearData();
                if (this.currentPageIndex < this.pages.length - 1)
                    this.currentPageIndex++;
                else
                    this.currentPageIndex = this.pages.length - 1;
                this.updatePage();
            };
            this.prev = function () {
                this.clearData();
                if (this.currentPageIndex > 0)
                    this.currentPageIndex--;
                else
                    this.currentPageIndex = 0;
                this.updatePage();
            };
            this.reset = function () {
                this.clearData();
                this.currentPageIndex = 0;
                this.updatePage();
            };
            this.showImage = function () {
                this.clearData();
                this.image = this.pages[this.currentPageIndex].image;
                this.caption = $sce.trustAsHtml(this.pages[this.currentPageIndex].caption);
            };
            this.showSummary = function () {
                this.clearData();
                this.summary = $sce.trustAsHtml(this.pages[this.currentPageIndex].summary);
            };
            this.clearData = function () {
                this.image = null;
                this.caption = null;
                this.summary = null;
                $('.player').remove();
            };
            this.playSound = function () {
                $('.player').remove();
                if (this.sound) {
                    audio = $('<audio class="player" src="data/' + this.clazz + '/sound/' + this.sound + '" autoplay>Votre navigateur ne supporte pas l\'audio</audio>');
                    $('.map').append(audio);
                }
            };
            this.expandImage = function () {
                this.expanded = !this.expanded;
            };
            this.mapClick = function (event) {
                if (this.currentPageIndex > 0)
                    return;
                this.relX = event.pageX - event.target.offsetLeft;
                this.relY = event.pageY - event.target.offsetTop;
                for (var i = 0; i < ctrl.pages.length; i++) {
                    for (var j = 0; ctrl.pages[i].coords && j < ctrl.pages[i].coords.length; j++)
                        if (coordMatches(this.relX, this.relY, ctrl.pages[i].coords[j].x, ctrl.pages[i].coords[j].y)) {
                            this.clearData();
                            this.currentPageIndex = i;
                            this.updatePage();
                            return;
                        }
                    function coordMatches(testX, testY, refX, refY) {
                        return Math.sqrt(Math.pow(testX - refX, 2) + Math.pow(testY - refY, 2)) < 5;
                    }
                }
            };
            this.init();
        }]);


})();
