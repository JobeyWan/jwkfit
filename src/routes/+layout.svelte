<script>
  import { afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  import '../app.css';

  const year = new Date().getFullYear();

  function setupRevealAnimations() {
    if (!browser) return;

    const revealTargets = document.querySelectorAll('.reveal:not(.is-visible)');

    if (!('IntersectionObserver' in window)) {
      revealTargets.forEach((target) => target.classList.add('is-visible'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  afterNavigate(() => {
    setupRevealAnimations();
  });
</script>

<Header />
<main>
  <slot />
</main>
<Footer {year} />
