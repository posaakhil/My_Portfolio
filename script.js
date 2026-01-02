/* ======================================================
   script.js
   - Particle background
   - Loading overlay
   - Nav toggle + scroll-spy
   - Role typing/rotating animation
   - Intersection-triggered animations
   - Canvas charts: bar chart + donuts
   - Progress bar fills
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Remove loading overlay after a short delay and initialization
  const loading = document.getElementById('loading');

  // Basic init
  initNavToggle();
  initScrollSpy();
  initRoleRotator();
  initFadeInOnScroll();
  initParticles();
  initChartsObserver();
  initContactForm();
  setTimeout(() => {
    loading.style.opacity = 0;
    setTimeout(()=>loading.remove(), 600);
  }, 900);
});

/* NAV TOGGLE (mobile) */
function initNavToggle(){
  const btn = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    links.style.display = (links.style.display === 'flex') ? '' : 'flex';
    links.animate([{opacity:0, transform:'translateY(-6px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'cubic-bezier(.2,.9,.2,1)'});
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(a=>{
    a.addEventListener('click', ()=> {
      if(window.innerWidth < 720) links.style.display = '';
    });
  });
}

/* SCROLL-SPY: highlight active section */
function initScrollSpy(){
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const id = entry.target.id;
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if(entry.isIntersecting){
        navLinks.forEach(l=>l.classList.remove('active'));
        link && link.classList.add('active');
      }
    });
  },{threshold:0.48});

  sections.forEach(s=>obs.observe(s));
}

/* ROLE ROTATOR with typing effect */
function initRoleRotator(){
  const roles = [
    "Production Support Engineer",
    "Application Support Engineer",
    "Cloud & DevOps Support Engineer",
    "System Operations Engineer",
    "Technical Support Engineer"
  ];
  const el = document.getElementById('role-rotator');
  if(!el) return;
  let idx = 0;

  // typing loop
  function typeText(text, cb){
    el.textContent = '';
    let i=0;
    const t = setInterval(()=>{
      el.textContent += text.charAt(i);
      i++;
      if(i >= text.length){ clearInterval(t); setTimeout(cb, 1200); }
    }, 36);
  }
  function erase(cb){
    let txt = el.textContent;
    let i = txt.length;
    const t = setInterval(()=>{
      i--;
      el.textContent = txt.substring(0,i);
      if(i<=0){ clearInterval(t); cb(); }
    }, 16);
  }

  function loop(){
    typeText(roles[idx], ()=>{
      erase(()=>{
        idx = (idx+1)%roles.length;
        loop();
      });
    });
  }
  loop();
}

/* Fade-in when scrolled into view */
function initFadeInOnScroll(){
  const items = document.querySelectorAll('.fade-in, .glass, .neon-card');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        // once visible, stop observing
        observer.unobserve(e.target);
      }
    });
  },{threshold:0.12});
  items.forEach(i=>observer.observe(i));
}

/* Particles Canvas - subtle floating neon dots */
function initParticles(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w=canvas.width=innerWidth;
  let h=canvas.height=innerHeight;
  const particles = [];
  const colors = ['rgba(0,240,255,0.8)','rgba(180,0,255,0.85)'];

  function rand(min,max){return Math.random()*(max-min)+min}

  function createParticles(count=60){
    particles.length = 0;
    for(let i=0;i<count;i++){
      particles.push({
        x: rand(0,w),
        y: rand(0,h),
        r: rand(0.6,2.8),
        vx: rand(-0.15,0.15),
        vy: rand(-0.05,0.2),
        c: colors[i%colors.length],
        glow: rand(8,26)
      });
    }
  }
  createParticles(Math.floor((w*h)/80000));

  window.addEventListener('resize', ()=>{
    w=canvas.width=innerWidth;
    h=canvas.height=innerHeight;
    createParticles(Math.floor((w*h)/80000));
  });

  function draw(){
    ctx.clearRect(0,0,w,h);
    // subtle gradient background overlay
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for(const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -50) p.x = w+50;
      if(p.x > w+50) p.x = -50;
      if(p.y < -50) p.y = h+50;
      if(p.y > h+50) p.y = -50;

      // glow
      ctx.beginPath();
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.08;
      ctx.shadowBlur = p.glow;
      ctx.shadowColor = p.c;
      ctx.arc(p.x, p.y, p.r+2, 0, Math.PI*2);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* Charts: create once when visualization scrolls into view */
function initChartsObserver(){
  const viz = document.getElementById('visualization');
  if(!viz) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        initBarChart();
        initDonuts();
        initProgressBars();
        obs.unobserve(viz);
      }
    });
  },{threshold:0.28});
  obs.observe(viz);
}

