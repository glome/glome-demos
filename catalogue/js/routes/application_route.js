/**
 *
 */
App.ApplicationRoute = Ember.Route.extend(
{
  actions:
  {
    auth: function(password)
    {
      this.controller.get('controllers.user').send('auth', App.glomeid, password);
    },
    logout: function ()
    {
      this.controller.get('controllers.user').send('logout');
    },
    history: function ()
    {
      this.controller.get('controllers.user').send('history');
    },
    error: function(reason, transition)
    {
      console.log('--------------------------------------- error ---------------------------------------------------');
      console.log(reason);
      console.log(transition);

      if (typeof reason.status !== 'undefined')
      {
        console.log('error status: ' + reason.status + ', transition: ' + transition);
        if (parseInt(reason.status) == 403)
        {
          this.controllerFor('application').set('previousTransition', transition);
          this.controllerFor('application').send('connect');
          console.log('done');
        }
      }
      console.log('-------------------------------------------------------------------------------------------------');
    }
  },
  beforeModel: function(transition)
  {

    var self = this, promise, glomeid = window.localStorage.getItem('glomeid');
    // check our session
    if (glomeid)
    {
      promise = this.store.find('user', glomeid).then(function()
      {
        self.controllerFor('application').send('loadCategories', transition.params.category);
      });
    }
    else
    {
      promise = this.store.find('user');
    }
    return promise;
  },
  model: function(params, transition)
  {
    console.log('ApplicationRoute::model');
  },
  setupController: function(controller, model)
  {
    console.log('ApplicationRoute::setupController');
    controller.get('controllers.application').send('setGlobals');

    if (App.glomeid && App.glomeid != '')
    {
      this.store.find('user', App.glomeid).then(function(data)
      {
        window.localStorage.setItem('loggedin', true);
        controller.get('controllers.application').set('loggedin', true);
      });
    }
    controller.set('title', "Catalogue");
    controller.set('categories', this.get('categories'));
  }
});