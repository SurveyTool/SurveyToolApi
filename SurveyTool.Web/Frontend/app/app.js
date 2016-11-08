var myapp = angular.module('MyApp',
    ['ngRoute',
        'ngMaterial',
        'ngMessages',
        'material.svgAssetsCache',
        'ngCookies',
        'ng-draggable-widgets',
        'nvd3'
    ]);
myapp.config(function ($mdThemingProvider) {
    var neonRedMap = $mdThemingProvider.extendPalette('red', {
        '500': '#ff0000',
        'contrastDefaultColor': 'dark'
    });
    // Register the new color palette map with the name <code>neonRed</code>
    $mdThemingProvider.definePalette('neonRed', neonRedMap);
    // Use that theme for the primary intentions
    $mdThemingProvider.theme('default')
      .primaryPalette('neonRed');
    $mdThemingProvider.definePalette('amazingPaletteName', {
        '50': 'ffebee',
        '100': 'ffcdd2',
        '200': 'ef9a9a',
        '300': 'e57373',
        '400': '629c44',
        '500': 'f44336',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50', '100',
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined
    });
    $mdThemingProvider.theme('default')
       .primaryPalette('amazingPaletteName', {
           'default': '400',
           'hue-1': '100',
           'hue-2': '600',
           'hue-3': 'A100'
       })

});