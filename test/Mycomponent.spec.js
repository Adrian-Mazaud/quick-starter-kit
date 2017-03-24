// var MyComponent = require('../dev/app/app.js');
require('../dev/app/app.js');


describe('MyComponent in app.js', function(){
    it('should as corret property type', function(){
        expect(typeof MyComponent.msg).toBe('string')
    })
});


// also see example testing a component with mocks at
// https://github.com/vuejs/vueify-example/blob/master/test/unit/a.spec.js#L22-L43
