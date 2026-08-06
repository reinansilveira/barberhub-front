import Link from "next/link";

export default function ServicosPage() {
    return (
        <main style={{ maxWidth: 720, margin: "80px auto", padding: 32 }}>
            <h1>Serviços</h1>
            <p>A seção de serviços ainda não está disponível nesta versão.</p>
            <p>
                Você pode agendar um atendimento na <Link href="/">home</Link> ou
                procurar um profissional disponível.
            </p>
        </main>
    );
}
