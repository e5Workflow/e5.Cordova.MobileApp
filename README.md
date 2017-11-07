# e5.Cordova.MobileApp
Example of an Cordova Mobile app that leverage the e5 Anywhere Angular Components

### Include the components in the index.html file:
```html
<div class="container-fluid" role="main" ng-app="app" ng-controller="ctrl">

        <toast></toast>

        <form class="form-horizontal small col-sm-9">
            <div ng-if="!showMediaButtons" class="form-group">
                <button class="k-button k-primary MobileButton" ng-click="onCreateWorkItem()"><span class="buttonIcon fa fa-chevron-circle-right"></span>Create New Claim</button>
                <h4>Claim History</h4>
                <e5-search options="searchOptions" on-open="onOpen($data)" on-attachment="onAttachment($data)"></e5-search>
            </div>

            <div ng-if="showMediaButtons" class="form-group">
                <button class="k-button k-primary MobileButton" ng-click="capturePhoto();"><span class="buttonIcon fa fa-camera-retro"></span><span class="buttonText">Take a Photo</span></button>
                <br /><br /><button class="k-button k-primary MobileButton" ng-click="getPhotoFromLibrary();"><span class="buttonIcon fa fa-paperclip"></span><span class="buttonText">Add Photo from Library</span></button>
                <br /><br /><e5-task ng-if="showMediaButtons" showclassification="false"></e5-task>
                <div id="photoPreview"></div>
            </div>
        </form>

    </div>
```

### All the mobile application logic is contained in this javascript file:
[app.mobile.main.js](../master/www/app.mobile.main.js)
