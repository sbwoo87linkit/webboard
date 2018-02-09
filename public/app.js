var interceptor = function ($q, $location) {
	return {
		request: function (config) {
			// console.log(config)
			return config
		},

		response: function (result) {
			// console.log(result)
			return result
		},

		responseError: function (rejection) {
			console.log('Failed with', rejection.status, 'status')
			if (rejection.status == 401 || rejection.status == 403) {
				$location.url('/login')
			}
			return $q.reject(rejection)
		}
	}
}

var app = angular.module('app', ['ui.router', 'ngSanitize', 'satellizer',
	'toastr', 'ngAnimate', 'ngDisqus', 'bw.paging', 'cp.ngConfirm', 'summernote'
]);

app.constant('config', {
	appName: 'My App',
	appVersion: 1.0,
	// apiUrl: 'http://127.0.0.1:1337',
	apiUrl: 'http://ec2-13-125-112-144.ap-northeast-2.compute.amazonaws.com',
});

app.filter('filename', function () {
	return function (str) {
		var str = str.replace(str.substring(str.lastIndexOf('-'), str.lastIndexOf('.')), '')
		return str.replace('/files/', '');
	};
});

app.config(function ($httpProvider, toastrConfig) {
	$httpProvider.interceptors.push(interceptor);

	$httpProvider.defaults.cache = false;
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}
	// disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
})

