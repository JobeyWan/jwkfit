<script>
  export let form;
</script>

<svelte:head>
  <title>Contact | Jobey Wan Kenobi Fitness</title>
  <meta name="description" content="Contact Jobey Wan Kenobi Fitness to book a personal training consultation." />
</svelte:head>

<section class="page-hero section reveal">
  <p class="eyebrow">Contact</p>
  <h1>Ready for a stronger routine?</h1>
  <p>
    Send a quick note with your goals and preferred schedule. Jobey Wan Kenobi Fitness will follow up to
    book a consultation.
  </p>
</section>

<section class="section contact-layout">
  <form class="contact-form reveal" method="POST" action="?/sendEmail">
    <label>
      Name
      <input type="text" name="name" placeholder="Your name" value={form?.values?.name || ''} required />
    </label>
    <label>
      Email
      <input type="email" name="email" placeholder="you@example.com" value={form?.values?.email || ''} required />
    </label>
    <label>
      Training Goal
      <select name="goal" value={form?.values?.goal || ''} required>
        <option value="">Select a goal</option>
        <option>Build strength</option>
        <option>Lose body fat</option>
        <option>Improve athletic performance</option>
        <option>Move and feel better</option>
      </select>
    </label>
    <label>
      Message
      <textarea name="message" rows="5" placeholder="Tell us what you want to accomplish">{form?.values?.message || ''}</textarea>
    </label>
    <button class="btn btn-primary" type="submit">Send inquiry</button>
    {#if form?.success}
      <p class="form-note success-note" aria-live="polite">Thanks. Your inquiry was sent successfully.</p>
    {:else if form?.error}
      <p class="form-note error-note" aria-live="polite">{form.error}</p>
    {:else}
      <p class="form-note" aria-live="polite"></p>
    {/if}
  </form>

  <aside class="contact-card reveal">
    <p class="eyebrow">Book directly</p>
    <h2>Let&apos;s make your next season stronger.</h2>
    <ul class="contact-list">
      <li><span>Email</span><a href="mailto:Jobeywankenobifitness@gmail.com">Jobeywankenobifitness@gmail.com</a></li>
      <li><span>Phone</span><a href="tel:+16025550145">(480) 307-3084</a></li>
      <li><span>Location</span><p>Phoenix, AZ and remote coaching</p></li>
    </ul>
  </aside>
</section>
