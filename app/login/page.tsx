import AuthForm from "./AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="min-h-screen grid place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="bg-gradient-to-br from-[#1f1f1d] to-[#33322e] text-[#f4f2ee] rounded-2xl p-6 mb-3">
          <h1 className="text-xl font-semibold tracking-tight">Prep OS</h1>
          <p className="text-[12.5px] text-[#b5b2ab] mt-1">
            24 weeks to a senior frontend offer.
          </p>
        </div>

        <AuthForm next={next ?? "/"} />
      </div>
    </main>
  );
}
