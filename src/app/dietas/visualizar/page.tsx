import { Suspense } from "react";
import ClientPage from "./ClientPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Carregando...</div>}>
      <ClientPage />
    </Suspense>
  );
}
