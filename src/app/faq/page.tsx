import Link from "next/link";

export default function FaqPage() {
    return (
        <main style={{ maxWidth: 720, margin: "80px auto", padding: 32 }}>
            <h1>FAQ</h1>
            <p>Esta página ainda não foi criada. Em breve traremos perguntas frequentes.</p>
            <p>
                Volte para <Link href="/">a página inicial</Link> para continuar navegando.
            </p>
        </main>
    );
}