/* Animated Bar Chart (canvas) */
function initBarChart(){
  const canvas = document.getElementById('barChart');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  canvas.width = canvas.width * DPR;
  canvas.height = canvas.height * DPR;
  canvas.style.width = '100%';
  canvas.style.height = '220px';
  ctx.scale(DPR, DPR);

  const data = [
    {label:'AWS',v:92},
    {label:'Monitoring',v:88},
    {label:'DevOps',v:80},
    {label:'Linux',v:86},
    {label:'API',v:84},
    {label:'DB',v:78},
    {label:'Security',v:74},
    {label:'AI/Automation',v:70}
  ];
  const padding = {left:36, right:16, top:24, bottom:34};
  const width = canvas.clientWidth;
  const height = 220;
  const barW = (width - padding.left - padding.right) / data.length - 10;

  // draw axes labels lightly
  ctx.clearRect(0,0,width,height);
  ctx.font = '12px Inter';
  ctx.fillStyle = 'rgba(255,255,255,0.06)';

  // animate fill by incrementing factor
  let t = 0;
  function drawFrame(){
    t += 0.02;
    ctx.clearRect(0,0,width,height);

    // gridlines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for(let y=0;y<=4;y++){
      const yy = padding.top + (height - padding.top - padding.bottom) * (y/4);
      ctx.beginPath(); ctx.moveTo(padding.left, yy); ctx.lineTo(width-padding.right, yy); ctx.stroke();
    }

    data.forEach((d,i)=>{
      const x = padding.left + i*(barW+10);
      const targetH = (height - padding.top - padding.bottom) * (d.v/100);
      const ease = easeOutCubic(Math.min(1, t - i*0.04));
      const h = targetH * ease;
      const y = height - padding.bottom - h;

      // bar base
      const grad = ctx.createLinearGradient(x,y,x+barW,y+h);
      grad.addColorStop(0, 'rgba(180,0,255,0.95)');
      grad.addColorStop(1, 'rgba(0,240,255,0.95)');
      roundedRect(ctx, x, y, barW, h, 8, grad);

      // glow
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = 'rgba(180,0,255,0.12)';
      ctx.fillRect(x-8, y-6, barW+16, 8);
      ctx.restore();

      // label
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '11px Inter';
      ctx.fillText(d.label, x, height - 10);
      // value
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.font = '12px Inter';
      ctx.fillText(Math.round(d.v*ease)+'%', x, y - 8);
    });

    if(t < 1.6 + data.length*0.04) requestAnimationFrame(drawFrame);
  }
  drawFrame();

  // helper functions
  function roundedRect(ctx,x,y,w,h,r, fillStyle){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  function easeOutCubic(n){return (--n)*n*n+1}
}

/* Donut meters */
function initDonuts(){
  const donuts = [
    {id:'donut1',label:'AWS',value:90,colorA:'#00f0ff',colorB:'#b400ff'},
    {id:'donut2',label:'Monitoring',value:86,colorA:'#00f0ff',colorB:'#b400ff'},
    {id:'donut3',label:'DevOps',value:82,colorA:'#00f0ff',colorB:'#b400ff'},
  ];
  donuts.forEach(d=>{
    const c = document.getElementById(d.id);
    if(!c) return;
    const ctx = c.getContext('2d');
    const size = c.width;
    const center = size/2;
    const radius = center - 12;
    const full = Math.PI*2;
    let progress = 0;

    function draw(){
      ctx.clearRect(0,0,size,size);
      // background circle
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, full);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 10;
      ctx.stroke();

      // arc
      ctx.beginPath();
      const end = (-Math.PI/2) + full*(progress/100);
      const grad = ctx.createLinearGradient(center-radius,0,center+radius,0);
      grad.addColorStop(0,d.colorA);grad.addColorStop(1,d.colorB);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.arc(center, center, radius, -Math.PI/2, end);
      ctx.stroke();

      // center text
      ctx.fillStyle = '#fff';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, center, center - 6);
      ctx.font = '12px Inter';
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillText(Math.round(progress) + '%', center, center + 14);
    }

    function animate(){
      let t=0;
      const goal = d.value;
      const id = setInterval(()=>{
        t++;
        progress = easeOutCubic(Math.min(1,t/60))*goal;
        draw();
        if(progress >= goal-0.3){ clearInterval(id); }
      }, 14);
    }
    animate();
  });

  function easeOutCubic(n){return (--n)*n*n+1}
}

/* Progress fill bars */
function initProgressBars(){
  document.querySelectorAll('.fill').forEach(el=>{
    const val = Number(el.getAttribute('data-value') || 0);
    let cur = 0;
    const step = Math.max(1, Math.round(val/25));
    const id = setInterval(()=>{
      cur += step;
      if(cur >= val){ cur = val; clearInterval(id); }
      el.style.width = cur + '%';
    }, 18);
  });
}

/* Contact form demo: simple success microinteraction */
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    setTimeout(()=>{
      btn.textContent = 'Sent ✓';
      btn.classList.add('sent');
      setTimeout(()=>{ btn.disabled=false; btn.textContent='Send Message'; btn.classList.remove('sent'); form.reset(); }, 1400);
    }, 800);
  });
}

/* Simple utility easing */
function easeOutCubic(n){return (--n)*n*n+1}

/* End of script.js */