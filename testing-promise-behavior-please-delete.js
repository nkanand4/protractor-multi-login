var config = protractor.getInstance().params;
var util = {
  impersonate: function(user) {
    var me = this;
    if(this instanceof arguments.callee === false) {
      me = new arguments.callee(user);
      return me;
    }
    me.user = user;
    me.future = protractor.promise.defer();
    var login = function() {
      console.log('Telling browser to login as', user)
      setTimeout(me.future.fulfill, 3000);
    };
    me.later = function(fn) {
      var cf = protractor.promise.controlFlow();
      cf.await(me.future);
      return cf.execute(function() {
        me.future.then(function() {
          return protractor.promise.when(fn.call(me));
        });
      });
    }
    me.dwr = function() {
      return me.user;
    };
    login();
    return me;
  }
};



  describe('Launch Page test', function(){
    it('should all pass', function() {

      var admin = util.impersonate({user: 'u', pass: 'p'});
      admin.later(function(stage1) {
        var user = this.dwr();
        console.log('inside later 1.1', user);
        return 1+2;
      }).then(function(stage2) {
          console.log('doing stage 1.2');
          return 2+3;
        }).then(function(stage3) {
          console.log('doing stage 1.3');
          expect(3).toEqual(1+1+1);
          return 3+4;
        });

      protractor.promise.controlFlow().execute(function() {
        console.log('CF1');
      });

      protractor.promise.controlFlow().execute(function() {
        console.log('CF2');
      });

      protractor.promise.controlFlow().execute(function() {
        console.log('CF3');
      });

     // verify with another call that values are unique in this call
      util.impersonate({user: 'u2', pass: 'p2'}).later(function(stage1) {
      var user = this.dwr();
      console.log('inside later 2.1', user);
      return 1+2;
      }).then(function(stage2) {
      console.log('doing stage 2.2');
      return 2+3;
      }).then(function(stage3) {
      console.log('doing stage 2.3');
      expect(3).toEqual(1+1+1);
      return 3+4;
      });

      protractor.promise.controlFlow().execute(function() {
      console.log('CF21');
      });

      protractor.promise.controlFlow().execute(function() {
      console.log('CF22');
      });

      protractor.promise.controlFlow().execute(function() {
      console.log('CF23');
      });

      admin.later(function() {
        console.log('Accessing user props again', this.dwr());
      });

    });
  });


