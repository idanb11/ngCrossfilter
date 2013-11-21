(function($angular, $crossfilter) {

    /**
     * @module ngCrossfilter
     * @author Adam Timberlake
     */
    var ngCrossfilter = $angular.module('ngCrossfilter', []);

    /**
     * @service crossfilterFilter
     */
    ngCrossfilter.service('crossfilterFilter', function() {

        /**
         * @property _crossfilter
         * @type {Object}
         * @private
         */
        var _crossfilter = {};

        /**
         * @property _dimensions
         * @type {Object}
         * @private
         */
        var _dimensions = {};

        /**
         * @method _setupCrossfilter
         * @param collection {Array}
         * @return {void}
         * @private
         */
        var _setupCrossfilter = function _setupCrossfilter(collection) {

            var properties  = _getProperties(collection[0]);
            _crossfilter    = $crossfilter(collection);

            // Iterate over each property to create its related dimension.
            $angular.forEach(properties, function(property) {

                _dimensions[property] = _crossfilter.dimension(function(model) {
                    return model[property];
                });

            });

        };

        /**
         * @method _getProperties
         * @param model {Object}
         * @return {Array}
         * @private
         */
        var _getProperties = function _getProperties(model) {

            var properties = [];

            for (var property in model) {

                if (model.hasOwnProperty(property)) {
                    properties.push(property);
                }

            }

            return properties;

        };

        /**
         * @method _applyFilter
         * @param property {String}
         * @param value {String}
         * @return {void}
         * @private
         */
        var _applyFilter = function _applyFilter(property, value) {

            var dimension = _dimensions[property];

            /**
             * @method strip
             * @param value {String}
             * @return {String}
             */
            var strip = function(value) {
                return value.substr(1);
            };

            // Determine if we have an array-like value, in which case we're using the range function.
            if ($angular.isArray(value)) {
                dimension.filterRange(value);
                return;
            }

            switch (value.charAt(0)) {
                // Otherwise we have a string and we need to know which function to apply.
                case ('?')  : _filterFuzzy(dimension, strip(value)); break;
                case ('~')  : _filterRegExp(dimension, strip(value)); break;
                default     : dimension.filterExact(value); break;
            }

        };

        /**
         * @method _filterFuzzy
         * @param dimension {Object}
         * @param value {String}
         * @private
         */
        var _filterFuzzy =  function(dimension, value) {

            var regExp = new RegExp(value, 'i');

            dimension.filterFunction(function(d) {
                return d.match(regExp);
            });

        };

        /**
         * @method _filterRegExp
         * @param dimension {Object}
         * @param value {String}
         * @private
         */
        var _filterRegExp =  function(dimension, value) {

            // Find the flags for the regular expression.
            var flags   = value.match(/\/([a-z])*$/)[1];

            // Extract the value from the regular expression.
            value       = value.match(/^\/(.+?)\/[a-z]*$/i)[1];

            // Finally we can construct the RegExp object.
            var regExp  = new RegExp(value, flags);

            dimension.filterFunction(function(d) {
                return d.match(regExp);
            });

        };

        /**
         * @method ngCrossfilter
         * @params collection {Array}
         * @params options {Object}
         * @return {Array}
         */
        return function ngCrossfilter(collection, options) {

            if (!('groupAll' in _crossfilter && 'dimension' in _crossfilter)) {
                // Setup the Crossfilter if we haven't already.
                _setupCrossfilter(collection);
            }

            if (options.filter && options.value) {
                _applyFilter(options.filter, options.value);
            }

            var dimension   = _dimensions[options.sort],
                direction   = ((options.direction || 'asc') === 'asc') ? 'bottom' : 'top';

            return dimension[direction](Infinity);

        }

    });

})(window.angular, window.crossfilter);