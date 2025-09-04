import { redirect } from "next/navigation";

export default function Home() {
  // Redirect root to the Swedish marketing homepage
  redirect("/sv-se");
}
