import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export const metadata = {
  title: "Connexion — Core Society Board",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  async function login(formData: FormData) {
    "use server";

    const password = String(formData.get("password") ?? "");

    if (!process.env.BOARD_PASSWORD || password !== process.env.BOARD_PASSWORD) {
      redirect("/login?error=1");
    }

    const token = await createSessionToken(process.env.BOARD_SESSION_SECRET ?? "");

    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-4">
      <div className="w-full max-w-[320px] rounded-card border border-border bg-card p-8">
        <h1 className="text-[22px] leading-tight">
          <span className="font-[700] text-ink">Core Society </span>
          <span className="font-[300] text-[#aaa]">Board</span>
        </h1>
        <p className="mt-1 text-[9px] font-[600] uppercase tracking-[0.12em] text-muted-light">
          Accès privé
        </p>

        <form action={login} className="mt-6 flex flex-col gap-3">
          <input
            type="password"
            name="password"
            autoFocus
            required
            placeholder="Mot de passe"
            className="w-full rounded-card border border-border-strong bg-card px-3 py-2.5 text-[13px] font-[400] text-ink outline-none placeholder:text-muted-light focus:border-blue"
          />
          <button
            type="submit"
            className="w-full rounded-card bg-blue px-3 py-2.5 text-[12px] font-[600] uppercase tracking-[0.08em] text-card transition-opacity hover:opacity-90"
          >
            Se connecter
          </button>
        </form>

        {searchParams?.error && (
          <p className="mt-3 text-[11px] font-[500] text-urgent">
            Mot de passe incorrect.
          </p>
        )}
      </div>
    </main>
  );
}
