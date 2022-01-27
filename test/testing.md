Unidad 6

Testing

Testing Pet Shop

1 Probando el contrato inteligente usando Solidity
-------------------------------------------

Truffle es muy flexible cuando se trata de pruebas de contratos inteligentes, ya que las pruebas se pueden escribir en JavaScript o Solidity. En este tutorial, escribiremos nuestras pruebas en Solidity.
Cree un nuevo archivo llamado TestAdoption.sol en el directorio test /.

Agregue el siguiente contenido al archivo TestAdoption.sol:


Iniciamos el contrato con 3 importaciones:
-----------------------------------------

- Assert.sol: nos da varias afirmaciones para usar en nuestras pruebas. En las pruebas, una afirmación verifica cosas como igualdad, desigualdad o vacío para devolver un pasa / no pasa de nuestra prueba. Aquí hay una lista completa de las afirmaciones incluidas con Truffle.

- DeployedAddresses.sol: al ejecutar pruebas, Truffle implementará una nueva instancia del contrato que se está probando en la cadena de bloques. Este contrato inteligente obtiene la dirección del contrato implementado.

- Adoption: el contrato inteligente que queremos probar.

- Nota: Las dos primeras importaciones se refieren a archivos Truffle globales, no a un directorio `truffle`. No debería ver un directorio `truffle` dentro de su directorio` test / `.

Luego definimos tres variables de contrato:

- Primero, uno que contiene el contrato inteligente que se probará, llamando al contrato inteligente DeployedAddresses para obtener su dirección.

- En segundo lugar, la identificación de la mascota que se utilizará para probar las funciones de adopción.

- En tercer lugar, dado que el contrato TestAdoption enviará la transacción, establecemos la dirección del adoptante esperada en esta, una variable de contrato que obtiene la dirección del contrato actual.


Probando la función adopt ()
----------------------------

Para probar la función adopt (), recuerde que si tiene éxito devuelve el petId dado. Podemos asegurarnos de que se devolvió una ID y que es correcta comparando el valor de retorno de adopt () con la ID que le pasamos.

- Llamamos al contrato inteligente que declaramos anteriormente con el ID de espectedPetId.

- Finalmente, pasamos el valor real, el valor esperado y un mensaje de falla (que se imprime en la consola si la prueba no pasa) a Assert.equal ().



2 Probando el contrato inteligente usando JavaScript
---------------------------------------------

Truffle es muy flexible cuando se trata de pruebas de contratos inteligentes, ya que las pruebas se pueden escribir en JavaScript o Solidity. En este tutorial, escribiremos nuestras pruebas en Javascript usando las a.bibliotecas Chai y Moch
Cree un nuevo archivo llamado testAdoption.test.js en el directorio test /.

Agregue el siguiente contenido al archivo testAdoption.test.js:


Iniciamos el contrato importando:
-------------------------------

Adoption: Comenzamos nuestra prueba importando nuestro contrato de adopción utilizando artifacts.require.

La función callback toma accounts de argumento. Esto nos proporciona las cuentas disponibles en la red cuando utilizamos esta prueba.

Luego, usamos before() para proporcionar configuraciones iniciales:
- Adoptar una mascota con id 8 y asígnela a la primera cuenta dentro de las cuentas de prueba.
- Esta función se utiliza posteriormente para comprobar si las accounts[0] han adoptado petId:8.

Probando la función de adopt ()
-------------------------------

Al probar la función de adopción tenemos en cuenta que si tiene éxito, devuelve el adoptante.
Podemos asegurarnos de que el adopter basado en petID dado fue devuelto y se compara con el expectedAdopter dentro de la función de adopción.

- Llamamos al contrato inteligente para ver qué dirección adoptó la mascota con petID 8.
- Truffle importa Chai por nosotros para que podamos usar las funciones de aserción. Pasamos el valor real, el valor esperado y un mensaje de falla (que se imprime en la consola si la prueba no pasa) a assert.equal().

Testing retrieval of all pet owners()

Dado que adoptantes es una matriz, y sabemos por la primera prueba de adopción que adoptamos la mascota con petId 8, comparamos la dirección del contrato con la dirección que esperamos encontrar.

3 - Ejecutando las pruebas
-------------------------

Vamos a la terminal
$ truffle test

Obtenemos esta salida:

Using network 'test'.

Compiling your contracts...
===========================
> Compiling ./test/TestAdoption.sol
> Artifacts written to /var/folders/p3/9v5w2ps10jb3q747m76x4qgc0000gp/T/test--6943-PnzKOXcxUUB3
> Compiled successfully using:
   - solc: 0.8.3+commit.8d00100c.Emscripten.clang

  TestAdoption
    ✓ testUserCanAdoptPet (181ms)
    ✓ testGetAdopterAddressByPetId (138ms)
    ✓ testGetAdopterAddressByPetIdInArray (199ms)

  Contract: Adoption
    adoptar una mascota y recuperar la direcciones de la cuenta
      ✓ puede obtener el address de un dueño por el pet id
      ✓ puede obtener la colección de direcciones de todos los duenos de mascotas (48ms)


  5 passing (9s)

