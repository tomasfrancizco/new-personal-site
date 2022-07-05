---
title: "Capture The Ether: donation"
date: "2022-06-16T22:12:03.284Z"
description: Este desafío hará que indaguemos aún más el almacenamiento en Ethereum.
---

[Link to Medium article](https://medium.com/@tomasfrancisco/capture-the-ether-donation-e000676b3e7f)

Este desafío hará que indaguemos aún más el almacenamiento en Ethereum.

Primero, analicemos algunas cosas clave.

* El contrato: se usa para 'donar' éter a su propietario, que lamentablemente... no somos nosotros.
* Nuestro objetivo: vaciar el saldo del contrato.
* El problema: solo el `owner` del contrato puede retirar el *balance*.

Veamos el contrato:

![imagen del código de un smart contract](https://res.cloudinary.com/dzxbgzgyy/image/upload/v1657034927/cte/1_23nyiTX1T_zeR37JQnBXkA.png)

Lo primero que vemos es un `struct` que se utilizará para organizar las diferentes donaciones realizadas al contrato.

Luego, hay un *array de longitud dinámica* que, como vimos en el desafío anterior, es especial en la forma en que se almacena: se reserva una espacio *(slot)* completo de *32 bytes (p)* para su longitud y sus elementos se almacenan comenzando en el número de *slot keccak256(p)*.

Y luego la variable `owner`.

Para ver esto más claro, escribí un script en js con *web3js* muy simple para verificar las primeras espacios del almacenamiento del contrato:

```
const main = async () => {
  let arr = []
  for(let i=0;i<2;i++){
    const storage = await web3.eth.getStorageAt(contractAddress, i);
    arr.push([i, storage]);
  }
  return arr
}
main().then((res) => console.log(res));
```

Si ejecutamos esto justo después del *deploy*, veremos esto:

![](https://res.cloudinary.com/dzxbgzgyy/image/upload/v1657034926/cte/1_izsARZj_m7fNkqNMaFMVYA.png)

* `Slot 0`: donations[]
* `Slot 1`: owner

El `struct` no se guarda en el almacenamiento porque en este punto se acaba de *declarar*.

Luego, si nos saltamos las líneas habituales con el `constructor` y la función `isComplete()`, llegamos a la función `donate()`, que en este momento es la única a la que podemos llamar, así que veámosla:

* `uint256 scale`: como sabemos, para la EVM, *1 ether* equivale a *10^18*, por lo que en este caso el valor es *10^18 * 10^18 = 10000000000000000000000000000000000000* (son 36 0s).
* un `require`: todo lo que enviemos como `msg.value` debe ser igual a `etherAmount / scale`. La cuestión es que, como `scale` es un número tan grande, es muy difícil enviar una cantidad de *ether* que pueda satisfacer este requisito.
Ejemplo: digamos que queremos enviar *1 ether* -> *msg.value == 10^18* entonces `etherAmount` debería ser *10⁵⁴*… Ok, no. Es esto o que el comentario de *cantidad está en ether bla bla* está mal y es muy confuso.
¿Qué pasa si ingresamos *etherAmount = 1* para enviar este *1 ether*? No, en este caso *10^18 == 1 / 10^36 == 0* por lo que no se cumple el requisito. Pero por otro lado, *1/10^36 == 0*, por lo que aparentemente podemos enviar *etherAmount = 1* sin ningún `msg.value`. Si lo intentamos, la transacción pasará. Raro, ¿no?

Después de intentarlo, pasemos a las siguientes líneas.
```
Donation donation;
donation.timestamp = now;
donation.etherAmount = etherAmount;
donations.push(donations);
```

A primera vista, parece que solo estamos agregando una estructura con la información de la donación al *array* `donations[]` definida globalmente. Pero veamos algo primero…

Si volvemos a comprobar el almacenamiento, vamos a ver algo diferente. Asumiendo que enviamos *etherAmount = 1*, veremos algo como esto:

![](https://res.cloudinary.com/dzxbgzgyy/image/upload/v1657034926/cte/1_rjlXNougbF3vOBcDVkCyUA.png)

¿Por qué está pasando esto?

Como vimos antes, hay diferentes *ubicaciones de datos* en Ethereum: *storage* (almacenamiento), *memory* y *calldata*. Cada tipo de dato se ubicará en uno de estos dependiendo de su tipo y de donde esté definido dentro del contrato.

Los *structs* definidos dentro de las funciones, si no se asignan explícitamente, se guardan en el *storage* de forma predeterminada. En nuestro caso hay una línea que crea una vulnerabilidad:

`Donation donation`. Este es un [puntero de almacenamiento no inicializado](https://www.bookstack.cn/read/ethereumbook-en/spilt.16.c2a6b48ca6e1e33c.md). Lo que significa que este nuevo *struct* reemplaza al definido al comienzo del contrato y asigna:

* `now` al espacio 0 (Unix timestamp)
* `etherAmount` al espacio 1

Entonces, el *0x00...01* que vemos en el espacio 1 es solo el `etherAmount` en formato hexadecimal.

Ahora que sabemos esto, podemos asignar cualquier número que queramos a la variable `owner` para retirar el *balance*, solo necesitamos pasar nuestra dirección como `etherAmount` con un `msg.value` apropiado.

Para calcular esto, necesitamos convertir nuestra *address* a formato decimal y luego dividirla por *10³⁶* para cumplir con el `require`. Esto se puede calcular fácilmente eliminando los últimos 36 dígitos de ese número.

Solución: necesitamos llamar a `donate()` con su *address* como argumento y su *address / 10³⁶* como `msg.value` en *wei*. Luego llamar a `withdraw()`.

![challenge completed](https://res.cloudinary.com/dzxbgzgyy/image/upload/v1657034926/cte/1_PRI9LIAVe7vnyatNyaSyQg.png)

Conclusión: los punteros de almacenamiento no inicializados son peligrosos porque abren la puerta a la manipulación del almacenamiento. Hay que tener en cuenta que esta vulnerabilidad se solucionó en versiones más recientes de solidity y no podremos compilar el contrato con ella.

En el próximo artículo resolveremos el último de los desafíos de *Math*: 'Fifty Years'.