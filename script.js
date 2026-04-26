let board = document.querySelector("#board")
let toolbar = document.querySelector("#toolbar")
let boxBtn = document.querySelector("#box")
let textbox = document.querySelector("#textbox")
let eraser = document.querySelector("#eraser")
let imginput = document.querySelector("#imgInput")

// ✅ MOBILE FIX
board.style.touchAction = "none"

let clickX = null
let clickY = null

// IMAGE PICK
imginput.addEventListener("change", function(e){

    let file = e.target.files[0]
    if (!file || clickX === null || clickY === null) return

    let img = document.createElement("img")
    img.src = URL.createObjectURL(file)

    img.style.width = "100px"
    img.style.height = "100px"
    img.style.position = "absolute"

    img.style.left = clickX + "px"
    img.style.top = clickY + "px"

    img.style.cursor = "move"
    img.classList.add("box")

    // ✅ mobile fix
    img.draggable = false
    img.style.userSelect = "none"

    img.onload = () => URL.revokeObjectURL(img.src)

    board.append(img)

    imginput.value = ""
    clickX = null
    clickY = null
})

// MODES
let makebox = false
let iswrite = false 
let iserase = false 

eraser.addEventListener("click", function () {
    iserase = true
    iswrite = false
    makebox = false
    board.style.cursor = "crosshair"
})

textbox.addEventListener("click", function () {
    iswrite = true
    iserase = false
    makebox = false
    board.style.cursor = "text"
})

boxBtn.addEventListener("click", function () {
    makebox = true
    iswrite = false
    iserase = false
    board.style.cursor = "default"
})

// DRAG / RESIZE STATE
let isresize = false
let isdrag = false 
let currentElement = null

let offsetX = 0
let offsetY = 0

let initialWidth = 0
let initialHeight = 0
let initialLeft = 0
let initialTop = 0

let startmousex = 0
let startmousey = 0
let detect = null

// POINTER DOWN (was mousedown)
board.addEventListener("pointerdown", (e) => {

    let rect = board.getBoundingClientRect()

    clickX = e.clientX - rect.left + board.scrollLeft
    clickY = e.clientY - rect.top + board.scrollTop

    // ERASER
    if (iserase) {
        if (
            e.target.classList.contains("box") ||
            e.target.classList.contains("text")
        ) {
            e.target.remove()
        }
        return
    }

    // CREATE BOX
    if (makebox) {
        let div = document.createElement("div")

        div.style.position = "absolute"
        div.style.left = clickX + "px"
        div.style.top = clickY + "px"

        div.style.width = "100px"
        div.style.height = "100px"
        div.style.border = "2px solid black"

        div.classList.add("box")

        board.append(div)

        makebox = false
        return
    }

    // CREATE TEXT
    if (iswrite) {
        let div = document.createElement("div")

        div.style.position = "absolute"
        div.style.left = clickX + "px"
        div.style.top = clickY + "px"

        div.style.minWidth = "60px"
        div.style.minHeight = "30px"
        div.style.outline = "none"
        div.style.cursor = "text"
div.style.fontSize = "2rem"
div.style.color = "black"
div.style.fontFamily = 
        div.contentEditable = true
        div.classList.add("text")

        board.append(div)
        div.focus()

        iswrite = false
        return
    }

    // DRAG / RESIZE
    if (e.target.classList.contains("box")) {

        currentElement = e.target  

        // ✅ pointer capture (mobile stable drag)
        currentElement.setPointerCapture(e.pointerId)

        startmousex = e.clientX
        startmousey = e.clientY

        const rect = currentElement.getBoundingClientRect()

        initialWidth = rect.width
        initialHeight = rect.height
        initialLeft = currentElement.offsetLeft
        initialTop = currentElement.offsetTop

        const mouseXInside = e.clientX - rect.left
        const mouseYInside = e.clientY - rect.top

        const gap = 10

        if (mouseXInside > rect.width - gap) {
            isresize = true
            isdrag = false
            detect = "right"
            currentElement.style.cursor = "ew-resize"
        }
        else if (mouseXInside < gap) {
            isresize = true
            isdrag = false
            detect = "left"
            currentElement.style.cursor = "ew-resize"
        }
        else if (mouseYInside < gap) {
            isresize = true
            isdrag = false
            detect = "top"
            currentElement.style.cursor = "ns-resize"
        }
        else if (mouseYInside > rect.height - gap) {
            isresize = true
            isdrag = false
            detect = "bottom"
            currentElement.style.cursor = "ns-resize"
        }
        else {
            isdrag = true
            isresize = false
            currentElement.style.cursor = "move"

            offsetX = clickX - currentElement.offsetLeft
            offsetY = clickY - currentElement.offsetTop
        }
    }
})

// POINTER MOVE (was mousemove)
document.addEventListener("pointermove", (e) => {

    if (isresize && currentElement) {

        let dx = e.clientX - startmousex
        let dy = e.clientY - startmousey

        if (detect === "right") {
            currentElement.style.width = initialWidth + dx + "px"
        }
        else if (detect === "left") {
            currentElement.style.left = initialLeft + dx + "px"
            currentElement.style.width = initialWidth - dx + "px"
        }
        else if (detect === "top") {
            currentElement.style.top = initialTop + dy + "px"
            currentElement.style.height = initialHeight - dy + "px"
        }
        else if (detect === "bottom") {
            currentElement.style.height = initialHeight + dy + "px"
        }

        return
    }

    if (!isdrag || !currentElement) return

    let rect = board.getBoundingClientRect()

    let x = e.clientX - rect.left + board.scrollLeft - offsetX
    let y = e.clientY - rect.top + board.scrollTop - offsetY

    currentElement.style.left = x + "px"
    currentElement.style.top = y + "px"
})

// POINTER UP (was mouseup)
document.addEventListener("pointerup", (e) => {

    if (currentElement) {
        currentElement.releasePointerCapture(e.pointerId)
    }

    isresize = false
    isdrag = false
    currentElement = null

    if (!iserase) {
        board.style.cursor = "default"
    }
})

// ERASER HOVER
board.addEventListener("mouseover", (e) => {
    if (iserase && (e.target.classList.contains("box") || e.target.classList.contains("text"))) {
        e.target.style.opacity = "0.5"
    }
})

board.addEventListener("mouseout", (e) => {
    if (e.target.classList.contains("box") || e.target.classList.contains("text")) {
        e.target.style.opacity = "1"
    }
})

//gsap start 
let t1 = gsap.timeline();


t1.from("#hero img", {
    z: -500,          // Start far away (negative Z is "into" the screen)
    scale: 0.5,       // Adding scale makes the 3D effect much stronger
    opacity: 0,
    duration: 1.2,
    delay : 1,
    ease: "power3.out",
}, "-=0.4");          // This makes the image start slightly before the text finishes
t1.from("#hero span h1", {
    y: 100, // Changed to Y for a smoother entrance
    opacity: 0,
    duration: 0.8,
    ease: "power4.out",
    stagger : 0.4
})
// t1.from("#hero button",{
//     x:-400 ,
   
//         duration: 0.8,
//     ease: "power4.out",
// })
let hero = document.querySelector("#hero")
let enter = document.querySelector("#hero button")
let back = document.querySelector("#board #back")
enter.addEventListener("click",function(){
    hero.style.display = "none"
    board.style.display = "block"

})
back.addEventListener("click",function(){
      hero.style.display = "block"
    board.style.display = "none"
})