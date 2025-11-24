// Parallax Stars
const starsLayer = document.getElementById('stars-layer');
for(let i=0;i<300;i++){
  let star=document.createElement('div');
  star.style.position='absolute';
  star.style.width=star.style.height=(Math.random()*2+1)+'px';
  star.style.top=Math.random()*100+'%';
  star.style.left=Math.random()*100+'%';
  star.style.background='white';
  star.style.opacity=Math.random();
  star.style.borderRadius='50%';
  star.style.animation=`twinkle ${Math.random()*3+2}s infinite alternate`;
  starsLayer.appendChild(star);
}

// Hover interactive planets
document.querySelectorAll('.floating-planet').forEach(p=>{
  p.addEventListener('mouseenter',()=>{
    alert('🌍 Fun fact: This planet represents math exploration!');
  });
});
