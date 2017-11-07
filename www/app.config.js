var app = angular.module("app", ["e5Anywhere", "e5AnywhereServices"])
    .constant('e5Config', {
        webApiSettingsBase: "http://e5demodev.cloudapp.net:88/api",
        webApiBase: "http://e5demodev.cloudapp.net:88/e5select/api",
        e5LegacyBase: "http://e5demodev.cloudapp.net/sites/e5select/"
    });

var g_workId = '1a29d552-263d-11e7-a2c4-00155d2aaa1d'; // Demo pages only!