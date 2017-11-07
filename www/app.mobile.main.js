// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady() {
    var parentElement = document.getElementById('deviceready');
    var listeningElement = parentElement.querySelector('.listening');
    listeningElement.setAttribute('style', 'display:none;');

    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.info("Overriding default back button");

        //Unlock the work item 
        if (angular.element('[ng-controller=ctrl]').scope().showMediaButtons)
            angular.element('[ng-controller=ctrl]').scope().UnlockWorkItem();

        angular.element('[ng-controller=ctrl]').scope().showMediaButtons = false;
        angular.element('[ng-controller=ctrl]').scope().workId = "";
        //angular.element('[ng-controller=ctrl]').workitemdata.workId = "";

        angular.element('[ng-controller=ctrl]').scope().$apply();

        console.info("$scope.showMediaButtons set to: " + angular.element('[ng-controller=ctrl]').scope().showMediaButtons);

    }, false);
}

app.controller("ctrl", ctrl);
ctrl.$inject = ['$scope', '$rootScope', '$http', '$location', 'taskdata', 'workitemdata', 'attachmentdata', 'e5SearchService', 'ngToast', '$translate', '$element', '$attrs', 'e5Endpoints', 'FileUploader'];
function ctrl($scope, $rootScope, $http, $location, taskdata, workitemdata, attachmentdata, e5SearchService, ngToast, $translate, $element, $attrs, endpoints, FileUploader) {

    //1 - Create work item (with properties)
    var vm = this;
    $scope.showMediaButtons = false;
    $scope.classification = {
        "category1Id": "1",
        "category2Id": "1",
        "category3Id": "1"
    };

    $scope.fieldValues = '{"Priority":1}'
    vm.json = {};

    $scope.onCreateWorkItem = function () {
        workitemdata.create($scope.classification.category1Id, $scope.classification.category2Id, $scope.classification.category3Id, $scope.fieldValues).then(
            function (response) {
                $scope.workId = response.data.id;
                $scope.workReference = response.data.reference;
                workitemdata.workId = response.data.id;
                $scope.showMediaButtons = true;

                //Start polling for specific NextDueTask
                pollSearchService(response.data.reference);

            }, function (response) {
                console.error("Error creating claim: " + JSON.stringify(response.data))
                alert("Error creating claim");
            })
            .finally(function () {
            });
    }

    $scope.UnlockWorkItem = function () {
        if (!$scope.workId)
            return;

        workitemdata.unlock($scope.workId).then(
            function (response) {

            }, function (response) {
                console.error("Error unlocking work item: " + JSON.stringify(response.data))
            })
            .finally(function () {
            });
    }


    // ---- Poll for specific next due task ---- //
    function alertDismissed() {
        clearInterval($scope.searchInterval);
    }

    function pollSearchService(reference) {
        $scope.searchNextDueOptions = {
            findClassId: 1,
            page: 0,
            pageSize: 1,
            includeArchives: false,
            includeAttachmentCount: false,
            includeNextDueTask: true,
            includeSLA: false,
            select: "_NextDueTask,Reference",
            orderBy: "",
            filterBy: { "filters": [{ "field": "Reference", "value": reference }] } //It would be better to filter by workId
        };

        var stopInterval = false;
        $scope.searchInterval = setInterval(function () {
            e5SearchService.searchWorkItems($scope.searchNextDueOptions)
                .then(function (response) { // Ok
                    if (response.data.results[0]._NextDueTask == "Create Supplier Instruction") {
                        if (stopInterval) return; //Make sure the notification doesn't fire twice

                        stopInterval = true;
                        clearInterval($scope.searchInterval);
                        console.info('Create Supplier Instruction. ' + response.data.results[0]._NextDueTask);
                        //Refresh the task component
                        workitemdata.workId = "";
                        $scope.showMediaButtons = false;

                        history.go(-1);
                        navigator.app.backHistory();

                        navigator.notification.alert(
                            'Thank you for submitting your claim, reference ' + response.data.results[0].Reference,  // message
                            alertDismissed,         // callback
                            'Claim Sumbitted',            // title
                            'Ok'                  // buttonName
                        );

                        //Show the correct view
                        $scope.showMediaButtons = false;
                    }

                }, function (response) { // Error

                });
        }, 2000);
    }



    // ---- Photo or File Upload ---- //
    $scope.capturePhoto = function () {
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPhotoURISuccessData, onFail, {
            quality: 30,
            destinationType: navigator.camera.DestinationType.DATA_URL
            //destinationType: destinationType.FILE_URI
            //destinationType: destinationType.DATA_URL
        });
    }

    $scope.getPhotoFromLibrary = function () {
        // Retrieve image file location from specified source
        navigator.camera.getPicture(onPhotoURISuccessData, onFail, {
            quality: 30,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });
    }

    // Called when a photo is successfully retrieved
    function onPhotoURISuccessData(data) {

        console.info("Trying to upload photo");

        var jsonData = {
            "FileName": "MobileClaim_" + $scope.workReference + ".jpeg",
            "FileBase64": data
        }

        $http.post(String.format(endpoints.attachmentAddBase64Route, $scope.workId), jsonData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        }).then(
            function (response) {
                var img = $('<div class="imgContainer"><span class="imgStatus fa fa-check"><img class="imgPreview" src="data:image/jpeg;base64,' + data + '" /></span></div>');
                $('#photoPreview').append(img);

                console.info('success!!');
                console.info('response: ' + JSON.stringify(response));
            }, function (error) {
                var img = $('<div class="imgContainer"><span class="imgStatus fa fa-chain-broken"><img class="imgPreview" src="data:image/jpeg;base64,' + data + '" /></span></div>');
                $('#photoPreview').append(img);

                console.error('error: ' + JSON.stringify(error));
            });

    }

    // Called if something bad happens.
    function onFail(message) {
        alert('Failed because: ' + message);
    }


    // ---- Search for Claim History ---- //

    $scope.searchOptions = {
        findClassId: 1,
        pageSize: 5,
        includeArchives: false,
        includeAttachmentCount: false,
        includeNextDueTask: true,
        includeSLA: false,
        select: "Status_Id,Reference,_NextDueTask",
        orderBy: "-CreationDate",
        filterBy: { "filters": [{ "field": "Category3_id", "value": "1" }] } //Should filter on the Client
    };

    $scope.onOpen = function (data) {
        console.info("onOpen:" + JSON.stringify(data));
        workitemdata.workId = data.id;
        $scope.workId = data.id;
        $scope.showMediaButtons = true; //Change the view to the Claim Details
    }

    $scope.onAttachment = function (data) {
        console.info("onAttachment:" + JSON.stringify(data));
    }

};