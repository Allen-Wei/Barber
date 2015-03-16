/// <reference path="../../Vendors/angular.min.js" />
/// <reference path="../../Vendors/jquery-2.1.3.min.js" />
/// <reference path="../../Scripts/angular/services.js" />
/// <reference path="~/Vendors/amplify.min.js" />
var app = angular.module('MobileApp', [
    'ngRoute',
    'services.appconstant',
    'services.global',
    'services.tip',
    'directives.barCalendar',

    'services.user',
    'services.message',
    'services.tweet',
    'services.tag',
    'services.skill',
    'services.comment',
    'services.search',

    'services.reserve',
    'mobile.routes'
]);
app.factory('MobileSvc', function () {
    var service = {
        changeTitle: function (title, base) {
            document.title = title + (base || ' - 丝路');
        },
        breadcrumb: []
    };
    return service;

});
app.factory('MobileMessageSvc', function (MessageSvc) {

    var service = {
        UnreadCount: 0,
        refresh: function () {
            MessageSvc.getUnreadCount().then(function (rep) {
                service.UnreadCount = rep.data;
            });
        }
    };
    return service;
});
app.factory('MobileUserSvc', function ($http, AppConstant, UserSvc, MobileMessageSvc) {
    var getApi = function (method) {
        return '/ApiV1/User/' + method;
    };
    var service = {
        isLogin: false,
        user: {},
        refresh: function () {
            var promise = $http({
                method: 'get',
                url: getApi('Current')
            });
            promise.then(function (rep) {
                if (rep.data) {
                    if (rep.data.Success) {
                        service.isLogin = true;
                        service.user = rep.data.Result;
                        return promise;
                    }
                }
                service.isLogin = false;
                service.user = {};
            });
            return promise;
        },
        update: function () {
            var promise = UserSvc.update(this.user);
            return promise;
        },
        signOut: function () {
            var promise = UserSvc.logout();
            promise.then(function (rep) {
                service.isLogin = false;
                service.user = {};
            });
            return promise;
        },
        signIn: function (userCode, passWord) {
            var promise = UserSvc.login(userCode, passWord);
            promise.then(function (rep) {
                MobileMessageSvc.refresh();

                if (rep.data && rep.data.Success) {
                    //$location.path('/user/' + $scope.main.user.UserCode);
                    service.refresh();
                } else {
                    service.isLogin = false;
                }
            }, function () {
                service.isLogin = false;
            });
            return promise;
        },
        signUp: function (entity) {
            var promise = UserSvc.register(entity);
            return promise;
        },
        checkIsBarber: function (userCode, trueCallback, falseCallback) {
            $http({
                method: 'get',
                url: getApi('IsBarber') + '/' + userCode
            }).then(function (rep) {
                if (rep.data) {
                    trueCallback();
                } else {
                    falseCallback();
                }
            }, function () {
                falseCallback();
            });
        },
        tempUserCode: ''
    };
    return service;
});

app.controller('BodyCtrl', function ($scope, $rootScope, $location, TipSvc, AppConstant, MobileUserSvc, MobileMessageSvc, MobileSvc, $interval) {
    $scope.Body = {
        User: MobileUserSvc,
        Message: MobileMessageSvc,
        Mobile: MobileSvc,
        Constant: AppConstant
    };
    MobileUserSvc.refresh();

    $rootScope.$on('$routeChangeSuccess', function (e, route) {
        TipSvc.toHide();

        var url = $location.path();
        var matched = true;
        switch (url) {
            case '/': (function () {
                MobileSvc.changeTitle('首页');
                MobileSvc.breadcrumb = [{ text: '首页', href: '#/' }];
            })(); break;
            case '/sign/Login':
                (function () {
                    MobileSvc.changeTitle('登陆');
                    MobileSvc.breadcrumb = [{ text: '首页', href: '#/' }, { text: '登陆' }];
                })(); break;
            case '/sign/User':
                (function () {
                    MobileSvc.changeTitle('普通用户注册');
                    MobileSvc.breadcrumb = [{ text: '首页', href: '#/' }, { text: '注册' }];
                })();
                break;
            case '/sign/Barber':
                (function () {
                    MobileSvc.changeTitle('理发师注册');
                    MobileSvc.breadcrumb = [{ text: '首页', href: '#/' }, { text: '注册' }];
                })();
                break;
            case '/user':
                (function () {
                    MobileSvc.changeTitle('个人主页');
                    MobileSvc.breadcrumb = [{ text: '首页', href: '#/' }, { text: '个人主页' }];
                })();
                break;
            case '/message':
                (function () {
                    MobileSvc.changeTitle('消息中心');
                    MobileSvc.breadcrumb = [{ text: '首页', href: '#/' }, { text: '个人主页', href: '#/user' }, { text: '消息中心' }];
                })();
            case '/profile/update':
                (function () {
                    MobileSvc.changeTitle('个人资料更新');
                    MobileSvc.breadcrumb = [{ text: '首页', href: '#/' }, { text: '个人主页', href: '#/user' }, { text: '个人资料更新' }];
                })();
                break;
            default:
                matched = false;
        }
        if (matched === false) {
            if (url.indexOf('/person/') == 0) {
                MobileSvc.changeTitle('用户主页');
                MobileSvc.breadcrumb = [{ text: '首页', href: '#/' }, { text: '个人主页' }];
            }
        }
    });

    var refreshMessage = undefined;
    $scope.$watch('Body.User.isLogin', function (newVal, oldVal) {
        if (newVal != oldVal) {
            if (newVal) {
                refreshMessage = $interval(function() {
                    MobileMessageSvc.refresh();
                }, 5000);
            } else {
                $interval.cancel(refreshMessage);
            }
        }
    });
});
app.controller('HomeCtrl', function ($scope, TipSvc) {
    TipSvc.toTip('');
});

