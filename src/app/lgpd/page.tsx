import Link from "next/link";

export default function LgpdPage() {
    return (
        <main style={{ maxWidth: 720, margin: "80px auto", padding: 32 }}>
            <h1>LGPD</h1>
            <p>Esta página ainda não está disponível. Em breve publicaremos nossa política de proteção de dados.</p>
            <p>
                Para continuar navegando, volte para <Link href="/">a página inicial</Link>.
            </p>
        </main>
    );
}
