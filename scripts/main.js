define('modernizr', function() { return Modernizr; });
define('window', function() { return window; });
define('zquery', function() { return $; });
require.config({baseUrl:"/scripts"})
require(['menu']);
