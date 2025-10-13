import { requireUser } from "@/lib/auth";

export default async function SparadeSokningarPage() {
    await requireUser();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">Sparade sökningar</h1>
        </div>
    );
}
