import Link from "next/link";

interface Props {
  searchParams: Promise<{
    name?: string;
    professional?: string;
    service?: string;
    date?: string;
    time?: string;
  }>;
}

export default async function BookingSuccessPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  return (
    <main
      style={{
        maxWidth: 700,
        margin: "80px auto",
        padding: 32,
      }}
    >
      <div
        style={{
          borderRadius: 16,
          padding: 40,
          background: "#161616",
          color: "#fff",
          border: "1px solid #2c2c2c",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#c9a227",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            marginBottom: 24,
          }}
        >
          ✓
        </div>

        <h1>Agendamento confirmado!</h1>

        <p>
          Seu horário foi reservado com sucesso.
        </p>

        <hr />

        <p>
          <strong>Cliente:</strong> {params.name}
        </p>

        <p>
          <strong>Serviço:</strong> {params.service}
        </p>

        <p>
          <strong>Data:</strong> {params.date}
        </p>

        <p>
          <strong>Horário:</strong> {params.time}
        </p>

        <div
          style={{
            marginTop: 32,
            display: "flex",
            gap: 16,
          }}
        >
          <Link href="/">
            Voltar para o início
          </Link>

          <Link href="/professionals">
            Agendar outro horário
          </Link>
        </div>
      </div>
    </main>
  );
}