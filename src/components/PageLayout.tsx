

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  
  return (
    <>
      <header>

      </header>

      <main>{children}</main>

      <footer>

      </footer>
    </>
  )
}