app.controller('UserCtrl', function ($scope, $location, MobileUserSvc) {
    if (!MobileUserSvc.isLogin) {
        $location.path('/');
    }
    MobileUserSvc.tempUserCode = MobileUserSvc.user.UserCode;
    $scope.main = {};
});
app.controller('PersonCtrl', function ($scope, $routeParams, MobileUserSvc, UserSvc) {
    MobileUserSvc.tempUserCode = $routeParams.id;
    $scope.main = {
        user: {}
    };
    UserSvc.get($routeParams.id).then(function (rep) {
        $scope.main.user = rep.data;
    });
});
app.controller('TweetCtrl', function ($scope, TweetSvc, CommentSvc, MobileUserSvc, MobileMessageSvc) {
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
                if (!p || p <= 0) { throw 'error page'; }

                return TweetSvc.getList(p, MobileUserSvc.tempUserCode).then(function (rep) {
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
                    MobileMessageSvc.refresh();
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
app.controller('ReserveCtrl', function ($scope, ReserveSvc, MobileUserSvc, MobileMessageSvc) {

    $scope.main = {
        userCode: MobileUserSvc.tempUserCode,
        showSubmit: MobileUserSvc.isLogin,
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
app.controller('SkillCtrl', function ($scope, SkillSvc, MobileUserSvc) {
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
    SkillSvc.getList(MobileUserSvc.tempUserCode).then(function (rep) {
        $scope.main.skills = rep.data;
    });
});
app.controller('TagCtrl', function ($scope, TagSvc, MobileUserSvc) {
    $scope.main = {
        tags: [],
        tag: { TagName: '' },
        submit: function () {
            var main = this;
            TagSvc.add(this.tag.TagName).then(function (rep) {
                main.tags.push(rep.data);
            });
            this.tag.TagName = '';
        },
        remove: function (index) {
            var removedTag = this.tags[index];
            TagSvc.remove(removedTag.Id).then(function (rep) {
                if (rep.data) {
                    $scope.main.tags.splice(index, 1);
                }
            });
        },
        refresh: function () {
            var main = this;
            TagSvc.getList(MobileUserSvc.tempUserCode).then(function (rep) {
                main.tags = rep.data;
            });
        }
    };
    $scope.main.refresh();
});
app.controller('SignCtrl', function ($scope, UserSvc, TipSvc, $location, $routeParams, MobileUserSvc) {

    $scope.main = {
        user: {
            UserCode: '',
            Password: '',
            Repeat: '',
            Name: '',
            Gender: 'male',
            Address: '',
            Age: '',
            Signature: '',
            UserType: 'User',
            Barberer: { ShopName: '' }
        },
        register: function () {
            MobileUserSvc.signUp(this.user).then(function (rep) {
                if (rep.data && rep.data.Success) {
                    TipSvc.toTip('注册成功, 正在登陆...');
                    $scope.main.login();
                } else {
                    TipSvc.toTip('注册失败');
                }
            });
        },
        login: function () {
            MobileUserSvc.signIn(this.user.UserCode, this.user.Password).then(function (rep) {
                if (rep.data && rep.data.Success) {
                    TipSvc.toTip('登陆成功，正在跳转...');
                    $location.path('/user');
                } else {
                    TipSvc.toTip('登陆失败.' + rep.data.Brief);
                }
            });
        }
    };
    $scope.main.user.UserType = $routeParams.mode;

});

app.controller('SignOutCtrl', function ($scope, MobileUserSvc) {

    $scope.main = {
        signOut: function () {
            MobileUserSvc.signOut();
        }
    };
});
app.controller('MessageCtrl', function ($scope, MobileMessageSvc, MessageSvc) {
    $scope.main = {
        mode: 'all',
        page: 1,
        pages: 1,
        total: 0,
        messages: [],
        load: function () {
            var main = this;

            var promise = undefined;
            if (this.mode == 'all') {
                promise = MessageSvc.getAll(this.page);
            }
            if (this.mode == 'read') {
                promise = MessageSvc.getList(this.page, true);
            }
            if (this.mode == 'unread') {
                promise = MessageSvc.getList(this.page, false);
            }
            if (promise === undefined) {
                throw 'error mode at MessageCtrl -> $scope.main.load()';
            }

            promise.then(function (rep) {
                main.messages = rep.data;
                main.pages = parseInt(rep.headers('X-Bar-Pages'));
                main.total = parseInt(rep.headers('X-Bar-Total'));
            });
        },
        setRead: function (index) {
            var message = this.messages[index];
            if (message.IsRead !== false) {
                throw 'message has been readed at MessageCtrl -> $scope.main.setRead()';
            }
            MessageSvc.setRead(message.Id).then(function (rep) {
                if (rep.data) {
                    message.IsRead = true;
                }
                MobileMessageSvc.refresh();
            });
        }
    };
    $scope.$watch('main.mode', function () {
        if ($scope.main.page != 1) {
            $scope.main.page = 1;
        } else {
            $scope.main.load();
        }
    });
    $scope.$watch('main.page', function () {
        $scope.main.load();
    });
});
app.controller('ProfileUpdateCtrl', function ($scope, $location, MobileUserSvc) {
    $scope.main = {
        submit: function () {
            MobileUserSvc.update().then(function (rep) {
                $location.path('/user');
            });
        }
    };
});
app.controller('SearchTagCtrl', function ($scope, SearchSvc) {
    $scope.main = {
        key: '',
        result: [],
        search: function () {
            var main = this;
            SearchSvc.searchTag(this.key, 1).then(function (rep) {
                main.result = rep.data;
                console.log(main);
            });
        }
    };
});
app.controller('TestCtrl', function ($scope) {
    $scope.greet = 'Hello, world.';
});