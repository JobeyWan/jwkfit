<script>
  import { page } from '$app/stores';

  let isOpen = false;

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' }
  ];

  $: currentPath = $page.url.pathname.replace(/\/$/, '') || '/';
</script>

<svelte:body class:nav-open={isOpen} />

<header class="site-header">
  <a class="brand" href="/" aria-label="Jobey Wan Kenobi Fitness home" on:click={() => (isOpen = false)}>
    <span class="brand-mark">JW</span>
    <span>Jobey Wan Kenobi Fitness</span>
  </a>
  <button
    class="nav-toggle"
    type="button"
    aria-expanded={isOpen}
    aria-controls="site-nav"
    on:click={() => (isOpen = !isOpen)}
  >
    <span class="sr-only">Toggle navigation</span>
    <span></span><span></span><span></span>
  </button>
  <nav class="site-nav" class:is-open={isOpen} id="site-nav" aria-label="Primary navigation">
    {#each links as link}
      <a
        href={link.href}
        aria-current={currentPath === link.href ? 'page' : undefined}
        on:click={() => (isOpen = false)}
      >
        {link.label}
      </a>
    {/each}
  </nav>
</header>
