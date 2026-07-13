import { Avatar } from "@/components/Avatar";
import { Links } from "@/components/Links";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-20">
      <Avatar />

      <h1 className="mt-6 text-xl font-semibold tracking-tight text-ink">
        Christophe Ribeiro
      </h1>
      <p className="text-grey">Technical founder · France</p>

      <div className="mt-7 flex flex-col gap-4 leading-relaxed text-body">
        <p>
          I build and ship software products on my own — from the first commit
          to the thing that goes live.
        </p>
        <p>
          Right now I&apos;m building a few products I&apos;m not ready to talk
          about yet, and I put small tools on npm along the way — like{" "}
          <code className="font-mono text-[0.9em]">npx christo</code>.
        </p>
      </div>

      <Links />
    </main>
  );
}
