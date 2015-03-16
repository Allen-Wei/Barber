

/*
 * Author: Alan
 * Dependence: none
*/

var Calendar = function (year, month, day) {

    var currentDate = new Date();

    this.Date = function (year, month, day) {
        if (arguments.length >= 2) {
            currentDate = new Date(year, month - 1, day || 1);
            return this;
        } else {
            return currentDate;
        }
    };

    this.Year = function (year) {
        if (year) { currentDate.setYear(year); return this; }
        return currentDate.getYear() + 1900;
    };
    this.getWeek = function () {
        return currentDate.getDay() === 0 ? 7 : currentDate.getDay();
    };
    this.Month = function (month) {
        if (month) { currentDate.setMonth(month - 1); return this; }
        return currentDate.getMonth() + 1;
    };
    this.Day = function (day) {
        if (day) { currentDate.setDate(day); return this }
        return currentDate.getDate();
    };

    //initialze
    if (year) { this.Year(year); }
    if (month) { this.Month(month); }
    if (day) { this.Day(day); }

    this.getDaysCount = function () {
        if (this.Month() === 2) {
            if (this.isLeepYear()) { return 29; } else { return 28; }
        }
        var month31 = [1, 3, 5, 7, 8, 10, 12];
        var month30 = [4, 6, 9, 11];
        if (month31.indexOf(this.Month()) != -1) {
            return 31;
        }
        if (month30.indexOf(this.Month()) != -1) { return 30; }

        throw 'error month -> this.getDaysCount()';
    };
    this.isLeepYear = function () {
        return this.Year() % 4 === 0 || this.Year() % 400 === 0;
    };
    this.upMonth = function (number) {
        if (isNaN(number) || number <= 0) { return this; }
        number = parseInt(number);

        var monthNumber = this.Month() + number;
        if (monthNumber <= 12) {
            this.Month(monthNumber);
            return this;
        }
        var upYears = parseInt(monthNumber / 12);
        if (upYears > 0) {
            this.Year(this.Year() + upYears);
        }

        var _month = monthNumber % 12;
        this.Month(_month === 0 ? 12 : _month);
        return this;
    };
    this.downMonth = function (number) {
        if (isNaN(number) || number <= 0) { return this; }

        var _month = '';
        if (number > 12) {
            var downYears = parseInt(number / 12);
            this.Year(this.Year() - downYears);
            number = number % 12;
        }
        var _value = this.Month() - number;
        if (_value > 0) {
            this.Month(_value);
        } else if (_value <= 0) {
            this.Year(this.Year() - 1);
            this.Month(12 + _value);
        }
        return this;
    };
    this.nextMonth = function () {
        return this.clone().upMonth(1).Month();
    };
    this.previousMonth = function () {
        return this.clone().downMonth(1).Month();
    };
    this.upDay = function (number) {
        if (isNaN(number) || number <= 0) { return this; }
        currentDate.setDate(this.Day() + number);
        return this;
    };
    this.downDay = function (number) {
        //Bug: fix bug

        if (isNaN(number) || number <= 0) { return this; }
        var _day = this.Day();
        if (_day > number) {
            this.Day(_day - number);
            return this;
        } else if (_day <= number) {
            var _distance = number - this.Day();

            if (_distance == 0) {
                this.downMonth(1);
                this.Day(this.getDaysCount());
                return this;
            }

            while (_distance > 0) {
                this.downMonth(1);
                if (_distance >= this.getDaysCount()) {
                    _distance -= this.getDaysCount();
                } else {
                    this.Day(_distance);
                    break;
                }
            }

        }
        return this;
    };

    this.getMonthDays = function () {
        var _days = [];
        var _calendar = this.clone().Day(1);
        var _calendarMonth = _calendar.Month();
        while (_calendar.Month() == _calendarMonth) {
            var _day = ({
                year: _calendar.Year(),
                month: _calendar.Month(),
                day: _calendar.Day(),
                week: _calendar.getWeek()
            });
            _calendar.Day(_calendar.Day() + 1);
            _days.push(_day);
        }
        return _days;
    };
    this.getMonthDaysGrid1 = function () {
        var _days = this.getMonthDays();
        var _weeks = [];/*[undefined, undefined, new Date(), new Date()...]*/
        if (_days[0].week !== 7) {
            for (var i = _days[0].week; i > 0 ; i--) {
                _weeks.unshift({});
            }
        }

        _weeks = _weeks.concat(_days);

        if (_weeks.length % 7 !== 0) {
            var _leave = 7 - _weeks.length % 7;
            for (var i = 0; i < _leave; i++) {
                _weeks.push({});
            }
        }
        return _weeks;
    };
    this.getMonthDaysGrid2 = function () {
        var _days = this.getMonthDaysGrid1();/*[[undefined, undefined, new Date(), new Date()...], ...]*/
        var _weeks = [];
        while (_days.length > 0) {
            var _week = [];
            for (var i = 0; i < 7; i++) {
                _week.push(_days.shift());
            }
            _weeks.push(_week);
        }
        return _weeks;
    };

    this.clone = function () {
        return Calendar.get(this.Year(), this.Month(), this.Day());
    };
};
Calendar.get = function (year, month, day) {
    if (arguments.length === 0) { return new Calendar();}

    var calendar = new Calendar();
    calendar.Date(year, month, day);
    return calendar;
};
Calendar.wrapper = function (date) {
    if (date instanceof Date) {
        return Calendar.get(date.getYear() + 1900, date.getMonth() + 1, date.getDate());
    } else {
        throw 'error date';
    }
};
