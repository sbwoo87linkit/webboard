app.constant('config', {
    appName: 'My App',
    appVersion: 1.0,
    // appTitle: 'Mid-Latitude Region Network',
    email: 'mlrn_korea@korea.ac.kr',
    address: '(02841) #L502 Life and Science West Bldg, Korea University, Anam-ro 145, Seoul, KOREA',
    appTitle: 'Web Board v1.0',
    apiUrl: 'http://127.0.0.1:1337',
    // apiUrl: 'http://ec2-13-125-112-144.ap-northeast-2.compute.amazonaws.com',
    menuArray: [
    //     {
    //     name: 'home',
    //     activeIndex: 0,
    //     list: [
    //         {
    //             name : 'home',
    //             type: 'static',
    //             templateUrl: 'pages/home/home.html',
    //             controller: 'home.ctrl as vm'
    //         },
    //     ]
    // },
    {
        name: 'about',
        activeIndex: 0,
        list: [
            {
                name: 'mlrn',
                mode: 'page',
            },
            {
                name: 'vision',
                mode: 'page',
            },
            {
                name: 'contact',
                mode: 'page',
            },
        ]
    },
        {
            name: 'network',
            activeIndex: 0,
            list: [
                {
                    name: 'member',
                    mode: 'page',
                },
                {
                    name: 'partner',
                    mode: 'page',
                },
                {
                    name: 'by program',
                    mode: 'page',
                },
                {
                    name: 'join us',
                    mode: 'page',
                },
            ]
        },

        {
            name: 'focus',
            activeIndex: 0,
            list: [
                {
                    name: 'wfe nexus',
                    mode: 'page',
                },
                {
                    name: 'thematic group',
                    mode: 'page',
                },
            ]
        },

        {
            name: 'mlr info',
            activeIndex: 0,
            list: [
                {
                    name: 'mlr info',
                    mode: 'page',
                },
                {
                    name: 'issue brief',
                    mode: 'page',
                },
            ]
        },


     // ABOUT // MLRN ? VISION & GOAL CONTACT 
     // NETWORK // MEMBER PARTNER By PROGRAM JOIN US
     // FOCUS // WFE NEXUS THEMATIC GROUP
     // MLR INFO // MLR INFO ISSUE BRIEF

    {
            name: 'resources',
            activeIndex: 0,
            list: [
                {
                    name: 'reports',
                    mode: 'board',
                },
                {
                    name: 'materials',
                    mode: 'board',
                },
            ]

        },

        {
            name: 'news',
            activeIndex: 0,
            list: [
                {
                    name: 'notice',
                    mode: 'board',
                },
                {
                    name: 'mlrn activities',
                    mode: 'board',
                },
            ]

        },

    ],
    // menuObject: {
    //     'about': {
    //         'mlrn': {
    //             'board_type': 'static',
    //             'template_url': 'pages/about/about.mlrn.html',
    //         },
    //         'vision': {
    //             'board_type': 'static',
    //             'template_url': 'pages/about/about.visionandgoal.html',
    //         },
    //     },
    //     'home': {
    //         'home': {
    //             'board_type': 'static',
    //             'template_url': 'pages/home/home.html',
    //         },
    //     },

    // },
    // menu: {
    //     // name: 'mlrn', collection : {main_menu:'about', board_type:'static'}
    //     'mlrn': {
    //         // 'main_menu': 'about',
    //         'board_type': 'static',
    //         'template_url': 'pages/about/about.mlrn.html',
    //     },
    //     'contents': {
    //         // 'main_menu': 'about',
    //         'board_type': 'contents'
    //     },
    //     'reports': {
    //         // 'main_menu': 'about',
    //         'board_type': 'gallary'
    //     },
    //     'materials': {
    //         // 'main_menu': 'about',
    //         'board_type': 'gallary'
    //     },
    // }
});
