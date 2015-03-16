/// <reference path="../../Vendors/angular.min.js" />

angular.module('directives.barCalendar', []).directive('barCalendar', function () {
    return {
        restrict: 'EA',
        templateUrl: '/directive.barCalendar.ng',
        replace: true,
        transclude: true,
        scope: { calendarUserCode: '=', calendarShowSubmit: '=', ajaxAdd: '&', ajaxLoadList: '&', ajaxCountPerDay: '&' },
        controller: function ($scope, $element, $attrs, $transclude) {
            var _throwError = function (msg) {
                throw msg + ' at directive BarCalendar';
            };
            if (!$scope.calendarUserCode) { _throwError('error user code'); }
            if (typeof ($scope.ajaxAdd()) != 'function') { _throwError('error function ajaxAdd'); };
            if (typeof ($scope.ajaxLoadList()) != 'function') { _throwError('error function ajaxLoadList'); };
            if (typeof ($scope.ajaxCountPerDay()) != 'function') { _throwError('error function ajaxCountPerDay'); };

            $scope.main = {
                _userCode: $scope.calendarUserCode,
                _calendar: new Calendar(),
                days: [],
                initial: function () {
                    this.days = this._calendar.getMonthDaysGrid2();

                    this.fillReservesCountPerDay();

                    for (var i = 0; i < this.days.length; i++) {
                        for (var j = 0; j < this.days[i].length; j++) {
                            if (this.days[i][j].day == this._calendar.Day()) {
                                this.selectedDay = this.days[i][j];
                                this.selectedDay.selected = true;
                                return;
                            }
                        }
                    }


                },

                previousMonth: function () {
                    this._calendar.downMonth(1);
                    this.initial();
                },
                nextMonth: function () {
                    this._calendar.upMonth(1);
                    this.initial();
                },
                goToday: function () {
                    this._calendar = Calendar.get();
                    this.initial();
                },
                selectedDay: {},
                selectDay: function (day) {
                    if (isNaN(day.day)) {
                        return;
                    }
                    angular.forEach(this.days, function (week) {
                        angular.forEach(week, function (weekDay) {
                            weekDay.selected = false;
                        });
                    });
                    day.selected = true;
                    this.selectedDay = day;
                },

                content: '',
                submit: function () {
                    var main = this;
                    var entity = {
                        Description: this.content,
                        Barber: this._userCode,
                        Year: this.selectedDay.year,
                        Month: this.selectedDay.month,
                        Day: this.selectedDay.day
                    };
                    $scope.ajaxAdd()(entity).then(function () {
                        $scope.main.loadReserves();
                        $scope.main.content = '';
                        main.selectedDay.count += 1;
                        //MobileMessageSvc.refresh();
                    });

                },
                reserves: [],
                loadReserves: function () {
                    if (!this.selectedDay.year) {
                        _throwError('error year');
                    }
                    var main = this;
                    $scope.ajaxLoadList()(
                            this._userCode,
                            this.selectedDay.year,
                            this.selectedDay.month,
                            this.selectedDay.day)
                        .then(function (rep) {
                            main.reserves = rep.data;
                        });

                },
                fillReservesCountPerDay: function () {
                    var main = this;
                    var year = this._calendar.Year();
                    var month = this._calendar.Month();
                    $scope.ajaxCountPerDay()(this._userCode, year, month).then(function (rep) {
                        angular.forEach(main.days, function (week) {
                            angular.forEach(week, function (day) {
                                day.count = 0;
                                angular.forEach(rep.data, function (number) {
                                    if (day.day == number.MonthDay) {
                                        day.count = number.Number;
                                    }
                                });
                            });
                        });
                    });
                }
            };
            $scope.toggle = {

            };
            $scope.$watch('main.selectedDay', function () {
                $scope.main.loadReserves();
            });

            $scope.$watch('main._userCode', function () {
                $scope.main.initial();
            });
        },
        link: function (scope, iEle, iAttrs) {
        }
    };
})
;