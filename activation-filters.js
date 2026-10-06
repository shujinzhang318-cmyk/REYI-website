(() => {
  const controls = [...document.querySelectorAll('[data-activation-filter]')];
  const cards = [...document.querySelectorAll('[data-activation-card]')];
  const library = document.querySelector('[data-activation-library]');
  if (!library || !controls.length) return;
  const pagination = document.querySelector('[data-activation-pagination]');
  const featured = document.querySelector('[data-activation-featured]');
  const perPage = Number(library.dataset.activationPerPage) || Infinity;
  const status = document.createElement('p');
  status.className = 'activation-status container'; status.setAttribute('role','status');
  document.querySelector('.projects-filter-bar').after(status);
  let selected = 'all';
  function render(page = 1) {
    const matches = cards.filter(card => selected === 'all' ? !card.hasAttribute('data-filter-only') : card.dataset.activationCard.split(' ').includes(selected));
    const count = matches.filter(card => card.dataset.activationCard !== 'all').length + (!pagination && selected === 'all' ? 1 : 0);
    const pages = Math.max(1, Math.ceil(matches.length / perPage));
    page = Math.min(Math.max(1,page),pages);
    cards.forEach(card => { const i = matches.indexOf(card); card.hidden = i < 0 || (perPage !== Infinity && (i < (page-1)*perPage || i >= page*perPage)); });
    if(featured) featured.hidden = selected !== 'all' && !featured.dataset.activationFeatured.split(' ').includes(selected);
    controls.forEach(control => {const active = control.dataset.activationFilter === selected;control.classList.toggle('active',active);control.setAttribute('aria-pressed',String(active));});
    status.textContent = count + (pagination ? ' articles' : ' projects') + ' shown' + (pages > 1 ? ' · Page '+page+' of '+pages : '');
    if(pagination){pagination.replaceChildren();pagination.hidden = pages <= 1;for(let i=1;i<=pages && pages>1;i++){const link=document.createElement('a');link.href='#filtered-library';link.textContent=String(i);if(i===page){link.className='active';link.setAttribute('aria-current','page');}link.addEventListener('click',event=>{event.preventDefault();render(i);library.scrollIntoView({block:'start'});pagination.querySelector('[aria-current]').focus();});pagination.append(link);}}
  }
  controls.forEach(control => {control.addEventListener('click',event=>{event.preventDefault();selected=control.dataset.activationFilter;render();});control.addEventListener('keydown',event=>{if(event.key===' '){event.preventDefault();control.click();}});});
  render();
})();
