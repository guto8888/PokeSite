const insertPoke = document.querySelector(".pokeList")
const btnSearch = document.querySelector(".btnSearch")

function pokeRender(pokeItem, max){
    pokeItem.forEach(async pokeRender => {
        const {h1, h3, ul, li1, li2, li3, divImg, div, div2, p, div3} = await pokeRender
        let newContent = Number(h3.textContent.slice(1))
        let newMax = Number(max.slice(1))
        if(newContent < 31 && newMax === 31){
            gerateHtml(ul, li1, li2, li3, div3, h3, h1, div2, div, insertPoke, divImg, p)
        }
        if(newContent < 61 && newContent > 30  && newMax === 62){
            gerateHtml(ul, li1, li2, li3, div3, h3, h1, div2, div, insertPoke, divImg, p)
        }
        if(newContent < 91 && newContent > 60  && newMax === 124){
            gerateHtml(ul, li1, li2, li3, div3, h3, h1, div2, div, insertPoke, divImg, p)
        }
        if(newContent < 151 && newContent > 90  && newMax === 248){
            gerateHtml(ul, li1, li2, li3, div3, h3, h1, div2, div, insertPoke, divImg, p)
        }
        if(h3.textContent === max) nextPoke()
    })
}

function addClass(tag, ...className) {
    className.forEach(itemClass => tag.classList.add(itemClass))
}

function createElement(element) {
  return  document.createElement(element)
}

function creatHtml(pokeInfo){
    const pokeArr = pokeInfo.map(async element => {
        const {id, name, moves, sprites, types} = await element

        const div = createElement("div")
        const div2 = createElement("div")
        const divImg = createElement("div")
        const img = createElement("img")
        const h1 = createElement("h1")
        const h3 = createElement("h1")
        const ul = createElement("ul")
        const li1 = createElement("li")
        const li2 = createElement("li")
        const li3 = createElement("li")
        const p = createElement("p")
        const div3 = createElement("div")

        let divColor = ""
        const pColor = "bg-danger-subtle"

        const liColor = "bg-info-subtle"
        switch(types[0].type.name){
                case "dragon":
                divColor = "dragon"
                break
                case "ghost":
                divColor = "ghost"
                break
                case "bug":
                divColor = "bg-success-subtle"
                break
                case "grass":
                divColor = "bg-success"
                break
                case "flying":
                divColor = "bg-secondary-subtle"
                break
                case "rock":
                divColor = "bg-secondary"
                break
                case "water":
                divColor = "bg-primary"
                break
                case "fighting":
                divColor = "fight"
                break
                case "fairy":
                divColor = "fairy"
                break
                case "ice":
                divColor = "bg-primary-subtle"
                break
                case "poison":
                divColor = "poison"
                break
                case "psychic":
                divColor = "bg-danger-subtle"
                break
                case "ground":
                divColor = "bg-warning-subtle"
                break
                case "electric":
                divColor = "bg-warning"
                break
                case "fire":
                divColor = "bg-danger"
                 break
                case "normal":
                divColor = "normal"
                break
            }
     
            addClass(div, divColor, "card", "me-2", "mb-2", "bg-gradient")  
            addClass(h1, "card-title", "ms-3")
            addClass(h3, "numText", "card-title")
            addClass(li1, "list-group-item", liColor, "font-monospace")
            addClass(li2, liColor, "list-group-item", "font-monospace")
            addClass(li3, liColor, "mb-3", "font-monospace", "list-group-item")
            addClass(ul, "list-group", "mb-4", "list-group-flush")
            addClass(img, "mt-3", "ms-2", "card-img-top")
            addClass(p, "mb-0", pColor, "pOfSkill")
            addClass(div2, "card-body")
            addClass(div3, "d-flex", "flex-row")

            div.style = "width:27rem"
            h1.innerText = name.toUpperCase()
            h3.innerText = `#${id}`
            li1.innerText = moves[0].move.name
            li2.innerText = moves[1]?.move.name
            li3.innerText = moves[2]?.move.name
            img.src = sprites.other.dream_world.front_default
            img.style = "width: 15rem"
            p.innerText = "Principais Habilidades: "

            divImg.append(img)

            return {h1, h3, ul, li1, li2, li3, divImg, div, div2, p, div3}
        })
        return pokeArr
}

function gerateHtml(ul, li1, li2, li3, div3, h3, h1, div2, div, insertPoke, divImg, p) {
    ul.append(li1, li2, li3)
    div3.append(h3, h1)
    div2.append(div3)
    div.append(divImg, div2,p, ul)
    insertPoke.append(div)
}

async function pokeApi() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150&offset=0")
    if(!response.ok) throw Error("Não foi possivel")
    const { results: apiResults } = await response.json()
    const promises = apiResults.map(result => fetch(result.url))
    const responses = await Promise.allSettled(promises)
    const fullfilled = responses.filter(response => response.status === "fulfilled")
    const pokePromises = fullfilled.map(url => url.value.json())
    const pokemons = await Promise.all(pokePromises)
    
    const pokeInfo = pokemons.map(async pokeInfo => {
        const pokeObj = await pokeInfo
        const { id, name, moves, types, sprites } = pokeObj 
        return {id, name, moves, sprites, types}     
    });
    return pokeInfo
}

let max = 31

async function pokeDex(max) {
    try {
        let pokeResult = await pokeApi()
        const pokeItem = creatHtml(pokeResult)
        pokeRender(pokeItem, `#${max}`)
    } catch (error) {
        console.log("Algo deu errado")
    } 
}

function nextPoke() {
    const pokeObs = new IntersectionObserver(([lastPoke], observer) => {
        if(!lastPoke.isIntersecting){
            return
        }
        max*=2
        pokeDex(max)
        observer.unobserve(lastPoke.target)
    })
    const getLastPoke = document.querySelector(".pokeList").childNodes
    pokeObs.observe(getLastPoke[getLastPoke.length - 1])
}

function pokeSearch(pokeItem){
    insertPoke.innerHTML = ""
    if(pokeItem.length === 0) {
        const text = createElement("h1")
        addClass(text, "f-2", "mb-5", "pt-5", "mt-5", "pb-5", "text-white")
        text.textContent = "Nem um Pokémon encontrado."
        insertPoke.append(text)
    } else {
            pokeItem.forEach(async pokeRender => {
                const {h1, h3, ul, li1, li2, li3, divImg, div, div2, p, div3} = await pokeRender
                gerateHtml(ul, li1, li2, li3, div3, h3, h1, div2, div, insertPoke, divImg, p)
            })}
        }

pokeDex(max)

btnSearch.addEventListener("keyup", async(ev) => {
   ev.preventDefault()
    let pokeResult = await pokeApi()
    let pokePromise = await Promise.all(pokeResult)
    let newPokeArr = await pokePromise.filter(item => item.name.includes(ev.target.value))
    const pokeItem = await creatHtml(await newPokeArr)
    pokeSearch(pokeItem)
})