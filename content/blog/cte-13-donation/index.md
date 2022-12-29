---
title: "Capture The Ether: donation"
date: "2022-06-16T22:12:03.284Z"
description: This challenge will make us dive even deeper into Ethereum's storage layout.
---

<!-- [Link to Medium article](https://medium.com/@tomasfrancisco/capture-the-ether-donation-e000676b3e7f)

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

En el próximo artículo resolveremos el último de los desafíos de *Math*: 'Fifty Years'. -->

---

This challenge will make us dive even deeper into Ethereum's storage layout.
Let's analyze some key things:
The contract: it's used to 'donate' ether to its owner, who unfortunately… is not us.
Our objective: drain the contract's balance.
The problem: only the contract's owner can withdraw the balance.

Let's take a look at it:
The first thing we see is a struct that will apparently be used to organize the different donations made to the contract.
Then, there's a dynamic length array, that as we've seen on the previous challenge, is special in the way that it is stored: one full 32 bytes slot (p) is reserved for the length of it and these elements are stored starting at slot number keccak256(p).
And then the owner variable.
To see this more clearly, i've written a very simple js script to check the first slots of the contract's storage:

```
const main = async () => {
  let arr = []
  for(let i=0;i<2;i++){
    const storage = await web3.eth.getStorageAt(contractAddress, i);
    arr.push([i, storage]);
  }
  return arr
}
```

main().then((res) => console.log(res));
If you run this right after deployment you'll see this:

Slot 0: donations[]
Slot 1: owner

The struct is not stored because at this point it was just declared.
Going forward, if we skip the usual lines with the constructor and the isComplete() function, we reach the donate() function, which at this time is the only one we can call, so let's take a look at it:
uint256 scale: as we know, for the EVM, 1 ether equals 10^18, so in this case the value is 10^18 * 10^18 = 1000000000000000000000000000000000000 (that's 36 0's).
a require statement: whatever we send as msg.value must equal what we input as etherAmount / scale. The thing is, as scale is such a large number, it's very hard for us to send an amount of ether that could satisfy this requirement. 
E.g.: let's say we want to send 1 ether -> msg.value == 10^18 then etherAmount should be 10⁵⁴… Ok, no. It's that or the comment about amount is in ether bla bla is wrong and very confusing.
What if we input etherAmount = 1 to send this 1 ether? Nope, in this case 10^18 == 1 / 10^36 == 0 so the requirement is not fulfilled. But wait, 1 / 10^36 == 0 so we can apparently send etherAmount = 1 with no msg.value at all. If we try that, the transaction will be completed. Weird, huh?

After trying that, let's move on to the next few lines.

```
Donation donation;
donation.timestamp = now;
donation.etherAmount = etherAmount;
donations.push(donations);
```

At first glance it seems like we are just adding a struct with the donation's info to the donations[] array defined globaly. But let's see something first…
If we check the storage again we'll get something different. Assuming you sent etherAmount = 1, you'll get something like this:
Why is this happening?
As we've seen before, there are different data locations in Ethereum: storage, memory & calldata. Each data type will be allocated in one of these depending on its type and where it's defined within the contract.
Structs defined within functions, if not explicitly assigned, default to storage. In our case there's a line that creates a vulnerability:
Donation donation. This is an Uninitialized Storage Pointer. Meaning this new struct is replacing the one defined at the beginning of the contract and assigning:
now to slot 0 (unix timestamp)
etherAmount to slot 1

So that 0x00...01 you see at slot 1 is just the etherAmount in hexadecimal format.
Now that we know this we can assign any number we want to the owner variable in order to withdraw the balance, we just need to pass our address as etherAmount with an appropriate msg.value.
To calculate this, we need to convert our address to decimals and then divide it by 10³⁶ in order to fulfil the requirement. This can be easily calculated by removing the last 36 digits of that number.

---

Solution: you need to call donate() with your address as input and your address / 10³⁶ as amount in wei. Then call withdraw().
Conclusion: uninitialized storage pointers are dangerous because they open the door for storage manipulation. Keep in mind that this vulnerability has been addressed in newer versions of solidity and you won't be able to compile the contract with it.
On the next article we'll solve the last of the Math challenges: 'Fifty years'.