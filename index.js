let canv = document.querySelector('.canvas');
let canv2 = document.querySelector('.canvas2');
let framesList = document.querySelector('.frames-list');
let fpsSlider = document.querySelector('.fps-slider');
let frames = [];
let ctx = canv.getContext('2d');
let isMouseDown = false;

canv.width = 600;
canv.height = 600;
ctx.lineWidth = 10;

canv.addEventListener('mousedown', () => {
  isMouseDown = true;
})

canv.addEventListener('mouseup', () => {
  isMouseDown = false;
  ctx.beginPath();
})

canv.addEventListener('mousemove', (e) => {
  if (isMouseDown) {
    ctx.lineTo(e.clientX - 390, e.clientY - 80);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(e.clientX - 390, e.clientY - 80, 5, 0, 180);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(e.clientX - 390, e.clientY - 80);
  }
})

function clear() {
  ctx.fillStyle= 'cornsilk';
  ctx.fillRect(0, 0, canv.width, canv.height);
  ctx.beginPath();
  ctx.fillStyle="black";
 }

function save() {
  let image = canv.toDataURL();
  frames.push(image);
  let f = document.querySelectorAll('.frame');
  f[f.length-1].style.backgroundImage = `url(${frames[frames.length-1]})`;
  f[f.length-1].style.backgroundSize = 'cover';  
}

function createBlock() {
  let block = document.createElement('div');
  let span = document.createElement('span');
  let bin = document.createElement('img');
  let clone = document.createElement('img');

  block.classList.add('frame');
  span.classList.add('frame-number');
  bin.classList.add('bin');
  bin.setAttribute('title', 'Delete frame');
  clone.classList.add('clone');
  clone.setAttribute('title', 'Clone frame');
  block.setAttribute('number', `${frames.length + 1}`);
  span.innerHTML = block.getAttribute('number');

  block.appendChild(span);
  block.appendChild(bin);
  block.appendChild(clone);
  return block;
}

function addBlock() {  
  framesList.appendChild(createBlock());    
}

function cloneBlock(node) {
  framesList.lastChild = node;
  setTimeout(() => {
    addBlock();
  }, 1);
}

let interval = 1000 / 10;
let timeout = 1000 / 10;
let t;
let timeouts = [];

function startInterval() {
  t = setInterval(() => {
    frames.forEach(i => {
      timeout += interval;
      canv2.style.backgroundImage = `url('')`;
      timeouts.push(setTimeout(() => {
        canv2.style.backgroundImage = `url(${i})`;
        canv2.style.backgroundSize = 'cover'; 
      }, timeout));
    });
  }, interval);
}
  
function stopInterval() {
  clearInterval(t);
  for (let i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
}

document.querySelector('.add').addEventListener('click', (e) => {
  save();
  addBlock();
  clear();
  timeout = interval;
  stopInterval();
  startInterval();  
})

document.addEventListener('click', (e) => { 
  if (e.target.classList.contains('clone')) {
    frames.push(e.target.parentElement.style.backgroundImage.slice(5, -2));
    let clone = e.target.parentNode.cloneNode(true);
    cloneBlock(clone);
  
    let f = document.querySelectorAll('.frame');
    f[f.length-1].style.backgroundImage = e.target.parentElement.style.backgroundImage;
    f[f.length-1].style.backgroundSize = 'cover';     
  }  
})

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('bin')) {
    let number = e.target.parentElement.getAttribute('number');    
    frames.splice(number-1, 1);
    framesList.removeChild(e.target.parentNode);
    timeout = interval;
    stopInterval();
    startInterval();
  
    let n = 1;
    framesList.childNodes.forEach(i => {
      if (i.className == 'frame') {        
        i.setAttribute('number', n);
        i.childNodes[0].innerText = n;
        n++;
      }
    })     
  }  
});

fpsSlider.addEventListener('change', (e) => {
  document.querySelector('.fps').innerHTML = `${fpsSlider.value} FPS`;
  interval = Math.floor(1000 / fpsSlider.value);
  timeout = Math.floor(1000 / fpsSlider.value);
  stopInterval();
  startInterval(); 
})

canv2.addEventListener('click', () => {
  document.querySelector('.preview').requestFullscreen()
})

document.addEventListener('fullscreenchange', (e) => {
  canv2.classList.toggle('inFullScreenMode');
});
  

