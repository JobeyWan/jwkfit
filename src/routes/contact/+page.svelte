<script>
  export let form;
</script>

<svelte:head>
  <title>Contact | JWK Technologies</title>
  <meta name="description" content="Contact JWK Technologies to start a website, app, or QA review project." />
</svelte:head>

<section class="page-hero section reveal">
  <p class="eyebrow">Contact</p>
  <h1>Ready to ship something better?</h1>
  <p>
    Send a quick note with your project goals and timeline. JWK Technologies will follow up to schedule a
    consult.
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
      Project Type
      <select name="goal" value={form?.values?.goal || ''} required>
        <option value="">Select a service</option>
        <option>Website creation</option>
        <option>App creation</option>
        <option>QA product review</option>
        <option>Ongoing product support</option>
      </select>
    </label>
    <label>
      Message
      <textarea name="message" rows="5" placeholder="Tell us what you want to build or review">{form?.values?.message || ''}</textarea>
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
    <h2>Let&apos;s shape your next release.</h2>
    <ul class="contact-list">
      <li><span>Email</span><a href="mailto:job.johnson@jwkfit.org">job.johnson@jwkfit.org</a></li>
      <li><span>Phone</span><a href="tel:+14803073084">(480) 307-3084</a></li>
      <li><span>Location</span><p>Phoenix, AZ and remote delivery</p></li>
    </ul>
  </aside>
</section>
