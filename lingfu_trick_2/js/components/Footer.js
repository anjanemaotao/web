function Footer({ text }) {
  try {
    return (
      <footer data-name="footer" className="py-6 mt-12 border-t border-border-color text-center opacity-80 text-sm">
        {text}
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    reportError(error);
    return null;
  }
}
