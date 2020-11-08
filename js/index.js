const poke_container = document.getElementById('poke_container');
const pokemons_number = 10;
search = false;
[pokemonEl, pokeInnerHTML, poke_types, type, name, color, img, tipos, select, total_pokemons, historial, searchLocalHistory] = '';
pokemon = [], domPokemons = [], pokemons = [], searchHistory = [], data_pokemon = [], x = [];
searchLocalHistory = localStorage.getItem("searchHistory");
const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};
const types = [
    'fire',
    'grass',
    'electric',
    'water',
    'ground',
    'rock',
    'fairy',
    'poison',
    'bug',
    'dragon',
    'psychic',
    'flying',
    'fighting',
    'normal'
];
// Populate Type Select
tipos = types.toString().split(",");
tipos = tipos.sort();
select = $(".type-select");
for (let index = 0; index < tipos.length; index++) {
    select.append($('<option>',
        {
            value: tipos[index],
            text: tipos[index]
        }));
}

const main_types = Object.keys(colors);

// Load search localstorange history
let aux = JSON.parse(searchLocalHistory);
if(aux != null){
    for (let i = 0; i < aux.length; i++) {
        searchHistory.push({
            "busqueda": aux[i].busqueda,
            "fecha": aux[i].fecha,
            "hora": aux[i].hora
        });
    }
}

const fetchPokemons = async () => {
    for (let i = 1; i <= pokemons_number; i++) {
        await getPokemon(i);
    }
};
getPokemon = async id => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    pokemon = await res.json();
    createPokemonCard(pokemon);
};

function createPokemonCard(pokemon) {
    pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');
    if (pokemon.types != undefined) {
        poke_types = pokemon.types.map(type => type.type.name);
        type = main_types.find(type => poke_types.indexOf(type) > -1);
        name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
        color = colors[type];
        pokeInnerHTML = `
            <div class="img-container">
                <img src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" class="mw-100" alt="${name}"/>
            </div>`;
    }
    else {
        img = pokemon.img;
        name = pokemon.name;
        color = colors[pokemon.type];
        poke_types = pokemon.type;
        pokeInnerHTML = `
            <div class="img-container">
                <img src = "images/${img}" class="mw-100" width="120" alt="${name}"/>
            </div>`;
    }
    pokemonEl.style.backgroundColor = color;
    pokeInnerHTML += `
            <div class="mt-2" id="${pokemon.id}">
                <h3 class="name">${name}</h3>
                <small class="type">Type: <span>${poke_types}</span></small>
            </div>
            `;


    pokemonEl.innerHTML = pokeInnerHTML;

    poke_container.appendChild(pokemonEl);
}

fetchPokemons();
fetchDBPokemons();

$('.search_icon').click(function () {
    busquedas();
});

// Search Pokemons Function
function busquedas() {
    let filter = $('.search_input').val().toLowerCase(); //Saving the search value
    total_pokemons = $('.pokemon');
    if (filter != "") {
        for (let i = 0; i < total_pokemons.length; i++) {
            // Get the pokemon card name by class name
            data_pokemon = $(".pokemon > .mt-2 > .name")[i].textContent.toLowerCase();
            if (data_pokemon) {
                // Changing pokemon card display to none, when search is apply
                if (data_pokemon.indexOf(filter) > -1) {
                    // historial = total_pokemons[i].getElementsByClassName('name')[0].innerText;
                    total_pokemons[i].style.display = "";
                }
                else {
                    total_pokemons[i].style.display = "none";
                }
            }
        }
    }
    if (filter == '') {
        for (let i = 0; i < total_pokemons.length; i++) {
            total_pokemons[i].style.display = "";
        }
    }
    if (filter != '') {
        var date = new Date();
        var fecha = date.getDay() +'/' +date.getMonth() + '/'+ date.getFullYear();
        var hora = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        searchHistory.push({
            "busqueda": filter,
            "fecha": fecha,
            "hora": hora
        });
        historial = '';
        // Store

        localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
        // localStorage.setItem('searchHistory',JSON.stringify(searchLocalHistory));
        searchLocalHistory = localStorage.getItem("searchHistory");
        console.log('searchLocalHistory: ', aux);
        console.log('searchLocalHistory: ', aux.length);
    }
}
// Search Pokemons
$('.search_input').keyup(function (e) {
    let filter = $('.search_input').val().toLowerCase();
    if (e.keyCode == 13) {
        busquedas();
    }
    if (filter == '') {
        for (let i = 0; i < total_pokemons.length; i++) {
            total_pokemons[i].style.display = "";
        }
    }
});

// Save New Person
$('#newCountForm').submit(function (e) {
    const postData = {
        name: $('#inputName').val(),
        mail: $('#inputMail').val(),
        password: $('#inputPassword').val()
    };
    console.log(postData);
    $.post("./php/persons/person-add.php", postData,
        function (response) {
            if (response == "Tu cuenta ha sido creada correctamente") {
                swal(response, { icon: "success", })
                $('#newCountForm').trigger('reset');
                $("#newCountForm .close").click()
            }
            else {
                swal(response, { icon: "error", });
            }
        }
    );
    e.preventDefault();
});


//Save New Pokemon 
$("#newPokemonForm").on('submit', (function (e) {
    e.preventDefault();
    $.ajax({
        url: "./php/pokemon/pokemon-add.php",
        type: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
            fetchDBPokemons(); // Get all pokemons from DB and refresh it on Front End
            swal(data, { icon: "success", }); //Show Alert
            // Clear the FORM
            $('#newPokemonForm').trigger('reset');
            // Close MODAL
            $("#newPokemonForm .close").click();
        }
    });
}));


// Get all pokemons from DB
function fetchDBPokemons() {
    $.ajax({
        url: './php/pokemon/pokemon-list.php',
        type: 'GET',
        success: function (response) {
            let pokemons_response = JSON.parse(response);
            pokemons_response.forEach(pokemon => {
                pokemons.push({
                    "id": pokemon.id,
                    "img": pokemon.imagen,
                    "poke_types": pokemon.type,
                    "name": pokemon.name
                });
                createPokemonCard(pokemon);
            });
        }
    })
}

// Get History
$('.history').click(function () {
    for (let i = 0; i < searchHistory.length; i++) {
        // Create history modal table
        $("#historyModal").find('.modal-body .table tbody').append(`<tr>
                                                                        <td class="text-muted">${searchHistory[i].fecha}</td>
                                                                        <td class="text-muted">${searchHistory[i].hora}</td>
                                                                        <td>${searchHistory[i].busqueda}</td>
                                                                    </tr>`);
        
    }
});

// Image upload validation
$(document).on('change', ':file',function () {
    const file = this.files[0];
    const fileType = file['type'];
    const validImageTypes = ['image/*'];
    if (!validImageTypes.includes(fileType)) {
        swal('Solo imagenes son permitidas', { icon: "error", }); //Show Alert
        this.value = '';
    }
});