/*global define*/

define(['angular', 'JSEncrypt'], function (angular, JSEncrypt) {
    "use strict";

    var directive = function ($rootScope, $filter, storage) {
	  	return {
       		restrict: 'E',
			template: "<p>{{message}}</p>",
			replace: true,
			scope: true,
			link: function(scope, element, attrs) {
				//console.log(attrs.message);
				scope.message = attrs.message;
				
				crypt.setPrivateKey(storage.get('private-key'));
				
				crypt.decrypt(attrs.message, function(success){
		    			scope.message = success;
				});

			      
			}
       	 };
    };

    directive.$inject = ['$rootScope', '$filter', 'storage'];
    return directive;
});