/// <reference path="~/Vendors/angular.min.js" />
/// <reference path="../../Vendors/amplify-vsdoc.js" />
/// <reference path="../Utils.js" />
/// <reference path="~/Vendors/jquery-2.1.3.min.js" />


var app = angular.module('UserApp', [
    'directives.barCalendar',
    'services.appconstant',
    'services.global',
    'services.tip',

    'services.user',
    'services.tweet',
    'services.tag',
    'services.skill',
    'services.comment',
    'services.reserve'
]);
app.constant('UserConstant', { UserCode: Global.userCode });
app.controller('BodyCtrl', function ($scope, AppConstant) {
    $scope.constant = AppConstant;
});
app.controller('TweetCtrl', function ($scope, TweetSvc, CommentSvc, UserConstant) {

    $scope.main = {
        list: {
            entities: [],
            page: 1,
            pages: 1,
            total: 0,
            remove: function (index) {
                var tweet = this.entities[index];
                TweetSvc.remove(tweet.Id).then(function (rep) {
                    if (rep.data) {
                        $scope.main.list.entities.splice(index, 1);
                    }
                });
            },
            load: function (p) {
                if (!p || p <= 0) { throw 'error page'; return; }

                return TweetSvc.getList(p, UserConstant.UserCode).then(function (rep) {
                    var tweets = rep.data || [];
                    $scope.main.list.pages = parseInt(rep.headers('X-Bar-Pages')) || 1;
                    for (var i = 0; i < tweets.length; i++) {
                        var tweet = tweets[i];
                        tweet.expand = false;
                        $scope.main.list.entities.push(tweet);
                    }
                });
            },
            loadMore: function () {
                this.page += 1;
            },
            refresh: function () {
                this.load(1); this.page = 1;
                $scope.main.list.entities = [];
            },
            expandToggle: function (index) {
                var tweet = this.entities[index];
                tweet.expand = !tweet.expand;
                //if (tweet.Comments.length >= 1) { return;}
                if (!tweet.expand) { return; }
                CommentSvc.getList(tweet.Id).then(function (rep) {
                    tweet.Comments = rep.data.Comments;
                });
            }
        },

        add: {
            tweetContent: '',
            tweet: function () {
                TweetSvc.add(this.tweetContent).then(function (rep) {
                    $scope.main.list.entities.unshift(rep.data);
                });
                this.tweetContent = '';
            },

            commentContent: '',
            comment: function (tweetIndex) {
                var tweet = $scope.main.list.entities[tweetIndex];
                var entity = { Content: this.commentContent, TweetId: tweet.Id };
                CommentSvc.add(entity).then(function (rep) {
                    tweet.Comments.push(rep.data);
                    amplify.publish('user.message.unread.refresh');
                });
                this.commentContent = '';
            }
        },
        comment: {
            remove: function (tweet, commentIndex) {
                var tweetId = tweet.Id;
                var commentId = tweet.Comments[commentIndex].Id;
                CommentSvc.remove(commentId).then(function (rep) {
                    if (rep.data) {
                        tweet.Comments.splice(commentIndex, 1);
                    }
                });
            }
        }
    };
    $scope.$watch('main.list.page', function (newVal) {
        $scope.main.list.load(newVal);
    });
});

app.controller('SkillCtrl', function ($scope, SkillSvc) {
    $scope.main = {
        skills: [],
        skill: '',
        submit: function () {
            SkillSvc.add(this.skill).then(function (rep) {
                amplify.publish('add.skill', rep.data);
                $scope.main.skills.push(rep.data);
            });
            this.skill = '';
        }
    };
});

app.controller('LoginCtrl', function ($scope, UserSvc, UserConstant) {
    $scope.main = {
        user: {
            Name: '未填写',
            UserCode: '',
            Password: '',
            UserType: 'User'
        },
        isCurrent: function () {
            UserSvc.isCurrent(UserConstant.UserCode, function (rep) {
                if (rep.data.Success) {
                    amplify.publish('true.current.user');
                } else {
                    amplify.publish('false.current.user');
                }
            }, function () {
                amplify.publish('false.current.user');
            });
        },
        login: function () {
            UserSvc.login(this.user.UserCode, this.user.Password).then(function (rep) {
                if (rep.data && rep.data.Success) {
                    amplify.publish('true.login.user');
                    $scope.main.isCurrent();
                } else {
                    amplify.publish('false.login.user');
                }
            }, function () {
                amplify.publish('false.login.user');
            });
        },
        register: function () {
            UserSvc.register(this.user).then(function (rep) {
                if (rep.data && rep.data.Success) {
                    $scope.main.login();
                }
            });
        }
    }
});

app.controller('ReserveCtrl', function ($scope, ReserveSvc, UserConstant) {

    $scope.main = {
        userCode: UserConstant.UserCode,
        showSubmit: Global.isLogin,
        ajax: {
            add: function (reserve) {
                return ReserveSvc.add(reserve);
            },
            load: function (user, year, month, day) {
                return ReserveSvc.getList(user, year, month, day);
            },
            countPerDay: function (user, year, month) {
                return ReserveSvc.getCountPerDay(user, month, year);
            }
        }
    };
  
});

