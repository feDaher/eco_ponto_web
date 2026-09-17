export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto flex flex-col items-center gap-2 px-4 py-6 text-sm text-gray-500 md:flex-row md:justify-between">
        <p>© {currentYear} EcoPonto Digital. All rights reserved.</p>
        <p>Manhuaçu, MG</p>
      </div>
    </footer>
  );
}
