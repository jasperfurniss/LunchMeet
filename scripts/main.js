(function() {
  'use strict';
  window.App = window.App || {};


  //************ MODELS & COLLECTIONS ************//


  var AppModel = Backbone.Model.extend({
    defaults: {
      searchTerm: '',
    }
  });

  var Restaurant = Backbone.Model.extend({
    defaults: {
      searchTerm: '',
    }
  });

  var RestaurantCollection = Backbone.Collection.extend({
    initialize: function(collection, options) {
      this.appModel = options.appModel;
    },

    url: function() {
      var searchTerm = this.appModel.get('searchTerm').replace(/ /g, '+');
      var cors = 'http://jsonp.nodejitsu.com/?url=';
      var base = 'https://api.foursquare.com/v2/venues/search?';
      var location = '&near=Greenville+SC';
      var clientid = '&client_id=XH3032NSAMJO2X3FLNDT3NXTILSADCFD2HBPDRI41N5K4SUU';
      var clientsecret = '&client_secret=ZPZ5YLBVPMBM1RFKH5GE0114BMHPHDUU5F3IJKQLNK3YPV4Z';
      var date = '&v=20150215';
      return base + location + searchTerm + clientid + clientsecret + date;

    },

    sync: function(method, collection, options) {
      options.dataType = 'json';
      Backbone.sync(method, collection, options);
    },

    parse: function(response) {
      return response.results;
    }

  });



  //************ VIEWS ************//


  //***Index***//

  var IndexView = Backbone.View.extend({
    tagName: 'form',
    events: {
      'submit': 'submitSearch'
    },

    submitSearch: function() {
      event.preventDefault();
      var searchText = $('input').val();
      var searchTerm = encodeURI(searchText);

      router.navigate('results/' + searchTerm, {
        trigger: true
      });
    },

    template: _.template($('[date-template-name=index]').text()),

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });


  //***Results***//

  var ResultsView = Backbone.View.extend({

    el: '#results-container',

    initialize: function() {
      this.listenTo(this.collection, 'sync', this.render);
    },

    template: _.template($('[data-template-name=results]').text()),

    render: function() {
      this.$el.empty();
      var self = this;
      this.collection.each(function(listing) {
        self.$el.append('<span>' + listing.get('name') + '</span>');
      });
    },
  });



  //************ ROUTERS ************//

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'search/:term': 'search'
    },

    initialize: function() {
      this.appModel = new AppModel();
      this.listings = new RestaurantCollection([], {
        appModel: this.appModel
      });
      this.resultsView = new ResultsView({
        collection: this.listings
      });
      this.resultsView.render();
    },

    index: function() {
      this.listings.fetch();
    },

    search: function(term) {
      this.appModel.set('searchTerm', term);
      this.listings.fetch();
    }
  });



  //************ LET'S DO THIS  ************//

  $(document).ready(function() {
    window.router = new AppRouter();
    Backbone.history.start();
  });
})();