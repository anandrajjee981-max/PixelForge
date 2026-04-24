let board = document.querySelector("#board")
let toolbar = document.querySelector("#toolbar")
let boxBtn = document.querySelector("#box")
let textbox = document.querySelector("#textbox")
let makebox = false
let iswrite = false 
textbox.addEventListener("click",function(){
iswrite = true 

})
boxBtn.addEventListener("click", function () {
makebox = true 


})

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

board.addEventListener("mousedown", (e) => {
if(makebox){
    let div = document.createElement("div")

    let rect = board.getBoundingClientRect()

    let x = e.clientX - rect.left
    let y = e.clientY - rect.top

    div.style.position = "absolute"
    div.style.left = x + "px"
    div.style.top = y + "px"

    div.style.width = "100px"
    div.style.height = "100px"
    div.style.border = "2px solid black"

    div.classList.add("box")

    board.append(div)

    makebox = false   // ✅ yahi pe reset
    return            // ✅ VERY IMPORTANT
}
  if(iswrite){
 let div = document.createElement("div")

    let rect = board.getBoundingClientRect()

    let x = e.clientX - rect.left
    let y = e.clientY - rect.top
      div.style.position = "absolute"
    div.style.left = x + "px"
    div.style.top = y + "px"
     div.style.minWidth = "60px"
    div.style.minHeight = "30px"
    div.style.outline = "none"
div.style.cursor = "text"
div.contentEditable = true ;
div.classList.add("text")
board.append(div)
div.focus()
iswrite = false 
return 

  }
    if (e.target.classList.contains("box")) {

        currentElement = e.target  

        startmousex = e.clientX
        startmousey = e.clientY

        const rect = currentElement.getBoundingClientRect()

        // ✅ SIZE → rect
        initialWidth = rect.width
        initialHeight = rect.height

        // ✅ POSITION → offset
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

            offsetX = e.clientX - rect.left
            offsetY = e.clientY - rect.top
        }
    }
})

document.addEventListener("mousemove", (e) => {

    // ✅ RESIZE
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

    // ✅ DRAG
    if (!isdrag || !currentElement) return

    let x = e.clientX - offsetX
    let y = e.clientY - offsetY

    currentElement.style.left = x + "px"
    currentElement.style.top = y + "px"
})

document.addEventListener("mouseup", () => {
    isresize = false
    isdrag = false
    currentElement = null
   
})