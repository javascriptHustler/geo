/**
 * @file Duke's google maps api wraper
 * @author Montier Elliott <montier.elliott@duke-energy.com>
 * @version 1.1.3
*/

/**
 * @class
 * @desc Geo wrapper object
*/
function Geo() {
  return this;
}

/**
 * @method streetViewPanorama
 * @param {String} id - Element that map will be displayed
 * @param {String} position - GoogleReady lat/lng
 * @desc Will show street view on map
*/
Geo.prototype.streetViewPanorama = function(id, position) {
  return new google.maps.StreetViewPanorama(document.getElementById(id), {
    position: position,
    enableCloseButton: true,
    pov: {
      heading: 280,
      pitch: 0, 
      zoom: 0
    }
  });
};

/**
 * @method createMap
 * @param {String} id - Element that map will be displayed
 * @param {Object} config - Map options
 * @desc Creates a map in the id param
*/
Geo.prototype.createMap = function(id, config) {
  return {
    el: new google.maps.Map(document.getElementById(id), config),
    disp: new google.maps.DirectionsRenderer(),
    markers: []
  }
};

/**
 * @method createMarker
 * @param {Object} position - GoogleReady lat/lng
 * @param {Object} map - Instance of map instance
 * @param {String} icon - Relative path of icon image
 * @desc Create a marker on map
*/
Geo.prototype.createMarker = function(position, map, icon) {
  return new google.maps.Marker({
    position: position,
    map: map, 
    width: 300, 
    icon: icon || ''
  });
};

/**
 * @method createInfoWindow
 * @param {String} content - Contains HTML for infowindow
 * @desc Create an infowindow
*/
Geo.prototype.createInfoWindow = function(content) {
  return new google.maps.InfoWindow({
    content: content,
    maxWidth: 450,
    maxHeight: 350
  });
};

/**
 * @method convertMiles
 * @param {number} kilo - Number distance
 * @desc Convert kilo to miles
 *  
*/
Geo.prototype.convertMiles = function(kilo){
  return kilo / 1.609344;
};

/**
 * @method googleLatLng
 * @param {number} lat - latitude 
 * @param {number} lng - longitude
 * @desc Converts Lat|Lngs to google map objects
 *  
*/
Geo.prototype.googleLatLng = function(lat, lng) {
  return new google.maps.LatLng(lat, lng);
};

/**
 * @method createCluster
 * @param {Object} map - Instance of map instance
 * @param {Array} markers - An array of markers
 * @param {object} options - Options for the clusters
 * @desc Create map clusters
 *  
*/
Geo.prototype.createCluster = function(map, markers, options) {
  return new MarkerClusterer(map, markers, options);
};

/**
 * @method extractGeocoding
 * @param {Geo~requestCallback} cb - The callback that handles the response.
 * @desc Gets Current Position
*/
Geo.prototype.extractGeocoding = function(cb) {
  var success = function(position) {
    var lat = position.coords.latitude, lng = position.coords.longitude;
    this.currentPosition = {
      coords: {
        lat: lat,
        lng: lng,
        googleReady: new google.maps.LatLng(lat, lng)
      }
    };
    this.reverseGeocoding(lat, lng, function(address) {
      this.currentPosition.address = address;
      cb(this.currentPosition);
    });
  },

  error = function(err) {
    this.currentPosition = false;
    cb(false);
  };
  
  navigator.geolocation.getCurrentPosition(_.bind(success, this), _.bind(error, this));
};

/**
 * @method reverseGeocoding
 * @param {Number} lat - Latitiude
 * @param {Number} lng - Longitude
 * @param {Geo~requestCallback} cb - The callback that handles the response.
 * @desc Changes lat/lngs into address
*/
Geo.prototype.reverseGeocoding = function(lat, lng, cb) {
  var geocoder = new google.maps.Geocoder(),
  
    latlng = new google.maps.LatLng(lat, lng),

    response = function(results, status) {
      if(status == 'OK') _.bind(success, this, results[0].formatted_address)();
      if(status != 'OK') _.bind(error, this, status)();
    },

    success = function(responseAddress) {
      _.bind(cb, this, responseAddress)();
    },

    error = function(err) {
      _.bind(cb, this, null)();
    };

  geocoder.geocode({'latLng': latlng}, _.bind(response, this));
};

/**
 * @method forwardGeocoding
 * @param {String} address - Address
 * @param {Geo~requestCallback} cb - The callback that handles the response.
 * @desc Changes address into lat/lngs
*/
Geo.prototype.forwardGeocoding = function(address, cb) {
  var geocoder = new google.maps.Geocoder(),

    response = function(results, status) {
      if(status == 'OK'){
        var geo = results[0].geometry.location;
        _.bind(success, this, {
          lat: geo.lat(),
          lng: geo.lng()
        })();
      }
      if(status != 'OK') _.bind(error, this, status)();
    },

    success = function(responseLatLng) {
      _.bind(cb, this, responseLatLng)();
    },

    error = function(err) {
      _.bind(cb, this, null)();
    };

  geocoder.geocode({'address': address}, _.bind(response, this));     
};

/**
 * @method distanceMatrix
 * @param {Object} address - Distances from
 * @param {Array} destinations - Distances to
 * @param {Geo~requestCallback} cb - The callback that handles the response.
 * @desc Travel distance and time for a matrix of origins and destinations
 *  
*/
Geo.prototype.distanceMatrix = function(address, destinations, cb) {
  var service = new google.maps.DistanceMatrixService(),
    response = function(results, status) {
      if(status == 'OK') _.bind(success, this, results)();
      if(status != 'OK') _.bind(error, this, status)();
    },

    success = function(distances) {
      _.bind(cb, this, distances.rows[0].elements)();
    },

    error = function(err) {
      _.bind(cb, this, null)();
    };

  service.getDistanceMatrix({
    origins: [address],
    destinations: destinations,
    travelMode: google.maps.TravelMode.DRIVING,
    avoidHighways: false,
    avoidTolls: false
  }, response);
};

/**
 * @method directions
 * @param {String} origin - From destination
 * @param {String} destination - To destination
 * @param {Geo~requestCallback} cb - The callback that handles the response.
 * @desc Calculate directions  
*/
Geo.prototype.directions = function(origin, destination, cb) {
  var request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    },

    response = function(results, status) {
      if(status == 'OK') _.bind(success, this, results)();
      if(status != 'OK') _.bind(error, this, status)();
    },

    success = function(responseDirections) {
      _.bind(cb, this, responseDirections)();
    },

    error = function() {
      _.bind(cb, this, null)();
    };

  this.directionsService = new google.maps.DirectionsService();
  this.directionsService.route(request, _.bind(response, this));
};

/**
 * @instance Geo
*/
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports.geo = module.exports.geo = new Geo;
  }
  exports.geo = new Geo();
} else {
  root.geo = new Geo();
}