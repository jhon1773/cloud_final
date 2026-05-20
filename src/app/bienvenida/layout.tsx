export default function BienvenidaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: 0, padding: 0, width: "100vw", maxWidth: "100vw" }}>
      {children}
    </div>
  );
}