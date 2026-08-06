import Link from "next/link";

export default function ContatoPage() {
    return (
        <main style={{ maxWidth: 720, margin: "80px auto", padding: 32 }}>
            <h1>Contato</h1>
            <p>Estamos construindo esta página. Por enquanto, utilize nossos canais abaixo.</p>
            <ul>
                <li>Email: contato@barbehub.com.br</li>
                <li>Telefone: (79) 9 9999-1234</li>
            </ul>
            <p>
                Volte para <Link href="/">a página inicial</Link> para continuar navegando.
            </p>
        </main>
    );
}
