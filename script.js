let board = document.querySelector("#board")
let toolbar = document.querySelector("#toolbar")
let boxBtn = document.querySelector("#box")

boxBtn.addEventListener("click", function () {
    let div = document.createElement("div")

    div.style.border = "1px solid black"
    let uniqueId = "box-" + crypto.randomUUID()
    div.id = "uniqueId"

    div.style.width = "100px"
    div.style.height = "100px"
    div.style.position = "absolute"
    div.style.left = "50px"
    div.style.top = "50px"

    div.dataset.id = Date.now()

    board.append(div)
    
    div.classList.add("box")
})
let isdrag = false 
let currentindex = null
let xdir = 0
let ydir = 0

board.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("box")) {
        isdrag = true
        currentindex = e.target

        console.log("hi")

        const rect = currentindex.getBoundingClientRect()
        xdir = e.clientX - rect.left
        ydir = e.clientY - rect.top
    }
})

document.addEventListener("mousemove", (e) => {
    if (!isdrag) return

    let x = e.clientX - xdir
    let y = e.clientY - ydir

    currentindex.style.left = x + "px"
    currentindex.style.top = y + "px"
})

document.addEventListener("mouseup", () => {
    isdrag = false
    currentindex = null
})