# Propuesta TP DSW

## Grupo
### Integrantes
* 52285 - Gregoret, Agustín
* 53742 - Bolzico, Nicolás
* 53952 - Cabrera, Martín Leonel

---

## Tema

### Descripción
Aplicación web para la gestión de campañas de juegos de rol de mesa (TTRPG), permitiendo crear campañas, administrar personajes y organizar eventos.  
Facilita la interacción entre jugadores y directores de juego, así como el seguimiento del estado y progreso de los personajes.

---

### Modelo
# Modelo de Dominio / Diagrama de Clases

```mermaid
classDiagram
    direction TB

    class CAMPAÑA {
        ID
        nombre
        descripción
        estado
    }

    class MAPA {
        ID
        nombre
        descripción
        estado
    }

    class FICHA_MAPA {
        posición
        estado
    }

    class imagen {
        ID
        nombre
        descripción
        archivo
    }

    class CatObjeto {
        ID
        nombre
    }

    class Objeto {
        id
        nombre
        descripción
        visibleAJugador
        valor
    }

    class USUARIO {
        ID
        nombre
        contraseña
        tipo
    }

    class Personaje {
        ID
        nombre
        descripción
        especie
        armadura
        iniciativa
        velocidad
        vidaMax
        fuerza
        destreza
        constitución
        inteligencia
        carisma
        sabiduría
    }

    class JUGABLE {
        nivel
        manaMax
        clase
        experiencia
        oro
    }

    class NoJugable {
        estadoAgresion
        vidaActual
    }

    class Rasgo {
        ID
        nombre
        visibleAJugador
        descripción
        nivelMinimo
    }

    class Acción {
        ID
        nombre
        visibleAJugador
        descripción
        costoMana
    }

    class PersonajeCampaña {
        ID
        nombre
        armadura
        iniciativa
        velocidad
        vidaMax
        vidaActual
        nivel
        oro
        experiencia
        clase
        manaMax
        manaActual
        fuerza
        destreza
        constitución
        sabiduría
        carisma
        inteligencia
    }

    %% Relaciones
    CAMPAÑA "1" *-- "0..*" MAPA
    MAPA "0..*" -- "1" imagen : tiene >
    MAPA "1" -- "0..*" FICHA_MAPA : tiene >

    FICHA_MAPA "0..*" -- "0..1" imagen
    FICHA_MAPA "0..*" -- "0..1" NoJugable

    CatObjeto "1" o-- "0..*" Objeto
    Objeto "0..*" -- "0..1" imagen
    Objeto "0..*" -- "0..*" Personaje : tiene (Cantidad) >

    Personaje <|-- JUGABLE
    Personaje <|-- NoJugable

    Personaje "0..*" -- "0..*" Rasgo : tiene >
    Personaje "0..*" -- "0..*" Acción
    CAMPAÑA "0..1" -- "0..*" Personaje
    CAMPAÑA "0..1" -- "0..1" NoJugable

    USUARIO "0..1" -- "0..*" CAMPAÑA : crea >
    USUARIO "0..*" -- "1..1" CAMPAÑA : participa >
    USUARIO "0..1" -- "0..*" JUGABLE : crea >

    CAMPAÑA "1..*" -- "0..*" PersonajeCampaña : participan
    USUARIO "1" -- "0..*" PersonajeCampaña
    JUGABLE "1" -- "0..*" PersonajeCampaña

    PersonajeCampaña "0..*" -- "0..*" Objeto : tiene >
    PersonajeCampaña "0..*" -- "0..*" Rasgo : tiene >
    PersonajeCampaña "0..*" -- "0..*" Acción : tiene >
```

## Alcance Funcional 

### Alcance Mínimo

Regularidad:

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Campaña<br>3. CRUD Rasgo|
|CRUD dependiente|1. CRUD Personaje {depende de} CRUD Usuario<br>2. CRUD Participación {depende de} CRUD Usuario CRUD Jugable y CRUD Campaña|
|Listado<br>+<br>detalle|1. Listado de campañas filtrado por estado, muestra nombre, master e imagen => detalle permite unirse y entrar a la sesión<br>2. Listado de NPC filtrado por estadoAgresión, muestra nombre y descripción => detalle con todos los atributos|
|CUU/Epic|1. CUU crear un evento con su descripción e imagenes y asignarle personajes<br>2. Comenzar campaña y activar un evento|

---

### Adicionales para Aprobación

|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Campaña<br>3. CRUD Participación<br>4. CRUD Personaje<br>5. CRUD Jugable<br>6. CRUD NoJugable<br>7. CRUD Objeto<br>8. CRUD CatObjeto<br>9. CRUD Rasgo<br>10. CRUD Acción<br>11. CRUD Estadística<br>12. CRUD Imagen|
|CUU/Epic|1. Crear un personaje con atributos, habilidades, estadísticas y objetos<br>2. Sistema de chat entre jugadores en partida.<br>3. Activar evento y consultar estado de personajes participantes<br>4. Modificar atributos y gestionar objetos durante la campaña|

---

## Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de objetos de un personaje filtrado por categoría, muestra nombre y valor => detalle con descripción e imagen|
|CUU/Epic|1. Invitar usuario a campaña privada y confirmar ingreso<br>2. Asignar personaje a campaña|
|Otros|1. Envío de invitación o notificación por email<br>2. Sistema de dados que puede utilizarse en campaña y escribe resultado por el chat|
