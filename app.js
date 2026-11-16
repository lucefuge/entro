document.documentElement.classList.add('js');

const catalog = [
  ['aria','Aria','Ария'], ['zero','Zero','Зеро'], ['magic','Magic','Мейджик'],
  ['sky','Sky','Скай'], ['galant','Galant','Галант'], ['career','Career','Карьер'],
  ['royal','Royal','Роял'], ['invisible','Invisible','Инвизибл'],
  ['toscana','Toscana','Тоскана'], ['freedom','Freedom','Фридом'],
  ['rift','Rift','Рифт'], ['window','Window','Виндоу'], ['hidden','Hidden','Хайден'],
  ['unico','Unico','Унико'], ['gradient','Gradient','Градиент'],
  ['alliance','Alliance','Альянс'], ['prime','Prime','Прайм'], ['fashion','Fashion','Фэшн'],
  ['neo','NEO','Нео'], ['veneer','Veneer','Винир'], ['line','Line','Лайн'],
  ['band','Band','Бенд'], ['simple','Simple','Симпл'], ['horizon','Horizon','Хэрайзон'],
  ['forward','Forward','Форвард'], ['motion','Motion','Моушен'],
  ['slab-decor','Slab Decor','Слэб Декор'], ['mone','Mone','Моне'], ['minimal','Minimal','Минимал'],
  ['elite','Elite','Элит'], ['pure','Pure','Пур'], ['degree','Degree','Дигри'],
  ['insignia','Insignia','Инсигниа'], ['gala','Gala','Гала'], ['architect','Architect','Архитек']
];
const website = 'https://entro-design.ru/';
const wheel = document.querySelector('.drum-wheel');
const doorLink = document.querySelector('#active-door');
const position = document.querySelector('#door-count');
const doorImages = [...wheel.querySelectorAll('img')];
let step = 0;

function showDoor(change) {
  step += change;
  const length = doorImages.length;
  const index = (step % length + length) % length;
  const [slug, name] = catalog[index];
  wheel.style.setProperty('--turn', `${step * -72}deg`);
  doorLink.href = website + slug;
  doorLink.textContent = `${name} ↗`;
  position.textContent = `${String(index + 1).padStart(2, '0')} / ${String(length).padStart(2, '0')}`;
  doorImages.forEach((image, i) => image.setAttribute('aria-hidden', String(i !== index)));
}
document.querySelectorAll('[data-step]').forEach(button => {
  button.addEventListener('click', () => showDoor(Number(button.dataset.step)));
});
document.querySelector('.showcase-stage').addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  showDoor(event.key === 'ArrowLeft' ? -1 : 1);
});
showDoor(0);

const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
function showMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
}
menu.addEventListener('click', () => showMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => showMenu(false)));

const query = document.querySelector('#query');
const results = document.querySelector('#results');
const empty = document.querySelector('#empty');
function searchCatalog() {
  const term = query.value.trim().toLocaleLowerCase('ru');
  const matches = catalog.filter(([, name, russian]) =>
    [name, russian].some(value => value.toLocaleLowerCase('ru').includes(term))
  );
  results.replaceChildren(...matches.map(([slug, name, russian]) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = website + slug;
    link.textContent = `${name} — ${russian} ↗`;
    item.append(link);
    return item;
  }));
  empty.hidden = matches.length > 0;
}
query.addEventListener('input', searchCatalog);
searchCatalog();
document.querySelectorAll('[data-dialog]').forEach(button => {
  button.addEventListener('click', () => document.getElementById(button.dataset.dialog).showModal());
});

const video = document.querySelector('.hero-video');
const motionControl = document.querySelector('.motion-control');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function updateMotionControl() {
  motionControl.setAttribute('aria-label', video.paused ? 'Воспроизвести видео' : 'Приостановить видео');
  motionControl.firstElementChild.textContent = video.paused ? '▶' : 'Ⅱ';
}
video.addEventListener('playing', updateMotionControl);
video.addEventListener('pause', updateMotionControl);
video.addEventListener('loadedmetadata', () => { motionControl.hidden = false; });
video.addEventListener('error', () => { motionControl.hidden = true; });
motionControl.addEventListener('click', () => {
  if (video.paused) video.play().catch(updateMotionControl);
  else video.pause();
});
if (!reducedMotion.matches) video.play().catch(updateMotionControl);
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) video.pause(); });
