App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    $.getJSON('../pets.json', function (data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    /*
     * Primero, verificamos si estamos usando navegadores dapp modernos 
    o las versiones más recientes de MetaMask donde se inyecta un proveedor 
    de ethereum en el objeto de la ventana. Si es así, lo usamos para crear 
    nuestro objeto web3, pero también necesitamos solicitar explícitamente 
    el acceso a las cuentas con ethereum.enable ().

    Si el objeto ethereum no existe, buscamos una instancia web3 inyectada. 
    Si existe, esto indica que estamos usando un navegador dapp más antiguo 
    (como Mist o una versión anterior de MetaMask). Si es así, obtenemos su 
    proveedor y lo usamos para crear nuestro objeto web3.

    Si no hay una instancia de web3 inyectada, creamos nuestro objeto web3 
    en función de nuestro proveedor local. (Esta alternativa está bien para 
    entornos de desarrollo, pero no es segura y no es adecuada para producción).
     */

    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    /*
     * 
    Primero recuperamos el archivo de artefactos para nuestro contrato inteligente. 
    Los artefactos son información sobre nuestro contrato, como su dirección 
    implementada y la interfaz binaria de aplicación (ABI). La ABI es un objeto de 
    JavaScript que define cómo interactuar con el contrato, incluidas sus variables, 
    funciones y sus parámetros.

    Una vez que tenemos los artefactos en nuestra devolución de llamada, los pasamos 
    a TruffleContract (). Esto crea una instancia del contrato con el que podemos 
    interactuar.

    Con nuestro contrato instanciado, configuramos su proveedor web3 utilizando el 
    valor App.web3Provider que almacenamos anteriormente al configurar web3.

    Luego llamamos a la función markAdopted () de la aplicación en caso de que alguna 
    mascota ya haya sido adoptada de una visita anterior. Hemos encapsulado esto en 
    una función separada, ya que necesitaremos actualizar la interfaz de usuario cada 
    vez que hagamos un cambio en los datos del contrato inteligente.
     */

    $.getJSON('Adoption.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function () {
    /*
     * 
    Accedemos al contrato de adopción implementado y luego llamamos a getAdopters() 
    en esa instancia.

    El uso de call () nos permite leer datos de la cadena de bloques sin tener que 
    enviar una transacción completa, lo que significa que no tendremos que gastar 
    ningún ether.

    Después de llamar a getAdopters (), los recorremos todos, verificando si hay 
    una dirección almacenada para cada mascota.

    Una vez que se encuentra un petId con una dirección correspondiente, 
    deshabilitamos su botón de adopción y cambiamos el texto del botón a "Éxito".
     */

    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function (adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });

  },

  handleAdopt: function (event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Usamos web3 para obtener las cuentas de los usuarios. En la devolución 
      de llamada después de una verificación de error, seleccionamos la primera cuenta.

      Obtenemos el contrato implementado como lo hicimos anteriormente y 
      almacenamos la instancia en AdoptionInstance. 
      Esta vez, sin embargo, enviaremos una transacción en lugar de una llamada. 
      Enviamos la transacción ejecutando la función adopt() con la identificación
      de la mascota y un objeto que contiene la dirección de la cuenta.
     */
    var adoptionInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, { from: account });
      }).then(function (result) {
        // Si no hay errores, procedemos a llamar a nuestra función markAdopted () 
        // para sincronizar la interfaz de usuario con nuestros datos recién almacenados.
        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
