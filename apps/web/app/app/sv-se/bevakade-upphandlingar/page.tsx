import { requireUser } from "@/lib/auth";

export default async function BevakadeUpphandlingarPage() {
    await requireUser();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">Bevakade upphandlingar</h1>
        </div>
    );
}
