import Link from "next/link";

export default function AgendarPage() {
    return (
        <main style={{ maxWidth: 720, margin: "80px auto", padding: 32 }}>
            <h1>Agendar</h1>
            <p>Esta página ainda não possui conteúdo específico.</p>
            <p>
                Enquanto isso, volte para <Link href="/">a página inicial</Link> ou use o
                formulário de agendamento disponível na home.
            </p>
        </main>
    );
}