app.config(function ($stateProvider, $urlRouterProvider, $authProvider, $locationProvider, $disqusProvider) {

	$disqusProvider.setShortname('sdsnkoreaorg'); // Configure the disqus shortname
	$locationProvider.hashPrefix('!'); // Disqus needs hashbang in urls. If you are using pushstate then no need for this.

	$urlRouterProvider.otherwise('/home');

	$stateProvider

		.state('home', {
			url: '/home',
			templateUrl: 'pages/home/home.html',
			controller: 'home.ctrl'
		})
		// .state('home1', {
		// 	url: '/home1',
		// 	templateUrl: 'pages/home/home1.html',
		// 	controller: 'home.ctrl'
		// })

		.state('login', {
			url: '/login',
			templateUrl: 'pages/auth/login.html',
			controller: 'login.ctrl'
		})

		.state('signup', {
			url: '/signup',
			templateUrl: 'pages/auth/signup.html',
			controller: 'signup.ctrl'
		})

		// ABOUT
		// MLRN ? VISION & GOAL    CONTACT

		.state('about', {
			abstract: true,
			url: '/about',
			templateUrl: 'pages/about/about.html'
		})

		.state('about.mlrn', {
			url: '/mlrn',
			templateUrl: 'pages/about/about.mlrn.html'
		})
		.state('about.visionandgoal', {
			url: '/visionandgoal',
			templateUrl: 'pages/about/about.visionandgoal.html'
		})
		.state('about.contact', {
			url: '/contact',
			templateUrl: 'pages/about/about.contact.html'
		})



		// NETWORK
		// MEMBER   PARTNER  By PROGRAM   JOIN US
		.state('network', {
			url: '/network',
			templateUrl: 'pages/network/network.html'
		})
		.state('network.member', {
			url: '/member',
			templateUrl: 'pages/network/network.member.html',
		})
		.state('network.partner', {
			url: '/partner',
			templateUrl: 'pages/network/network.partner.html',
		})
		.state('network.program', {
			url: '/program',
			templateUrl: 'pages/network/network.program.html',
		})
		.state('network.joinus', {
			url: '/joinus',
			templateUrl: 'pages/network/network.joinus.html',
		})


		// FOCUS
		// WFE NEXUS    THEMATIC GROUP
		.state('focus', {
			url: '/focus',
			templateUrl: 'pages/focus/focus.html'
		})
		.state('focus.wfenexus', {
			url: '/wfenexus',
			templateUrl: 'pages/focus/focus.wfenexus.html',
		})
		.state('focus.thematicgroup', {
			url: '/thematicgroup',
			templateUrl: 'pages/focus/focus.thematicgroup.html',
		})

		// MLR INFO
		// MLR INFO    ISSUE BRIEF
		.state('mlrinfo', {
			url: '/mlrinfo',
			templateUrl: 'pages/mlrinfo/mlrinfo.html'
		})
		.state('mlrinfo.mlrinfo', {
			url: '/mlrinfo',
			templateUrl: 'pages/mlrinfo/mlrinfo.mlrinfo.html',
		})
		.state('mlrinfo.issuebrief', {
			url: '/issuebrief',
			templateUrl: 'pages/mlrinfo/mlrinfo.issuebrief.html',
		})
		// RESOURCES
		// REPORTS    MATERIALS

		// NEWS
		// NOTICE    MLRN ACTIVITES


		.state('board', {
			abstract: true,
			url: '/board?main_menu&sub_menu&title&board_type',
			templateUrl: 'pages/board/board.html',
			// controller: 'board.ctrl'
		})
		.state('board.list', {
			url: '/list',
			templateUrl: 'pages/board/list.html',
			controller: 'board.list.ctrl',
			// params : {boardType: 'board'}
		})
		.state('board.create', {
			url: '/create',
			templateUrl: 'pages/board/create.html',
			controller: 'board.create.ctrl'
		})
		.state('board.view', {
			url: '/view/:articleId',
			templateUrl: 'pages/board/view.html',
			controller: 'board.view.ctrl'
		})
		.state('board.edit', {
			url: '/edit/:articleId',
			templateUrl: 'pages/board/edit.html',
			controller: 'board.edit.ctrl'
		})

		// .state('join', {
		// 	url: '/join',
		// 	templateUrl: 'pages/join/join.html'
		// })
		// .state('join.new', {
		// 	url: '/new',
		// 	templateUrl: 'pages/join/join.new.html',
		// 	controller: 'join.new.ctrl'
		// })
		// .state('join.list', {
		// 	url: '/list',
		// 	templateUrl: 'pages/join/join.list.html',
		// 	controller: 'join.list.ctrl'
		// })


	$authProvider.httpInterceptor = function ($auth) {
		return true;
	};
	$authProvider.withCredentials = false;
	$authProvider.tokenRoot = null;
	$authProvider.baseUrl = '/';
	$authProvider.loginUrl = 'sessions/create'; //'/users/login';
	$authProvider.signupUrl = '/users';
	$authProvider.unlinkUrl = '/auth/unlink/';
	$authProvider.tokenName = 'id_token';
	$authProvider.tokenPrefix = 'satellizer';
	$authProvider.tokenHeader = 'Authorization';
	$authProvider.tokenType = 'Bearer';
	$authProvider.storageType = 'localStorage';


	/**
	 * Helper auth functions
	 */
	var skipIfLoggedIn = function ($q, $auth) {
		var deferred = $q.defer();
		if ($auth.isAuthenticated()) {
			deferred.reject();
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	};

	var loginRequired = function ($q, $location, $auth) {
		var deferred = $q.defer();
		if ($auth.isAuthenticated()) {
			deferred.resolve();
		} else {
			$location.path('/login');
		}
		return deferred.promise;
	};


});













// For Component users, it should look like this:
// var app = angular.module('app', [require('angular-ui-router')]);
app.run(function ($rootScope, $state, $stateParams, $http, $window, $auth) {

	$rootScope.user = JSON.parse($window.localStorage.getItem('token'))
	// console.log($rootScope.user)

	$rootScope.$stateParams = $stateParams
	$rootScope.$state = $state


	Date.prototype.yyyymmdd = function () {
		var yyyy = this.getFullYear().toString();
		var mm = (this.getMonth() + 1).toString();
		var dd = this.getDate().toString();
		return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);
	}


	$rootScope.$on('$stateChangeStart',
		function (event, toState) {
			// var requiredLogin = false;

			// requiredLogin: true, requiredAdmin: true}
			if (toState.data && toState.data.requiredLogin && toState.data.requiredAdmin) {
				// console.log(' >>>>>>>>>>>>>>> requiredAdmin ... but not admin ... got logoin')
				// console.log($rootScope.user)

				if ($rootScope.user && $rootScope.user.role != 'admin') {
					// Required !!!!!!
					event.preventDefault();
					$state.go('login');
				}
			}

			// console.log('###############  ', toState.data.requiredLogin)
			// if (toState.data && toState.data.requiredLogin) {
			// 	//$location.path();
			// 	console.log($location.path())
			// 	$rootScope.redirectUrl = $location.path()
			// 	requiredLogin = true;
			// }
			//
			// // if yes and if this user is not logged in, redirect him to login page
			// if (requiredLogin && !$auth.isAuthenticated()) {
			// 	event.preventDefault();
			// 	$state.go('app.login');
			// }


		});

	$rootScope.$on('$stateChangeSuccess', function () {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	});








})

