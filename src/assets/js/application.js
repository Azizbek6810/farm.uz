var EIMZO_MAJOR = 3;
var EIMZO_MINOR = 37;
var errorCAPIWS = 'Ошибка соединения с E-IMZO. Возможно у вас не установлен модуль E-IMZO';
var errorBrowserWS = 'Браузер не поддерживает технологию WebSocket. Установите последнюю версию браузера.';
var errorUpdateApp = 'Установите новую версию приложения E-IMZO.';
var errorWrongPassword = 'Пароль неверный.';

var uiLoadKeys = function (itemId, callback) {

  if (itemId) {

    console.log('ESI key ', itemId);

    EIMZOClient.listAllUserKeys(function (o, i) {
      return o.serialNumber;
    }, function (itemId, v) {
      return {
        id: itemId,
        vo: v
      };
    }, function (items, firstId) {

      console.log('Load keys ', items);

      for (var item of items) {

        if (item.id == itemId) {

          callback(item.vo);
        }

      }

    }, function (e, r) {
      console.log(e,r);
      uiShowMessage(errorCAPIWS);
    });
  } else {
    uiShowMessage('Ключ не найден!');
  }
};

var uiLoadKeysTIN = function (itemId, callback) {

  if (itemId) {

    console.log('ESI tin', itemId);

    EIMZOClient.listAllUserKeys(function (o, i) {
      return o.TIN;
    }, function (itemId, v) {
      return {
        id: itemId,
        vo: v
      };
    }, function (items, firstId) {

      console.log('Load keys tin', items);

      for (var item of items) {

        if (item.id == itemId) {
          callback(item.vo);
        }

      }

    }, function (e, r) {
      uiShowMessage(errorCAPIWS);
    });
  } else {
    uiShowMessage('Ключ не найден!');
  }
};

var wsError = function (e) {
  if (e) {
    uiShowMessage(errorCAPIWS + " : " + e);
  } else {
    uiShowMessage(errorBrowserWS);
  }
};
var uiShowMessage = function (message) {
  alert('Ошибка - ' + message);
};
var uiNotLoaded = function (e) {
  if (e) {
    wsError(e);
  } else {
    uiShowMessage(errorBrowserWS);
  }
};

var esiCheckVersion = function (itemId, callback) {

  EIMZOClient.API_KEYS = [
    'localhost', '96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
    '127.0.0.1', 'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
    'null', 'E0A205EC4E7B78BBB56AFF83A733A1BB9FD39D562E67978CC5E7D73B0951DB1954595A20672A63332535E13CC6EC1E1FC8857BB09E0855D7E76E411B6FA16E9D',
    'dls.yt.uz', 'EDC1D4AB5B02066FB3FEB9382DE6A7F8CBD095E46474B07568BC44C8DAE27B3893E75B79280EA82A38AD42D10EA0D600E6CE7E89D1629221E4363E2D78650516',
    'ekoplatforma.uz', 'EF02F63D696EF430D086264874FEF3A02801072C126AD4CA7569C55B1BB95DA8BAB81030248389F1EB9B02E328624AC56CBB5C8EC00DC5AAFF5C6E94CB72B2F9'
  ];

  EIMZOClient.checkVersion(function (major, minor) {
    var newVersion = EIMZO_MAJOR * 100 + EIMZO_MINOR;
    var installedVersion = parseInt(major) * 100 + parseInt(minor);

    if (installedVersion < newVersion) {

      uiShowMessage(errorUpdateApp);
    } else {
      EIMZOClient.installApiKeys(function () {

        uiLoadKeys(itemId, callback);
      }, function (e, r) {
        if (r) {

          uiShowMessage(r);
        } else {

          wsError(e);
        }
      });
    }
  }, function (e, r) {
    if (r) {

      uiShowMessage(r);
    } else {

      uiNotLoaded(e);
    }
  });
};

