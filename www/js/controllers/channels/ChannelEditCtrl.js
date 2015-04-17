/**
 * Minds::mobile
 * Channel Controller
 * 
 * @author Mark Harding
 */

define(function () {
    'use strict';

    function ctrl($rootScope, $scope, $state, $stateParams, Client, storage, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicLoading, $timeout, $window, $ionicModal, $ionicHistory, $ionicPopup) {

    	$scope.cb = Date.now();
    	
    	
     	Client.get('api/v1/channel/'+$stateParams.guid, {cb: $scope.cb}, 
    			function(success){
    				$scope.channel = success.channel;
    			},
    			function(error){
    			});
     	
     	$scope.update = function(){
     	
     		if(!$scope.channel.name){
     		
     			$ionicPopup.alert({
					title: 'Oooops...',
					template: "Your need a name!"
				});
     		
     			return false;
     		}
     	
     		Client.post('api/v1/channel/info', $scope.channel, 
        			function(success){
		     			$ionicLoading.show({
		    				template: '<i class="icon ion-checkmark-round" style="line-height:100px; vertical-align:middle; font-size:90px"></i>'
		    				});
		    			$timeout(function(){
		    				$ionicLoading.hide();
		    				}, 1000);
		    			$state.go('tab.newsfeed-channel', {username: 'me', refresh:true});
        			},
        			function(error){
        			});
     	};
     	
     	$scope.changeAvatar = function(){
     		
     		navigator.camera.getPicture(onSuccess, onFail, { 
     			quality: 50,
     		    destinationType: Camera.DestinationType.FILE_URI,
     		    sourceType : 0,
     		   correctOrientation: true
     		});

     		function onSuccess(imageData) {
     		    var image = document.getElementById('avatar');
     		    image.src = imageData;
     		    
     		    $ionicLoading.show({
    				template: 'Uploading...'
    				});
     		    
     		    var ft = new FileTransfer();
	   	        var options = new FileUploadOptions();
	   	        //options.httpMethod = 'PUT';
	   	        options.headers = {"Authorization": "Bearer " + storage.get('access_token') };
	   	        console.log(imageData);
	   	      	ft.upload(imageData, encodeURI($rootScope.node_url + 'api/v1/channel/avatar'), 
	   	      		function(success){
	   	      			$ionicLoading.hide();
			   	      $rootScope.globalCB = Date.now();
			   	      if($scope.modal)
			   	      	$scope.modal.remove();
	   	      		}, 
	   	      		function(error){
	   	      			$ionicLoading.hide();
	   	      			console.log('error');
	   	      			console.log(error);
	   	      		}, 
	   	      		options
	   	      		);

     		    
     		}

     		function onFail(message) {
     		    //alert('Failed because: ' + message);
     		}
     		
     	};
     	
     	
     	$scope.addBanner = function(){
     		
     		navigator.camera.getPicture(onSuccess, onFail, { 
     			quality: 50,
     		    destinationType: Camera.DestinationType.FILE_URI,
     		    sourceType : 0,
     		   correctOrientation: true
     		});

     		function onSuccess(imageData) {
     		    //var image = document.getElementById('avatar');
     		    //image.src = imageData;
     		    
     		    var ft = new FileTransfer();
	   	        var options = new FileUploadOptions();
	   	        //options.httpMethod = 'PUT';
	   	        options.headers = {"Authorization": "Bearer " + storage.get('access_token') };
	   	        console.log(imageData);
	   	      	ft.upload(imageData, encodeURI($rootScope.node_url + 'api/v1/channel/banner'), 
	   	      		function(success){
			   	      $rootScope.globalCB = Date.now();
	   	      		}, 
	   	      		function(error){
	   	      			console.log('error');
	   	      			console.log(error);
	   	      		}, 
	   	      		options
	   	      		);

     		    
     		}

     		function onFail(message) {
     		    //alert('Failed because: ' + message);
     		}
     		
     	};
     	
     	$scope.invite = function(){
     		$ionicModal.fromTemplateUrl('templates/invite/invite.html', {
	 		    scope: $scope,
	 		    animation: 'slide-in-up'
	 		  }).then(function(modal) {
	 		    $scope.modal = modal;
	 		    $scope.modal.show();
	 		  });
     	};
     	
     	$scope.logout = function(){
     	
     		Client.post('api/v1/logout', {}, function(){}, function(){});
     	
		  	storage.remove('loggedin');
		  	storage.remove('user_guid');
		  	storage.remove('access_token');
		  	storage.remove('private-key');
		  	storage.remove('push-token');
		  	
		  	ionic.Platform.exitApp();
		  	
		  	$ionicHistory.clearCache();
		  	$state.go('login');
		  	
		  	
		};
       
    }

    ctrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'Client', 'storage', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', '$ionicLoading', '$timeout', '$window', '$ionicModal', '$ionicHistory', '$ionicPopup'];
    return ctrl;
    
});