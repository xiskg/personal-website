import { profile } from '../data/profile';

export function Footer() {
  return (
    <footer className="footer">
      <p className="m-0">
        Hand-drawn in Brazil · © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
