export function createPortalRoot(id: string): HTMLDivElement {
  const root = document.createElement('div');
  root.setAttribute('id', id);

  return root;
}

let prevScrollY = 0;

export function lockBody(body: HTMLElement) {
  body.dataset['hidden'] = (
    Number(body?.dataset['hidden'] ?? 0) + 1
  ).toString();
  body.classList.add('hidden');

  if (Number(body?.dataset['hidden']) === 1) {
    const header = body.querySelector('header');
    const currentScrollY = window.scrollY;
    body.style.position = 'fixed';
    body.style.width = '100%';
    body.style.top = `-${currentScrollY}px`;
    body.style.overflowY = 'scroll';

    prevScrollY = currentScrollY;

    if (header) {
      header.style.top = '0';
    }
  }
}

export function unlockBody(body: HTMLElement) {
  const hiddenCount = Number(body.dataset['hidden'] ?? 0) - 1;

  if (hiddenCount === 0) {
    const header = body.querySelector('header');

    body.classList.remove('hidden');
    body.style.position = '';
    body.style.width = '';
    body.style.top = '';
    body.style.overflowY = '';
    window.scrollTo(0, prevScrollY);
    prevScrollY = 0;

    if (header) {
      header.style.top = '';
    }
  }

  body.dataset['hidden'] = hiddenCount > 0 ? hiddenCount.toString() : '0';
}
