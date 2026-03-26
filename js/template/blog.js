/* Optimaliseert hero van blogartikels */

<script>
document.addEventListener("DOMContentLoaded", function () {
  // Enkel draaien bij blogartikels
  const postHeader = document.querySelector(".post-header");
  const postTitle = document.querySelector(".post-header h1.post-title");
  const heroTitle = document.querySelector(".hero .text-widget-content h1");

  if (!postTitle || !heroTitle) return;

  // Zet de tekst van de blogtitel in de lege h1 van de hero
  heroTitle.textContent = postTitle.textContent.trim();

  // Verwijder de originele titel om dubbele h1's te verwijderen
  postHeader.remove();
});
</script>