app.directive('fileUpload', function () {
	return {
		scope: true, //create a new scope
		link: function (scope, el, attrs) {
			el.bind('change', function (event) {
				var files = event.target.files;
				//iterate files since 'multiple' may be specified on the element
				for (var i = 0; i < files.length; i++) {
					//emit event upward
					scope.$emit('fileSelected', {
						file: files[i]
					});
				}
			});
		}
	};
});


app.directive('uiSrefActiveIf', ['$state', function ($state) {
	return {
		restrict: 'A',
		controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
			var state = $attrs.uiSrefActiveIf;

			function update() {
				if ($state.includes(state) || $state.is(state)) {
					$element.addClass('active');
				} else {
					$element.removeClass('active');
				}
			}

			$scope.$on('$stateChangeSuccess', update);
			update();
		}]
	};
}])

app.directive('bsTooltip', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			$(element).hover(function () {
				// on mouseenter
				$(element).tooltip('show');
			}, function () {
				// on mouseleave
				$(element).tooltip('hide');
			});
		}
	};
});


app.directive('dirDisqus', ['$window', function ($window) {

	return {
		restrict: 'E',
		scope: {
			config: '='
		},
		template: `<div id='disqus_thread'></div><a href='http://disqus.com' class='dsq-brlink'></a>`,
		link: function (scope) {

			scope.$watch('config', configChanged, true);

			function configChanged() {

				// Ensure that the disqus_identifier and disqus_url are both set, otherwise we will run in to identifier conflicts when using URLs with '#' in them
				// see http://help.disqus.com/customer/portal/articles/662547-why-are-the-same-comments-showing-up-on-multiple-pages-
				if (!scope.config.disqus_shortname ||
					!scope.config.disqus_identifier ||
					!scope.config.disqus_url) {
					return;
				}

				$window.disqus_shortname = scope.config.disqus_shortname;
				$window.disqus_identifier = scope.config.disqus_identifier;
				$window.disqus_url = scope.config.disqus_url;
				$window.disqus_title = scope.config.disqus_title;
				$window.disqus_category_id = scope.config.disqus_category_id;
				$window.disqus_disable_mobile = scope.config.disqus_disable_mobile;
				$window.disqus_config = function () {
					this.language = scope.config.disqus_config_language;
					this.page.remote_auth_s3 = scope.config.disqus_remote_auth_s3;
					this.page.api_key = scope.config.disqus_api_key;
					if (scope.config.disqus_on_ready) {
						this.callbacks.onReady = [function () {
							scope.config.disqus_on_ready();
						}];
					}
				};

				// Get the remote Disqus script and insert it into the DOM, but only if it not already loaded (as that will cause warnings)
				if (!$window.DISQUS) {
					var dsq = document.createElement('script');
					dsq.type = 'text/javascript';
					dsq.async = true;
					dsq.src = '//' + scope.config.disqus_shortname + '.disqus.com/embed.js';
					(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
				} else {
					$window.DISQUS.reset({
						reload: true,
						config: function () {
							this.page.identifier = scope.config.disqus_identifier;
							this.page.url = scope.config.disqus_url;
							this.page.title = scope.config.disqus_title;
							this.language = scope.config.disqus_config_language;
							this.page.remote_auth_s3 = scope.config.disqus_remote_auth_s3;
							this.page.api_key = scope.config.disqus_api_key;
						}
					});
				}
			}
		}
	};


}])

app.controller('ModalController', function ($scope, close) {

	$scope.close = function (result) {
		close(result, 500); // close, but give 500ms for bootstrap to animate
	};

});