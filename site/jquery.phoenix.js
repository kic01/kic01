/*

Copyright (c) 2013-2014 Nick Kugaevsky

Licensed under the MIT License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

Phoenix is a simple jQuery plugin to make your form
input safe (I mean save) in your browser's local storage.

@version 1.2.1
@url github.com/kugaevsky/jquery-phoenix
---------------------

FEATURES:
- HTML5 localStorage persistance
- Simple event API
– Configurable usage

 */

(function($, window) {
  "use strict";
  var Phoenix, defaults, pluginName, saveTimers, supports_html5_storage;
  pluginName = "phoenix";
  defaults = {
    namespace: "phoenixStorage",
    maxItems: 100,
    saveInterval: 1000,
    clearOnSubmit: false,
    saveOnChange: false,
    keyAttributes: ["tagName", "id", "name"]
  };
  saveTimers = [];
  Phoenix = (function() {
    function Phoenix(element, option) {
      var attr, storageArray;
      this.element = element;
      this._defaults = defaults;
      this._name = pluginName;
      this.$element = $(this.element);
      this.options = $.extend({}, defaults, (typeof option === "object" ? option : void 0));
      if (typeof option === "string") {
        this.action = option;
      }
      this.uri = window.location.host + window.location.pathname;
      storageArray = [this.options.namespace, this.uri].concat((function() {
        var _i, _len, _ref, _results;
        _ref = this.options.keyAttributes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attr = _ref[_i];
          _results.push(this.element[attr]);
        }
        return _results;
      }).call(this));
      this.storageKey = storageArray.join(".");
      this.storageIndexKey = [this.options.namespace, "index", window.location.host].join(".");
      this.init();
    }

    Phoenix.prototype.indexedItems = function() {
      return JSON.parse(localStorage[this.storageIndexKey]);
    };

    Phoenix.prototype.remove = function() {
      var e, indexedItems;
      this.stop();
      localStorage.removeItem(this.storageKey);
      e = $.Event("phnx.removed");
      this.$element.trigger(e);
      indexedItems = this.indexedItems();
      indexedItems.slice($.inArray(this.storageKey, indexedItems), 1);
      localStorage[this.storageIndexKey] = JSON.stringify(indexedItems);
    };

    Phoenix.prototype.updateIndex = function() {
      var indexedItems;
      indexedItems = this.indexedItems();
      if ($.inArray(this.storageKey, indexedItems) === -1) {
        indexedItems.push(this.storageKey);
        if (indexedItems.length > this.options.maxItems) {
          localStorage.removeItem(indexedItems[0]);
          indexedItems.shift();
        }
        localStorage[this.storageIndexKey] = JSON.stringify(indexedItems);
      }
    };

    Phoenix.prototype.load = function() {
      var e, savedValue;
      savedValue = localStorage[this.storageKey];
      if (savedValue != null) {
        if (this.$element.is(":checkbox, :radio")) {
          this.element.checked = JSON.parse(savedValue);
        } else if (this.element.tagName === "SELECT") {
          this.$element.find("option").prop("selected", false);
          $.each(JSON.parse(savedValue), (function(_this) {
            return function(i, value) {
              return _this.$element.find("option[value='" + value + "']").prop("selected", true);
            };
          })(this));
        } else {
          try{
            this.element.value = savedValue;
          } catch (err) {
            console.log("Unable to restore state to " + this.element.name);
          }
        }
        e = $.Event("phnx.loaded");
        return this.$element.trigger(e);
      }
    };

    Phoenix.prototype.save = function() {
      var e, selectedValues;
      localStorage[this.storageKey] = this.$element.is(":checkbox, :radio") ? this.element.checked : this.element.tagName === "SELECT" ? (selectedValues = $.map(this.$element.find("option:selected"), function(el) {
        return el.value;
      }), JSON.stringify(selectedValues)) : this.element.value;
      e = $.Event("phnx.saved");
      this.$element.trigger(e);
      return this.updateIndex();
    };

    Phoenix.prototype.start = function() {
      var e, saveTimer;
      saveTimer = setInterval(((function(_this) {
        return function() {
          return _this.save();
        };
      })(this)), this.options.saveInterval);
      saveTimers.push(saveTimer);
      e = $.Event("phnx.started");
      return this.$element.trigger(e);
    };

    Phoenix.prototype.stop = function() {
      var e;
      saveTimers.forEach(function(t) {
        return clearInterval(t);
      });
      e = $.Event("phnx.stopped");
      return this.$element.trigger(e);
    };

    Phoenix.prototype.init = function() {
      if (localStorage[this.storageIndexKey] === void 0) {
        localStorage[this.storageIndexKey] = "[]";
      }
      switch (this.action) {
        case "remove":
          return this.remove();
        case "start":
          return this.start();
        case "stop":
          return this.stop();
        case "load":
          return this.load();
        case "save":
          return this.save();
        default:
          this.load();
          this.start();
          if (this.options.clearOnSubmit) {
            $(this.options.clearOnSubmit).submit((function(_this) {
              return function() {
                return _this.remove();
              };
            })(this));
          }
          if (this.options.saveOnChange) {
            return $(this.element).change((function(_this) {
              return function() {
                return _this.save();
              };
            })(this));
          }
      }
    };

    return Phoenix;

  })();
  supports_html5_storage = function() {
    try {
      return "localStorage" in window && window["localStorage"] !== null;
    } catch (_error) {
      return false;
    }
  };
  $.fn[pluginName] = function(option) {
    var pluginID;
    pluginID = "plugin_" + pluginName;
    return this.each(function() {
      if (!($.data(this, pluginID) && !supports_html5_storage())) {
        return $.data(this, pluginID, new Phoenix(this, option));
      }
    });
  };
})(jQuery, window);
