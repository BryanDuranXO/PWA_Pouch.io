const btnSubmit = document.getElementById("submit");
const inputName = document.getElementById("name");
const inputAge = document.getElementById("age");
const inputEmail = document.getElementById("email");
const divCards = document.getElementById("cards");

const db = new PouchDB('personas');

btnSubmit.addEventListener('click', (event) => {
    event.preventDefault();

    const persona = {
        _id: new Date().toISOString(),
        name: inputName.value,
        age: inputAge.value,
        email: inputEmail.value,
        status: 'pending'
    };

    db.put(persona)
        .then((response) => {
            console.log("Persona registrada con éxito:", response);
            inputName.value = '';
            inputAge.value = '';
            inputEmail.value = '';
            getPersonas();
        })
        .catch((err) => {
            console.error('Error al guardar a la persona:', err);
        });
});

function getPersonas() {
    db.allDocs({ include_docs: true })
        .then((response) => {
            divCards.innerHTML = '';
            if (response.rows.length === 0) {
                divCards.innerHTML = '<p>No hay personas registradas.</p>';
                return;
            }

            response.rows.forEach((row) => {
                const persona = row.doc;
                const card = document.createElement('div');
                card.className = 'card';
                card.style.width = '18rem';
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${persona.name}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">${persona.email}</h6>
                        <p class="card-text">Edad: ${persona.age}</p>
                        <span class="badge text-bg-success">${persona.status}</span>
                        <button type="button" class="btn btn-danger" onclick="Eliminar('${persona._id}')">Eliminar</button>


                    </div>
                `;

                divCards.appendChild(card);
            });
        })
        .catch((err) => {
            console.error('Error al obtener los documentos:', err);
        });
}

function Eliminar(id) {
    db.get(id).then(function (doc) {
        return db.remove(doc._id, doc._rev);
    }).then(function (result) {
        console.log('eliminada correctamente');
        getPersonas()
    }).catch(function (err) {
        console.log(err);
    });
}

getPersonas();
