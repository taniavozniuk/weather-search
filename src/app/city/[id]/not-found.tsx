import Link from 'next/link';

export default function NotFoundCity() {
  return (
    <div className="not-found">
      <h1>City not found</h1>
      <p>The city you are looking for does not exist.</p>
      <Link href="/" style={{ color: '#9cf' }}>
        Go back home
      </Link>
    </div>
  );
}