var esiCheckVersionTIN = function (itemId, callback) {

  EIMZOClient.API_KEYS = [
    'localhost', '96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
    '127.0.0.1', 'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
    'null', 'E0A205EC4E7B78BBB56AFF83A733A1BB9FD39D562E67978CC5E7D73B0951DB1954595A20672A63332535E13CC6EC1E1FC8857BB09E0855D7E76E411B6FA16E9D',
    'dls.yt.uz', 'EDC1D4AB5B02066FB3FEB9382DE6A7F8CBD095E46474B07568BC44C8DAE27B3893E75B79280EA82A38AD42D10EA0D600E6CE7E89D1629221E4363E2D78650516',
    'ekoplatforma.uz', 'EF02F63D696EF430D086264874FEF3A02801072C126AD4CA7569C55B1BB95DA8BAB81030248389F1EB9B02E328624AC56CBB5C8EC00DC5AAFF5C6E94CB72B2F9'
  ];

  EIMZOClient.checkVersion(function (major, minor) {
    var newVersion = EIMZO_MAJOR * 100 + EIMZO_MINOR;
    var installedVersion = parseInt(major) * 100 + parseInt(minor);

    if (installedVersion < newVersion) {

      uiShowMessage(errorUpdateApp);
    } else {
      EIMZOClient.installApiKeys(function () {

        uiLoadKeysTIN(itemId, callback);
      }, function (e, r) {
        if (r) {

          uiShowMessage(r);
        } else {

          wsError(e);
        }
      });
    }
  }, function (e, r) {
    if (r) {

      uiShowMessage(r);
    } else {

      uiNotLoaded(e);
    }
  });
};

function esiSign(itemId, data, callback) {

  if (!itemId) {
    uiShowMessage('Ключ ЭЦП не найден!');
  } else {

    esiCheckVersion(itemId, (vo) => {

      // console.log('ESI data ', vo);

      EIMZOClient.loadKey(vo, function (id) {

        EIMZOClient.createPkcs7(id, data, null, function (pkcs7) {

          // console.log('ESI signed ', pkcs7);
          callback(vo, pkcs7);

        }, function (e, r) {
          if (r) {

            if (r.indexOf("BadPaddingException") != -1) {

              uiShowMessage(errorWrongPassword);
            } else {

              uiShowMessage(r);
            }

          } else {

            uiShowMessage(errorBrowserWS);
          }

          if (e) {
            wsError(e);
          }
        });

      }, function (e, r) {

        if (r) {

          if (r.indexOf("BadPaddingException") != -1) {

            uiShowMessage(errorWrongPassword);
          } else {

            uiShowMessage(r);
          }

        } else {
          uiShowMessage(errorBrowserWS);
        }

        if (e) {
          wsError(e);
        }

      });

    });
  }
}

function esiNewSign(itemId, data, callback) {
  if (!itemId) {
    uiShowMessage('Ключ ЭЦП не найден!');
  } else {
    esiCheckVersion(itemId, (vo) => {
      EIMZOClient.loadKey(vo, function (id) {
        EIMZOClient.createPkcs7(id, data, null, function (pkcs7) {
          callback(vo, pkcs7);
        }, function (e, r) {
          if (r) {
            if (r.indexOf("BadPaddingException") != -1) {
              const res = {
                code: -1,
                message: errorWrongPassword
              };
              callback(res);
            } else {
              const res = {
                code: -1,
                message: r
              };
              callback(res);
            }
          } else {
            const res = {
              code: -1,
              message: errorBrowserWS
            };
            callback(res);
          }
          if (e) {
            wsError(e);
          }
        });
      }, function (e, r) {
        if (r) {
          if (r.indexOf("BadPaddingException") != -1) {
            uiShowMessage(errorWrongPassword);
          } else {
            uiShowMessage(r);
          }
        } else {
          uiShowMessage(errorBrowserWS);
        }
        if (e) {
          wsError(e);
        }
      });
    });
  }
}

function esiSignTIN(itemId, data, callback) {

  if (!itemId) {
    uiShowMessage('Ключ ЭЦП не найден!');
  } else {

    esiCheckVersionTIN(itemId, (vo) => {

      console.log('ESI data ', vo);

      EIMZOClient.loadKey(vo, function (id) {

        EIMZOClient.createPkcs7(id, data, null, function (pkcs7) {

          console.log('ESI signed ', pkcs7);
          callback(vo, pkcs7);

        }, function (e, r) {
          if (r) {

            if (r.indexOf("BadPaddingException") != -1) {

              uiShowMessage(errorWrongPassword);
            } else {

              uiShowMessage(r);
            }

          } else {

            uiShowMessage(errorBrowserWS);
          }

          if (e) {
            wsError(e);
          }
        });

      }, function (e, r) {

        if (r) {
          if (r.indexOf("BadPaddingException") != -1) {
            uiShowMessage(errorWrongPassword);
          } else {
            uiShowMessage(r);
          }
        } else {
          uiShowMessage(errorBrowserWS);
        }

        if (e) {
          wsError(e);
        }

      });

    });
  }
}
