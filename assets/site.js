function setCookie(name, value) {
  const d = new Date();
  d.setTime(d.getTime() + 365*24*60*60*1000);
  document.cookie = name+'='+value+';expires='+d.toUTCString()+';path=/;SameSite=Lax';
}
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )'+name+'=([^;]*)'));
  return match ? match[1] : null;
}

function toggleSettings(e) {
  e.stopPropagation();
  const btn = document.getElementById('settings-btn');
  const menu = document.getElementById('settings-menu');
  const open = menu.classList.toggle('open');
  btn.classList.toggle('open', open);
}
document.addEventListener('click', function(e) {
  const wrap = document.querySelector('.settings-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('settings-menu').classList.remove('open');
    document.getElementById('settings-btn').classList.remove('open');
  }
});

function setFont(font, e) {
  if (e) e.stopPropagation();
  document.body.classList.toggle('comic', font === 'comic');
  document.getElementById('opt-normal').classList.toggle('active', font === 'normal');
  document.getElementById('opt-comic').classList.toggle('active', font === 'comic');
  setCookie('ui_font', font);
  document.getElementById('settings-menu').classList.remove('open');
  document.getElementById('settings-btn').classList.remove('open');
}
(function(){
  const saved = getCookie('ui_font');
  if (saved) setFont(saved);
})();

function setTheme(theme, e) {
  if (e) e.stopPropagation();
  document.body.classList.toggle('light', theme === 'light');
  var dEl = document.getElementById('opt-dark');
  var lEl = document.getElementById('opt-light');
  if (dEl) dEl.classList.toggle('active', theme !== 'light');
  if (lEl) lEl.classList.toggle('active', theme === 'light');
  setCookie('ui_theme', theme);
  document.getElementById('settings-menu').classList.remove('open');
  document.getElementById('settings-btn').classList.remove('open');
}
(function(){
  var savedTheme = getCookie('ui_theme');
  if (savedTheme === 'light') setTheme('light');
})();

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const open = sidebar.classList.toggle('open');
  overlay.classList.toggle('open', open);
}

function showTab(name, btn) {
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active');});
  document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
  document.getElementById('view-'+name).classList.add('active');
  btn.classList.add('active');
}

function goTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({behavior:'smooth'});
  document.querySelectorAll('.sidelink').forEach(function(l){l.classList.remove('active');});
  const byDataSec = document.querySelector('.sidelink[data-sec="'+id+'"]');
  if (byDataSec) {
    byDataSec.classList.add('active');
  } else if (event && event.target) {
    event.target.classList.add('active');
  }
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

function diaClick(sectionId, el) {
  document.querySelectorAll('.dia-comp').forEach(function(g){g.classList.remove('dia-active');});
  el.classList.add('dia-active');
  const sec = document.getElementById(sectionId);
  if (sec) sec.scrollIntoView({behavior:'smooth', block:'start'});
  document.querySelectorAll('.sidelink').forEach(function(l){l.classList.remove('active');});
  const link = document.querySelector('.sidelink[data-sec="'+sectionId+'"]');
  if (link) link.classList.add('active');
}

const observer = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if (e.isIntersecting) {
      const id = e.target.id;
      document.querySelectorAll('.sidelink').forEach(function(l){
        const sec = l.getAttribute('data-sec');
        const oc = l.getAttribute('onclick');
        const matches = (sec === id) || (oc && oc.indexOf("'"+id+"'") !== -1);
        l.classList.toggle('active', matches);
      });
    }
  });
}, {rootMargin:'-10% 0px -80% 0px'});
document.querySelectorAll('.section').forEach(function(s){observer.observe(s);});
