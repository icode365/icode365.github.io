let pacman = document.getElementById("pacman");

let progress = 0;

let path = [
{x:100,y:150},
{x:600,y:300},
{x:300,y:700},
{x:900,y:1100},
{x:200,y:1600},
{x:1000,y:2200}
];

window.addEventListener("wheel",(e)=>{

progress += Math.abs(e.deltaY)*0.002;

movePacman(progress);

});


function movePacman(t){

let index = Math.floor(t)%path.length;
let next = (index+1)%path.length;

let lerp = t - Math.floor(t);

let x = path[index].x + (path[next].x - path[index].x)*lerp;
let y = path[index].y + (path[next].y - path[index].y)*lerp;

pacman.style.transform =
`translate(${x}px,${y}px)`;

}

const watchButton = document.getElementById("watchButton");
const videoContainer = document.getElementById("videoContainer");
const demoVideo = document.getElementById("demoVideo");

if (watchButton && videoContainer && demoVideo) {
    watchButton.addEventListener("click", () => {
        videoContainer.style.display = "block";
        demoVideo.play();
        watchButton.style.display = "none";
    });
}