import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { peso, alturaCm } = await req.json();

  if (!peso || !alturaCm) {
    return NextResponse.json(
      { error: "Peso e altura são obrigatórios." },
      { status: 400 }
    );
  }

  const alturaM = alturaCm / 100;
  const imc = peso / (alturaM * alturaM);

  let classificacao = "";
  if (imc < 18.5) classificacao = "Abaixo do peso";
  else if (imc < 25) classificacao = "Peso normal";
  else if (imc < 30) classificacao = "Sobrepeso";
  else classificacao = "Obesidade";

  return NextResponse.json({
    imc,
    classificacao,
  });
}
