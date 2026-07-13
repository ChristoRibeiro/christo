// Replace /me.svg with your photo (drop app/public/me.jpg and change the src).
export function Avatar() {
  return (
    <img
      src="/me.svg"
      alt="Christophe Ribeiro"
      width={64}
      height={64}
      className="h-16 w-16 rounded-full object-cover"
    />
  );
}
