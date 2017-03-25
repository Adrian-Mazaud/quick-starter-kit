var Vue = require('vue');
var App = require('./app.vue');

window.app = new Vue({
    el: '#app',
    render: function (createElement) {
        return createElement(App)
    }
})

console.log(app)
