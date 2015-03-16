/// <reference path="../../Vendors/angular.min.js" />

angular.module('services.comment', ['services.tweet'])
    .factory('CommentSvc', function ($http, TweetSvc, AppConstant) {
        var service = {

            getApi: function (append) {
                return AppConstant.getApi({
                    url: '/Api/Comment',
                    params: append
                });
            },
        
            getList: function (tweetId) {
                return TweetSvc.get(tweetId);
            },
            add: function (entity) {
                //var entity = { TweetId: tweetId, Content: content };
                var promise = $http({
                    method: 'PUT',
                    url: this.getApi(),
                    data: entity
                });
                return promise;
            },
         
            remove: function (id) {
                var promise = $http({
                    method: 'delete',
                    url: this.getApi(id)
                });
                return promise;
            }
        };
        return service;
    });
