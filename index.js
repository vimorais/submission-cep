(function() {
  "use strict";

  function DOM(elements) {
    this.element = document.querySelectorAll(elements);
  }

  DOM.prototype.on = function on(eventType, callback) {
    Array.prototype.forEach.call(this.element, function(element) {
      element.addEventListener(eventType, callback, false);
    });
  };

  DOM.prototype.off = function off(eventType, callback) {
    Array.prototype.forEach.call(this.element, function(element) {
      element.removeEventListener(eventType, callback, false);
    });
  };

  DOM.prototype.get = function get() {
    return this.element;
  };

  DOM.prototype.forEach = function forEach() {
    return Array.prototype.forEach.apply(this.element, arguments);
  };

  DOM.prototype.map = function map() {
    return Array.prototype.map.apply(this.element, arguments);
  };

  DOM.prototype.reduce = function reduce() {
    return Array.prototype.reduce.apply(this.element, arguments);
  };

  DOM.prototype.reduceRight = function reduceRight() {
    return Array.prototype.reduce.apply(this.element, arguments);
  };

  DOM.prototype.filter = function filter() {
    return Array.prototype.filter.apply(this.element, arguments);
  };

  DOM.prototype.every = function every() {
    return Array.prototype.every.apply(this.element, arguments);
  };

  DOM.prototype.some = function some() {
    return Array.prototype.some.apply(this.element, arguments);
  };

  DOM.isArray = function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
  };

  DOM.isFunction = function isFunction(func) {
    return Object.prototype.toString.call(func) === "[object Function]";
  };

  DOM.isObject = function isObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
  };

  DOM.isNumber = function isNumber(num) {
    return Object.prototype.toString.call(num) === "[object Number]";
  };

  DOM.isString = function isString(str) {
    return Object.prototype.toString.call(str) === "[object String]";
  };

  DOM.isBoolean = function isBoolean(boolean) {
    return Object.prototype.toString.call(boolean) === "[object Boolean]";
  };

  DOM.isNull = function isNull(nll) {
    return (
      Object.prototype.toString.call(nll) === "[object Null]" ||
      Object.prototype.toString.call(nll) === "[object Undefined]"
    );
  };

  var $formCep = new DOM('[data-js="form-cep"]');
  var $inputCep = new DOM('[data-js="input-cep"]');
  var $address = new DOM('[data-js="address"]');
  var $district = new DOM('[data-js="district"]');
  var $state = new DOM('[data-js="state"]');
  var $city = new DOM('[data-js="city"]');
  var $cep = new DOM('[data-js="cep"]');
  var $status = new DOM('[data-js="status"]');
  $formCep.on("submit", handleSubmitFormCEP);
  var ajax = new XMLHttpRequest();

  function handleSubmitFormCEP(event) {
    event.preventDefault();
    var url = getUrl();
    ajax.open("GET", url);
    ajax.send();
    getMessage("loading");
    ajax.addEventListener("readystatechange", handleReadyStateChange);
  }

  function getUrl() {
    return "http://apps.widenet.com.br/busca-cep/api/cep/<cepCode>.json".replace(
      "<cepCode>",
      $inputCep.get()[0].value.replace(/\D/g, "")
    );
  }

  function inputClear(item) {
    return item.replace("[CEP]", $inputCep.get()[0].value);
  }

  function handleReadyStateChange() {
    if (isRequestOk()) {
      fillCEPFields();
      getMessage("ok");
    }
  }

  function isRequestOk() {
    return ajax.readyState === 4 && ajax.status === 200;
  }

  function fillCEPFields() {
    var data = getError();
    if (!data) {
      return getMessage("erro");
    }
    $address.get()[0].textContent = data.address;
    $district.get()[0].textContent = data.district;
    $state.get()[0].textContent = data.state;
    $city.get()[0].textContent = data.city;
    $cep.get()[0].textContent = data.code;
  }

  function getError() {
    var result;
    try {
      result = JSON.parse(ajax.responseText);
    } catch (error) {
      result = null;
    }
    return result;
  }

  function getMessage(type) {
    var messages = {
      ok: inputClear("Informações para o CEP [CEP]"),
      loading: inputClear("Buscando informações para o CEP [CEP]"),
      erro: inputClear(
        "Não foi possível encontrar informações para o CEP [CEP]"
      )
    };
    return ($status.get()[0].textContent = messages[type]);
  }
})();
