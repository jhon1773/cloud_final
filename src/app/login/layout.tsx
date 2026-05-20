export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}>
      {children}
    </div>
  );
}