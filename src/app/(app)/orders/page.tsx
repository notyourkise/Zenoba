import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getMyOrders } from "@/features/commerce/entitlements";

export const metadata = {
  title: "Riwayat Pesanan — Netloka",
  description: "Riwayat transaksi dan status pembayaran paket belajar Netloka Anda.",
};

function getStateBadgeClass(state: string): string {
  switch (state) {
    case "PAID":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "EXPIRED":
      return "bg-zinc-800 text-zinc-400 border-zinc-700";
    case "CANCELLED":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-zinc-800 text-zinc-400 border-zinc-700";
  }
}

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }

  const orders = await getMyOrders(user.id);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Riwayat Pesanan
        </h1>
        <p className="mt-2 text-base text-zinc-400 max-w-2xl">
          Pantau status pemesanan, invoice pembayaran, dan riwayat aktivasi paket Anda.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-10 rounded-xl border border-white/10 bg-zinc-950 text-center space-y-4">
          <p className="text-base text-zinc-300 font-medium">
            Belum ada riwayat pesanan.
          </p>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Semua tagihan dan transaksi checkout Anda akan tercatat dengan status yang transparan di sini.
          </p>
          <div>
            <Link
              href="/catalog"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              Jelajahi Katalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-950">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-zinc-400 font-medium">
                <th className="py-3 px-4">Referensi</th>
                <th className="py-3 px-4">Paket / Item</th>
                <th className="py-3 px-4">Total Biaya</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tanggal Pesanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5">
                  <td className="py-3 px-4 font-mono text-xs text-cyan-400 font-semibold">
                    {order.reference}
                  </td>
                  <td className="py-3 px-4 font-medium">{order.packageTitle}</td>
                  <td className="py-3 px-4 font-semibold">
                    Rp {order.totalAmountIdr.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs border ${getStateBadgeClass(
                        order.state,
                      )}`}
                    >
                      {order.state}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
