import Link from "next/link";

export default function SobrePage() {
    return (
        <main style={{ maxWidth: 720, margin: "80px auto", padding: 32 }}>
            <h1>Sobre nós</h1>
            <p>Esta página ainda não foi criada, mas em breve teremos mais informações.</p>
            <p>
                Enquanto isso, visite <Link href="/">a página inicial</Link> para conhecer
                nossos serviços.
            </p>
        </main>
    );
}
