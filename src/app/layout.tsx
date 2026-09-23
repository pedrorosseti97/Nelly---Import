import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = { title: "Nelly Import", description: "Gestão de importações Antonelly" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
