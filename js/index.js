const poke_container = document.getElementById('poke_container');
const pokemons_number = 10;
[pokemonEl, pokeInnerHTML, poke_types, type, name, color, img, tipos, select] = '';
pokemon = [], domPokemons = [], pokemons = [], searchHistory = [];
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
const types=[
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
        text : tipos[index]
    }));
}

const main_types = Object.keys(colors);

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
    else{
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

    // Search Pokemons
    $('#search').keyup(function (e) {
        console.log(e.keyCode);
        e.preventDefault();
        let filter = $('#search').val().toLowerCase(); //Saving the search value
        var total_pokemons = $('.pokemon').length;
        var tr_pokemon = $(".pokemon");
        for (let i = 0; i < total_pokemons; i++) {
            // Get the pokemon card name by class name
            var data_pokemon = $(".pokemon > .mt-2 > .name")[i];
            if(data_pokemon){
                // Changing pokemon card display to none, when search is apply
                let textValue =  data_pokemon.textContent || data_pokemon.innerHTML;
                if(textValue.toLowerCase().indexOf(filter) > -1){
                    tr_pokemon[i].style.display = "";
                    searchHistory += filter;
                }
                else
                {
                    tr_pokemon[i].style.display = "none";
                }
            }
        }
    })

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
                if(response=="Tu cuenta ha sido creada correctamente")
                {
                    swal(response, {icon: "success",})
                    $('#newCountForm').trigger('reset');
                    $("#newCountForm .close").click()
                }
                else{
                    swal(response, {icon: "error",});
                }
            }
        );
        e.preventDefault();
    });


    //Save New Pokemon 
    $("#newPokemonForm").on('submit', (function(e) {
        e.preventDefault();
        $.ajax({
            url: "./php/pokemon/pokemon-add.php",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                fetchDBPokemons(); // Get all pokemons from DB and refresh it on Front End
                swal(data, {icon: "success",}); //Show Alert
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
    $('.history').click (function () {
        console.log(searchHistory);
    });