import { requireUser } from "@/lib/auth";

export default async function SokPage() {
    await requireUser();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">Sök</h1>
        </div>
    );
}
