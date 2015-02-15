(function() {
    'use strict';
    window.App = window.App || {};


    //************ MODELS & COLLECTIONS ************//


    var AppModel = Backbone.Model.extend({
      defaults: {
        searchTerm: '',
      }
    });

    var Restaurant = Backbone.Model.extend({});

    var RestaurantCollection = Backbone.Collection.extend({
        initialize: function(collection, options) {
          this.appModel = options.appModel;
        },

        url: function() {
          var searchTerm = this.appModel.get('searchTerm').replace(/ /g, '+');
          var cors = 'http://jsonp.nodejitsu.com/?url=';
          var url = 'http://api.yelp.com/v2/search';
          var location = 'Greenville+South+Carolina',
            var foodtype = 'find_desc='

          oauth_consumer_key: 'fENyD3V4qciqnAlyAoBn5A', //Consumer Key
            oauth_token: 'jd0offZLUxZUESr2FmOzlp6wRRw1AKgW', //Token
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: '',
            oauth_nonce: '',
        };

        return cors + encodeURIComponent(url + searchTerm + key);

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


  var ResultsView = Backbone.View.extend({

    el: '#results-container',

    initialize: function() {
      this.listenTo(this.collection, 'sync', this.render);
    },

    render: function() {
      this.$el.empty();
      var self = this;
      this.collection.each(function(listing) {
        self.$el.append('<li>' + listing.get('title') + '</li>');
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