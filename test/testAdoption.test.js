
const Adoption = artifacts.require("Adoption");

contract("Adoption", (accounts) => {
  let adoption;
  let expectedAdopter;

  before(async () => {
    adoption = await Adoption.deployed();
  });

  describe("adoptar una mascota y recuperar la direcciones de la cuenta", async () => {

    before("adoptar una mascota usando accounts[0]", async () => {
      await adoption.adopt(8, { from: accounts[0] });
      expectedAdopter = accounts[0];
    });

    it("puede obtener el address de un dueño por el pet id", async () => {
      const adopter = await adoption.adopters(8);
      assert.equal(adopter, expectedAdopter, "El dueno de la mascota adoptada debe ser la primera cuenta.");
    });

    it("puede obtener la colección de direcciones de todos los duenos de mascotas", async () => {
      const adopters = await adoption.getAdopters();
      assert.equal(adopters[8], expectedAdopter, "El dueno de la mascota adoptada debe estar en la coleccion.");
    });

  });

});