import Navbar from "./_components/navbar";

export default function RootLayout({ children }) {
  return (
    <>
      <header>
        <Navbar/>
      </header>       
      <main className="container-full-content">
        {children}
      </main>
    </>
  );
}
