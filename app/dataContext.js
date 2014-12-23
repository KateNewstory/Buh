define(['Q', 'durandal/system', 'plugins/http', 'userContext'], function (Q, system, http, userContext) {


    return {
        add:add,
        update:update,
        getById:getById,
        getList:getList,
        remove: remove
    }

    function add(table, data) {
        var dfd = Q.defer();

        var url = 'https://api.parse.com/1/classes/' + table + '/';
        var headers = {
            "X-Parse-Application-Id":"WeRcYiOoebRX7toTNXDxpLBdgUF0lbR4kHrRpIXe",
            "X-Parse-REST-API-Key":"WUZssJuNnh10Wq9A1DJ2Y2MB6AvCyXPQuCOhO6BX"
        }

        if (userContext.session) {
            var acl = {};
            acl[userContext.session.objectId] = {
                "read":true,
                "write":true
            };
            data.ACL = acl;
        }

        http.post(url, data, headers)
            .done(function () {
                dfd.resolve();
            })
            .fail(function () {
                dfd.reject();
            });

        return dfd.promise;
    }

    function remove (table, id) {
        var dfd = Q.defer();

        var url = 'https://api.parse.com/1/classes/' + table + '/'+id;
        var headers = {
            "X-Parse-Application-Id":"WeRcYiOoebRX7toTNXDxpLBdgUF0lbR4kHrRpIXe",
            "X-Parse-REST-API-Key":"WUZssJuNnh10Wq9A1DJ2Y2MB6AvCyXPQuCOhO6BX"
        }

        if (userContext.session) {
            headers["X-Parse-Session-Token"] = userContext.session.sessionToken;
        }

        http.remove(url, {}, headers)
            .done(function () {
                dfd.resolve();
            })
            .fail(function () {
                dfd.reject();
            });

        return dfd.promise;
    }

    function update(table, data) {
        var dfd = Q.defer();

        var url = 'https://api.parse.com/1/classes/' + table + '/' + data.objectId;
        var headers = {
            "X-Parse-Application-Id":"WeRcYiOoebRX7toTNXDxpLBdgUF0lbR4kHrRpIXe",
            "X-Parse-REST-API-Key":"WUZssJuNnh10Wq9A1DJ2Y2MB6AvCyXPQuCOhO6BX"
        }

        if (userContext.session) {
            headers["X-Parse-Session-Token"] = userContext.session.sessionToken;
        }

        http.put(url, data, headers)
            .done(function () {
                dfd.resolve();
            })
            .fail(function () {
                dfd.reject();
            });

        return dfd.promise;
    }

    function getById(table, id) {
        var dfd = Q.defer();

        var url = 'https://api.parse.com/1/classes/' + table + '/' + id;
        var headers = {
            "X-Parse-Application-Id":"WeRcYiOoebRX7toTNXDxpLBdgUF0lbR4kHrRpIXe",
            "X-Parse-REST-API-Key":"WUZssJuNnh10Wq9A1DJ2Y2MB6AvCyXPQuCOhO6BX"
        }

        if (userContext.session) {
            headers["X-Parse-Session-Token"] = userContext.session.sessionToken;
        }

        http.get(url, {}, headers)
            .done(function (response) {
                if (response) {
                    dfd.resolve(response);
                } else {
                    dfd.reject();
                }
            })
            .fail(function () {
                dfd.reject();
            });

        return dfd.promise;
    }

    function getList(table, queryParam) {
        if(!queryParam) {
            queryParam = {'order':'-createdAt'}
        }
        var dfd = Q.defer();
        var url = 'https://api.parse.com/1/classes/' + table + '/';
        var headers = {
            "X-Parse-Application-Id":"WeRcYiOoebRX7toTNXDxpLBdgUF0lbR4kHrRpIXe",
            "X-Parse-REST-API-Key":"WUZssJuNnh10Wq9A1DJ2Y2MB6AvCyXPQuCOhO6BX"
        }

        if (userContext.session) {
            headers["X-Parse-Session-Token"] = userContext.session.sessionToken;
        }

        http.get(url,queryParam, headers)
            .done(function (response) {
                if (response) {
                    dfd.resolve(response.results || []);
                } else {
                    dfd.reject();
                }
            })
            .fail(function () {
                dfd.reject();
            });

        return dfd.promise;
    }

})