# Truffle Boxes - Web3
https://trufflesuite.com/boxes/

## dApp Pet shop
https://trufflesuite.com/boxes/pet-shop/

## Pet shop Tutorial
https://trufflesuite.com/tutorial/

### Creamos nuevo proyecto: 

```
$ truffle unbox pet-shop
```

### Modificamos truffle-config.js 
- configuramos Ganache GUI y compilador solc 0.8.3
- Creamos contrato Adoption
- Compilamos y migramos contrato a la red ganache

```
$ truffle compile
$ truffle console --network ganache	
migrate --reset
```

### Front
- modificamos el archivo src/js/app.js
- completamos las funciones 
	- initWeb3
	- initContract
	- markAdopted
	- handleAdopt

### Ejecutamos la dApp
```
npm run dev
```



