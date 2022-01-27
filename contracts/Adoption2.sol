// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Adoption2 {
    
    struct Adopter {
        string firstName;
        string lastName;
        address accountAddress;
    }

    Adopter[16] public adopters;
    
    // Adopting a pet
    function adopt(
        uint256 petId,
        string memory firstName,
        string memory lastName
    ) public returns (uint256) {
        require(petId >= 0 && petId <= 15);

        Adopter memory newAdopter = Adopter(firstName, lastName, msg.sender);

        adopters[petId] = newAdopter;

        return petId;
    }

    // Retrieving the adopters
    // Array Getters devuelven solo un valor de una clave determinada.
    // Nuestra interfaz de usuario necesita actualizar todos los estados
    // de adopción de mascotas, pero realizar 16 llamadas a la API no es lo ideal.
    // Escribimos una función para devolver la matriz completa.
    function getAdopters() public view returns (Adopter[16] memory) {
        return adopters;
    }
}
