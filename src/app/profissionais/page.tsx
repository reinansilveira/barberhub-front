import Link from "next/link";

export default function ProfissionaisPage() {
    return (
        <main style={{ maxWidth: 720, margin: "80px auto", padding: 32 }}>
            <h1>Profissionais</h1>
            <p>Para ver um profissional, acesse diretamente a página do profissional desejado.</p>
            <p>
                Na home, há uma lista de profissionais disponíveis com links para perfil.
            </p>
            <p>
                Volte para <Link href="/">a página inicial</Link> para escolher um profissional.
            </p>
        </main>
    );
}
