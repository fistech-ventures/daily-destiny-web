const html = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-KKJT0LE43M"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-KKJT0LE43M');
</script>`;

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  const fullTag = match[0];
  const innerContent = match[1];
  
  const srcMatch = fullTag.match(/src="([^"]+)"/);
  const asyncMatch = fullTag.match(/\basync\b/);
  const deferMatch = fullTag.match(/\bdefer\b/);
  
  console.log({
    fullTag,
    innerContent,
    src: srcMatch ? srcMatch[1] : null,
    async: !!asyncMatch,
    defer: !!deferMatch
  });
}
