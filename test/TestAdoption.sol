// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    // La dirección del contrato de adopción que se probará
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    // La identificación de la mascota que se utilizará para la prueba
    uint256 expectedPetId = 8;

    // El dueño esperado de la mascota adoptada es este contrato
    address expectedAdopter = address(this);

    // Probando la función adopt ()
    function testUserCanAdoptPet() public {
        uint256 returnedId = adoption.adopt(expectedPetId);

        Assert.equal(
            returnedId,
            expectedPetId,
            "La adopcion de la mascota esperada debe coincidir con lo que se devuelve."
        );
    }

    // Prueba de recuperación del dueño de una sola mascota
    function testGetAdopterAddressByPetId() public {
        address adopter = adoption.adopters(expectedPetId);

        Assert.equal(
            adopter,
            expectedAdopter,
            "El dueno de la mascota esperada debe ser este contrato."
        );
    }

    // Prueba de recuperación de todos los dueños de mascotas
    function testGetAdopterAddressByPetIdInArray() public {
        // Almacenar a los adoptantes en la memoria en lugar d
        // el almacenamiento del contrato
        address[16] memory adopters = adoption.getAdopters();
      
      // Dado que los adoptantes es array, y sabemos por el primer test de 
      // adopción que adoptamos expectedPetId, comparamos la dirección del 
      // contrato de prueba con la ubicación expectedPetId en el array.
        Assert.equal(
            adopters[expectedPetId],
            expectedAdopter,
            "El dueno de la mascota esperada debe ser este contrato."
        );
    }

}
