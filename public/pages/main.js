app.controller('main.ctrl', function ($scope, userService, appContextService, toastr, config) {

    var vm = this;
    vm.appContext = appContextService.context;
    vm.appContext.appTitle = config.appTitle;
    vm.appContext.email = config.email;
    vm.appContext.address = config.address;
    vm.appContext.apiUrl = config.apiUrl;

    // console.log('config', config)
    vm.appContext.menuArray = config.menuArray;

    userService.list().then(function(res){
        vm.appContext.users = res.data;
        if (!res.data.length) {
            toastr.info('ctrl. No admin users are registered.')
        }
    });

    vm.appContext.styleName = 'green.theme.css';

    vm.changeStyle = function (styleName) {
        vm.appContext.styleName = styleName + '.css';
    };

})


